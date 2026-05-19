const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users",
                    required: true,
                },
            ],
        },

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
        },

        unreadMessageCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

chatSchema.index({ "members.0": 1, "members.1": 1 }, { unique: true });

module.exports = mongoose.model("chats", chatSchema);
