import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";

// Ensure DNS SRV queries resolve reliably across environments
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
    // Ignore if platform restricts DNS server modification
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in root or backend
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

const LOCAL_URI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/skillpathai";
const ATLAS_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

function maskUri(uri) {
    if (!uri) return "UNDEFINED";
    return uri.replace(/:([^:@]+)@/, ":****@");
}

async function migrateToAtlas() {
    console.log("==================================================");
    console.log("  SkillPath AI — Local to Atlas Data Migration   ");
    console.log("==================================================\n");

    console.log(`Target Atlas URI: ${maskUri(ATLAS_URI)}`);

    if (!ATLAS_URI) {
        console.error("❌ Migration Failed: MONGO_URI is not defined in .env");
        process.exit(1);
    }

    let localClient = null;
    let atlasClient = null;

    try {
        console.log(`1. Connecting to local MongoDB at: ${LOCAL_URI}...`);
        localClient = new MongoClient(LOCAL_URI, { serverSelectionTimeoutMS: 3000 });
        await localClient.connect();
        console.log("✅ Connected to local MongoDB.\n");

        console.log("2. Connecting to MongoDB Atlas cluster...");
        atlasClient = new MongoClient(ATLAS_URI, { serverSelectionTimeoutMS: 8000 });
        await atlasClient.connect();
        console.log("✅ Connected to MongoDB Atlas.\n");

        const localDb = localClient.db();
        const atlasDb = atlasClient.db();

        const collections = await localDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections in local database:\n`);

        for (const colInfo of collections) {
            const colName = colInfo.name;
            if (colName.startsWith("system.")) continue;

            console.log(`📦 Processing collection: "${colName}"...`);
            const localCol = localDb.collection(colName);
            const atlasCol = atlasDb.collection(colName);

            const docs = await localCol.find({}).toArray();
            if (docs.length === 0) {
                console.log(`   → Collection "${colName}" is empty. Skipping.\n`);
                continue;
            }

            console.log(`   → Found ${docs.length} documents. Copying to Atlas...`);

            let copiedCount = 0;
            let skippedCount = 0;

            for (const doc of docs) {
                const filter = { _id: doc._id };
                const result = await atlasCol.replaceOne(filter, doc, { upsert: true });
                if (result.upsertedCount > 0 || result.modifiedCount > 0) {
                    copiedCount++;
                } else {
                    skippedCount++;
                }
            }

            console.log(`   ✅ Migration for "${colName}" complete: ${copiedCount} copied/updated, ${skippedCount} unchanged.\n`);
        }

        console.log("==================================================");
        console.log("  🎉 Data Migration to MongoDB Atlas Successful! ");
        console.log("==================================================");
    } catch (err) {
        console.error("\n❌ Migration Log Info:", err.message);
        if (err.message.includes("ECONNREFUSED") && err.message.includes("127.0.0.1")) {
            console.log("\n💡 Note: Local MongoDB instance at 127.0.0.1:27017 was not active or not installed.");
            console.log("   If starting fresh on Atlas, database seeding scripts (backend/seed.js) can be run directly.");
        }
    } finally {
        if (localClient) await localClient.close();
        if (atlasClient) await atlasClient.close();
    }
}

migrateToAtlas();
