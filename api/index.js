import app from "../backend/server.js";

export default async function handler(req, res) {
    try {
        return app(req, res);
    } catch (error) {
        console.error("Vercel Serverless Function Invocation Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                error: "Serverless Function Invocation Failed",
                message: error.message || "An unhandled error occurred during serverless function execution."
            });
        }
    }
}

