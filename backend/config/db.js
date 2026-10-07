import mongoose from "mongoose";
import dns from "dns";

// Ensure DNS SRV queries resolve reliably across environments
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
    // Ignore if platform restricts DNS server modification
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error("Please define the MONGO_URI environment variable inside .env");
    }

    if (!cached.promise) {
        console.log("MongoDB connection initiated...");
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
            })
            .then((m) => {
                console.log(`MongoDB connected successfully to ${m.connection.host}`);
                return m;
            })
            .catch((err) => {
                console.error("MongoDB connection failed:", err.message);
                cached.promise = null;
                throw err;
            });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}

export default connectDB;



