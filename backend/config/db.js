import mongoose from "mongoose";
import dns from "dns";

// Ensure DNS SRV queries resolve reliably across environments
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
    // Ignore if platform restricts DNS server modification
}

let isConnected = false;

export const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error("Missing MONGODB_URI or MONGO_URI");
    }

    console.log("MongoDB connection initiated...");
    const db = await mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
    });
    isConnected = Boolean(db.connections[0].readyState);
    console.log(`MongoDB connected successfully to ${db.connection.host}`);
    return db;
};

export default connectDB;



