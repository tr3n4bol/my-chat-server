const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");
const message = require("../models/message");
const cloudinary = require("../config/cloudinary");
const { response } = require("express");

router.get("/get-logged-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });

        res.send({
            message: "User fetched successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const users = await User.find({ _id: { $ne: userId } });

        res.send({
            message: "All users fetched successfully",
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

// TODO
// Ограничить размер изображения на фронте
// Сделать удаление предыдущей аватарки с cloudinary
router.post("/upload-profile-pic", authMiddleware, async (req, res) => {
    try {
        const image = req.body.image;

        const imgUrl = await cloudinary.uploader.upload(image, {
            folder: "my-chat",
        });

        const user = await User.findByIdAndUpdate(
            { _id: req.userId },
            { profilePicture: imgUrl.secure_url },
            { new: true },
        );

        res.status(201).send({
            message: "Profile picture uploaded successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

module.exports = router;
