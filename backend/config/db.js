import mongoose from "mongoose";

/**
 * Global caching mechanism for Mongoose connection in Serverless environments (e.g. Vercel).
 * Prevents multiple connections being created per request and exhausting the database connection pool.
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
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillpathai";

        const opts = {
            bufferCommands: false, // Disable buffering so requests fail fast if connection is down
            serverSelectionTimeoutMS: 5000, // Connection attempt timeout (5s)
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
