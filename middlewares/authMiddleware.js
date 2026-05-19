const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
};
