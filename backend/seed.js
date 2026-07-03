import mongoose from "mongoose";
import dotenv from "dotenv";
import CareerPath from "./model/careerPath.js";
import SkillResource from "./model/skillResource.js";
import { CAREER_PATHS, SKILL_RESOURCES } from "./config/seedData.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/skillpathai";

const seedDatabase = async () => {
    try {
        console.log("Connecting to database at:", mongoUri);
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB!");

        // 1. Clear existing data
        console.log("Clearing existing CareerPaths and SkillResources...");
        await CareerPath.deleteMany({});
        await SkillResource.deleteMany({});

        // 2. Prepare and Seed Career Paths
        console.log("Seeding Career Paths...");
        const careerPathDocs = Object.keys(CAREER_PATHS).map(goal => {
            const pathInfo = CAREER_PATHS[goal];
            // Flatten skills from all months
            const allSkills = [];
            pathInfo.roadmap.forEach(m => {
                m.skills.forEach(s => {
                    if (!allSkills.includes(s)) allSkills.push(s);
                });
            });

            return {
                goalTitle: goal,
                requiredSkills: allSkills,
                description: `Complete step-by-step learning path to master skills required for a ${goal}.`
            };
        });

        await CareerPath.insertMany(careerPathDocs);
        console.log(`Successfully seeded ${careerPathDocs.length} career paths!`);

        // 3. Prepare and Seed Skill Resources
        console.log("Seeding Skill Resources...");
        const skillResourceDocs = Object.keys(SKILL_RESOURCES).map(skillName => {
            const res = SKILL_RESOURCES[skillName];
            return {
                skillName: skillName,
                description: `Comprehensive video tutorial, online course, and official documentation to learn ${skillName}.`,
                youtubePlaylists: [{ title: `${skillName} Curated Playlist`, url: res.youtube }],
                difficulty: "beginner",
                prerequisites: []
            };
        });

        await SkillResource.insertMany(skillResourceDocs);
        console.log(`Successfully seeded ${skillResourceDocs.length} skill resources!`);

        console.log("Seeding complete! Closing connection...");
        await mongoose.disconnect();
        console.log("Database connection closed cleanly.");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
