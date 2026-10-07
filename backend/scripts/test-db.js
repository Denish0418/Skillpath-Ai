import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";

// Ensure DNS SRV queries resolve reliably across local networks
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
    // Ignore if environment prevents setting custom DNS servers
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in backend or root
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function maskUri(uri) {
    if (!uri) return "UNDEFINED";
    return uri.replace(/:([^:@]+)@/, ":****@");
}

async function testDatabaseConnection() {
    console.log("==========================================");
    console.log("  SkillPath AI — Database Connection Test ");
    console.log("==========================================\n");

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    // Stage 1: Environment variable check
    console.log("Stage 1: Checking MONGO_URI configuration...");
    if (!mongoUri) {
        console.error("❌ Stage 1 Failed: MONGO_URI is missing from environment variables.");
        process.exit(1);
    }

    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
        console.error(`❌ Stage 1 Failed: Invalid MONGO_URI prefix: "${maskUri(mongoUri)}". Must start with 'mongodb://' or 'mongodb+srv://'.`);
        process.exit(1);
    }

    console.log(`✅ Stage 1 Passed: Loaded MONGO_URI (${maskUri(mongoUri)})\n`);

    // Stage 2: Mongoose Connection Attempt
    console.log("Stage 2: Connecting to MongoDB cluster via Mongoose...");
    const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
    };

    try {
        await mongoose.connect(mongoUri, opts);
        console.log("✅ Stage 2 Passed: Connected to MongoDB successfully.\n");

        // Stage 3: Admin Ping Test
        console.log("Stage 3: Sending admin ping command to database...");
        const pingResult = await mongoose.connection.db.admin().ping();
        console.log("✅ Stage 3 Passed: Ping response received:", pingResult, "\n");

        // Stage 4: Clean Disconnect
        console.log("Stage 4: Closing database connection...");
        await mongoose.disconnect();
        console.log("✅ Stage 4 Passed: Connection closed cleanly.\n");

        console.log("==========================================");
        console.log("  🎉 Database Connection Test Successful!");
        console.log("==========================================");
    } catch (err) {
        console.error("\n❌ Database Connection Test Failed!");
        console.error("  Error Name   :", err.name);
        console.error("  Error Message:", err.message);
        console.error("  Error Code   :", err.code || "N/A");
        console.error("  Error Reason :", err.reason || err.cause || "N/A");
        console.error("\nFull Error Stack:\n", err.stack);
        process.exit(1);
    }
}

testDatabaseConnection();
