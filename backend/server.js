import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
    try {
        const dotenv = await import("dotenv");
        if (dotenv.default && typeof dotenv.default.config === "function") {
            dotenv.default.config({ path: path.join(__dirname, ".env") });
            dotenv.default.config();
        } else if (typeof dotenv.config === "function") {
            dotenv.config();
        }
    } catch (err) {
        // Silently proceed in serverless runtime
    }
}

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Database connection middleware for Vercel serverless & local server execution
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database Connection Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({
                error: "Database Connection Failed",
                message: error.message || "Failed to connect to the database."
            });
        }
    }
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "SkillPath AI Backend Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// Global Error Handler middleware for Express on Vercel Serverless
app.use((err, req, res, _next) => {
    console.error("Unhandled Express Application Error:", err);
    if (!res.headersSent) {
        res.status(500).json({
            error: "Internal Server Error",
            message: err.message || "An unexpected error occurred."
        });
    }
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

export default app;