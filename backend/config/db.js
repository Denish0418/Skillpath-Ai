import mongoose from "mongoose";

/**
 * Lazy, global connection caching pattern for Mongoose in Serverless environments (Vercel).
 * Reuses existing cached connection across function invocations to prevent connection pool exhaustion.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoUri) {
            if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
                throw new Error(
                    "Missing database connection string: Neither MONGO_URI nor MONGODB_URI environment variable is defined in Vercel Settings > Environment Variables."
                );
            }
            mongoUri = "mongodb://127.0.0.1:27017/skillpathai";
        }

        const opts = {
            bufferCommands: false, // Fail fast on database operation if connection is not active
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging serverless invocation
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


