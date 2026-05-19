const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");

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

module.exports = router;
