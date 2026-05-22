const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/chat");
const Message = require("../models/message");

router.post("/new-message", authMiddleware, async (req, res) => {
    try {
        newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        currentChat = await Chat.findOneAndUpdate(
            {
                _id: req.body.chatId,
            },
            {
                lastMessage: savedMessage._id,
                $inc: { unreadMessageCount: 1 },
            },
        );

        res.status(201).send({
            message: "Sent successfully",
            success: true,
            data: savedMessage,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

// TODO
// Добавить проверку по user._id
router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
    try {
        const allMessages = await Message.find({
            chatId: req.params.chatId,
        }).sort({
            createdAt: 1,
        });
        res.status(200).send({
            message: "Messages fetched successfully",
            success: true,
            data: allMessages,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

module.exports = router;
