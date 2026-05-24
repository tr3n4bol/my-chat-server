const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const message = require("./models/message");

app.use(express.json({ limit: "50mb" }));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const onlineUsers = [];

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

io.on("connection", (socket) => {
    socket.on("join-room", (userId) => {
        socket.join(userId);
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

    // TODO
    // Fix online users
    socket.on("user-login", (userId) => {
        if (!onlineUsers.includes(userId)) {
            onlineUsers.push(userId);
        }
        socket.emit("online-users", onlineUsers);
    });

    socket.on("user-logout", (userId) => {
        onlineUsers.splice(onlineUsers.indexOf(userId), 1);
        io.emit("online-users-updated", onlineUsers);
    });
});

module.exports = server;
