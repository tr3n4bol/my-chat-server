const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.post("/signup", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user)
            return res.status(400).send({
                message: "User already exists",
                success: false,
            });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();

        return res.status(201).send({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select(
            "+password",
        );
        if (!user) {
            return res.status(400).send({
                message: "User does not exist",
                success: false,
            });
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            return res.status(400).send({
                message: "Invalid password",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
            expiresIn: "1d",
        });

        res.status(200).send({
            message: "User logged in successfully",
            success: true,
            token: token,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
});

module.exports = router;
