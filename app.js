const express = require("express");
const cors = require("cors");

const app = express();

const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");

const allowedOrigins = [
    "http://localhost:3000"
];

app.use(express.json({ limit: "50mb" }));

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
);

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const onlineUsers = new Map();

const getOnlineUserIds = () => {
    return Array.from(onlineUsers.keys());
};

const emitOnlineUsers = () => {
    io.emit("online-users-updated", getOnlineUserIds());
};

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

io.on("connection", (socket) => {
    socket.on("join-room", (userId) => {
        socket.join(userId);
    });

    socket.on("user-login", (userId) => {
        if (!userId) return;

        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }

        onlineUsers.get(userId).add(socket.id);
        socket.data.userId = userId;

        emitOnlineUsers();
    });

    socket.on("user-logout", (userId) => {
        if (!userId) return;

        const userSockets = onlineUsers.get(userId);

        if (userSockets) {
            userSockets.delete(socket.id);

            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
            }
        }

        emitOnlineUsers();
    });

    socket.on("send-message", (data) => {
        io.to(data.members[0])
            .to(data.members[1])
            .emit("receive-message", data);

        io.to(data.members[0])
            .to(data.members[1])
            .emit("set-message-count", data);
    });

    socket.on("clear-unread-messages", (data) => {
        io.to(data.members[0])
            .to(data.members[1])
            .emit("message-count-cleared", data);
    });

    socket.on("typing", (data) => {
        io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
    });

    socket.on("disconnect", () => {
        const userId = socket.data.userId;

        if (!userId) {
            return;
        }

        const userSockets = onlineUsers.get(userId);

        if (userSockets) {
            userSockets.delete(socket.id);

            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
            }
        }

        emitOnlineUsers();
    });
});

module.exports = server;
