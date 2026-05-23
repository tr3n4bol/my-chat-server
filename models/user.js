const mongoose = require("mongoose");

// TODO
// Валидация полей (john smith -> John Smith)
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        profilePicture: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("users", userSchema);
