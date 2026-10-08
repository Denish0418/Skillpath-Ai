import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://skillpath-ai-nu.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS to all incoming requests
app.use(cors(corsOptions));

// Explicitly handle all preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

// Routes follow here...
// app.use("/api/auth", authRoutes);

// MUST export default app for Vercel serverless execution
export default app;