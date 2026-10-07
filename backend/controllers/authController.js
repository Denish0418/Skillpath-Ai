import User from "../model/user.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            education,
            careerGoal,
            skillLevel
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            education,
            careerGoal,
            skillLevel
        });

        res.status(201).json({
            message: "Registration Successful",
            user
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({
            error: error.message,
            message: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            message: "Login Successful",
            user
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({
            error: error.message,
            message: error.message
        });
    }
};