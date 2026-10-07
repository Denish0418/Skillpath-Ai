import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// Database connection middleware for Vercel serverless & local server execution
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        res.status(500).json({
            error: "Database Connection Failed",
            message: error.message
        });
    }
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "SkillPath AI Backend Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// Global Error Handler middleware for Express on Vercel Serverless
app.use((err, req, res, next) => {
    console.error("Unhandled Express Application Error:", err);
    if (!res.headersSent) {
        res.status(500).json({
            error: "Internal Server Error",
            message: err.message || "An unexpected error occurred."
        });
    }
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;