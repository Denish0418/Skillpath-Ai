import mongoose from "mongoose";

/**
 * Global connection caching pattern for Mongoose in Serverless environments (Vercel).
 * Reuses existing cached connection across function invocations to prevent connection pool exhaustion.
 */
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        let mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
                throw new Error("MONGO_URI environment variable is missing in production deployment. Please set MONGO_URI in your Vercel Project Settings.");
            }
            mongoUri = "mongodb://127.0.0.1:27017/skillpathai";
        }

        const opts = {
            bufferCommands: false, // Fail fast on database operation if connection is not active
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
        };

        cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
            console.log("MongoDB Connected successfully");
            return m;
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

