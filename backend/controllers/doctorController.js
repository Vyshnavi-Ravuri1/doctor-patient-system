const jwt = require("jsonwebtoken");

const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email !== process.env.DOCTOR_EMAIL ||
            password !== process.env.DOCTOR_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                role: "doctor",
                email: email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};

module.exports = {
    doctorLogin,
};