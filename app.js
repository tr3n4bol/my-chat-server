const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const { METHODS } = require("http");
const message = require("./models/message");

app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        METHODS: ["GET", "POST"],
    },
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

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
});

module.exports = server;
