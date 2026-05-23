const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const { METHODS } = require("http");

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
    console.log("Connected on socket:" + socket.id);
});

module.exports = server;
