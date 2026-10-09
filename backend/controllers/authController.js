import User from "../model/user.js";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "skillpath_ai_dev_secret_key_2026";

export const registerUser = async (req, res) => {
    try {
        await connectDB();
        
        console.log(">>> [AUTH REGISTER] Incoming Registration Request:", {
            name: req.body?.name || req.body?.fullName,
            email: req.body?.email,
            education: req.body?.education,
            careerGoal: req.body?.careerGoal,
            skillLevel: req.body?.skillLevel,
            password: req.body?.password ? "[PROVIDED]" : "[MISSING]"
        });

        const {
            name,
            fullName,
            email,
            password,
            education,
            careerGoal,
            skillLevel
        } = req.body || {};

        const userName = (name || fullName || "").trim();
        const userEmail = (email || "").trim().toLowerCase();

        if (!userName || !userEmail || !password) {
            console.log(">>> [AUTH REGISTER] Registration validation failed: missing required fields");
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
                error: "Name, email, and password are required."
            });
        }

        const existingUser = await User.findOne({ email: userEmail });

        if (existingUser) {
            console.log(`>>> [AUTH REGISTER] Registration rejected: User already exists for email '${userEmail}'`);
            return res.status(409).json({
                success: false,
                message: "User already exists with this email address.",
                error: "User already exists with this email address."
            });
        }

        // Pass raw password to User.create; pre('save') hook in User model handles single bcrypt hashing
        const user = await User.create({
            name: userName,
            email: userEmail,
            password,
            education: education || "B.Tech",
            careerGoal: careerGoal || "Full Stack Developer",
            skillLevel: skillLevel || "Beginner"
        });

        console.log(`>>> [AUTH REGISTER] User registered successfully: ID ${user._id}, Email: ${user.email}`);

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            education: user.education,
            careerGoal: user.careerGoal,
            skillLevel: user.skillLevel
        };

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user: safeUser
        });
    } catch (error) {
        console.error(">>> [AUTH REGISTER] Exception during registration:", error);

        // Handle MongoDB Duplicate Key Error (Code 11000)
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists with this email address."
            });
        }

        // Handle Mongoose Validation Error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        if (!res.headersSent) {
            return res.status(500).json({
                message: error.message || "Internal server error"
            });
        }
    }
};

export const loginUser = async (req, res) => {
    try {
        await connectDB();
        
        const { email, username, password } = req.body || {};
        const rawEmail = email || username || "";
        const userEmail = rawEmail.trim().toLowerCase();

        console.log(">>> [AUTH LOGIN] Request Received:", {
            parsedEmail: userEmail,
            passwordProvided: Boolean(password)
        });

        if (!userEmail || !password) {
            console.log(">>> [AUTH LOGIN] Rejected: Missing email or password");
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
                error: "Email and password are required."
            });
        }

        // Query user by email (User model has lowercase: true & trim: true)
        const user = await User.findOne({ email: userEmail });

        console.log(
            ">>> [AUTH LOGIN] User.findOne Query Result:",
            user ? `FOUND (User ID: ${user._id}, Name: ${user.name}, Email: ${user.email})` : `NOT FOUND for '${userEmail}'`
        );

        if (!user) {
            console.log(`>>> [AUTH LOGIN] Failed: No user account found for email '${userEmail}'`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log(">>> [AUTH LOGIN] Comparing password hash with bcrypt.compare...");
        const isMatch = await user.comparePassword(password);
        console.log(`>>> [AUTH LOGIN] Password Match Result (isMatch): ${isMatch}`);

        if (!isMatch) {
            console.log(`>>> [AUTH LOGIN] Failed: Incorrect password for user '${userEmail}'`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const secret = process.env.JWT_SECRET || "default_jwt_secret_dev";
        const token = jwt.sign(
            { id: user._id, email: user.email },
            secret,
            { expiresIn: "7d" }
        );

        const safeUser = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            education: user.education,
            careerGoal: user.careerGoal,
            skillLevel: user.skillLevel
        };

        console.log(`>>> [AUTH LOGIN] SUCCESS: Login completed for user '${user.email}'`);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: safeUser
        });
    } catch (error) {
        console.error("Login Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({
                message: error.message || "Internal server error"
            });
        }
    }
};