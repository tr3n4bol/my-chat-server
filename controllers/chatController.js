const router = require("express").Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const authMiddleware = require("../middlewares/authMiddleware");

//TODO Переделать валидацию
router.post("/create-new-chat", authMiddleware, async (req, res) => {
    try {
        const { members } = req.body;

        if (!Array.isArray(members) || members.length !== 2) {
            return res.status(400).send({
                message: "В чате должно быть 2 участника",
                success: false,
            });
        }

        const sortedMembers = [
            ...new Set(members.map((member) => member.toString())),
        ].sort();

        if (sortedMembers.length !== 2) {
            return res.status(400).send({
                message: "Участники чата должны быть разными пользователями",
                success: false,
            });
        }

        const existingUsersCount = await User.countDocuments({
            _id: { $in: sortedMembers },
        });

        if (existingUsersCount !== 2) {
            return res.status(404).send({
                message: "Один или оба пользователя не существуют",
                success: false,
            });
        }

        const existingChat = await Chat.findOne({
            "members.0": sortedMembers[0],
            "members.1": sortedMembers[1],
        }).populate("members");

        if (existingChat) {
            return res.status(400).send({
                message: "Чат уже существует",
                success: false,
            });
        }

        const savedChat = await Chat.create({
            members: sortedMembers,
        });
        await savedChat.populate("members");

        return res.status(201).send({
            message: "Чат успешно создан",
            success: true,
            data: savedChat,
        });
    } catch (error) {
        return res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

router.get("/get-all-chats", authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({
            members: { $in: req.userId },
        })
            .populate("members")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        return res.status(200).send({
            message: "Chats fetched successfully",
            success: true,
            data: chats,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

module.exports = router;
