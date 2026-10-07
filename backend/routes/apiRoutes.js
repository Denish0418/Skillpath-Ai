import express from "express";
import { generateStaticRoadmap } from "../services/roadmapService.js";
import Roadmap from "../model/roadmap.js";
import Progress from "../model/progress.js";
import { connectDB } from "../config/db.js";

const router = express.Router();

// Generate and Save Roadmap
router.post("/roadmap/generate", async (req, res) => {
    try {
        await connectDB();
        const { userId, careerGoal, skills, studyHours } = req.body;
        
        if (!userId || !careerGoal || !studyHours) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await generateStaticRoadmap({
            userId,
            careerGoal,
            skills: skills || [],
            studyHours: Number(studyHours)
        });

        return res.status(200).json({ 
            message: "Roadmap generated successfully",
            roadmap: result.roadmap,
            progress: result.progress
        });
    } catch (error) {
        console.error("Error generating roadmap:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Save roadmap manually
router.post("/roadmap/save", async (req, res) => {
    try {
        await connectDB();
        return res.status(200).json({ message: "Roadmap saved via generate endpoint" });
    } catch (error) {
        console.error("Error in /roadmap/save:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Get roadmap by User ID
router.get("/roadmap/:userId", async (req, res) => {
    try {
        await connectDB();
        const roadmap = await Roadmap.findOne({ userId: req.params.userId });
        if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });
        
        return res.status(200).json(roadmap);
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Update Progress
router.post("/progress/update", async (req, res) => {
    try {
        await connectDB();
        const { userId, skill } = req.body;
        
        const roadmap = await Roadmap.findOne({ userId });
        const progress = await Progress.findOne({ userId });
        
        if (!roadmap || !progress) {
            return res.status(404).json({ error: "Data not found" });
        }

        // Add skill to completed
        if (!progress.completedSkills.includes(skill)) {
            progress.completedSkills.push(skill);
            
            // Calculate percentage
            const totalSkills = roadmap.roadmap ? roadmap.roadmap.length : 1;
            const completedCount = progress.completedSkills.length;
            progress.percentage = Math.round((completedCount / totalSkills) * 100);
            
            await progress.save();
        }

        return res.status(200).json(progress);
    } catch (error) {
        console.error("Error updating progress:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Get Progress by User ID
router.get("/progress/:userId", async (req, res) => {
    try {
        await connectDB();
        const progress = await Progress.findOne({ userId: req.params.userId });
        if (!progress) return res.status(404).json({ error: "Progress not found" });
        
        return res.status(200).json(progress);
    } catch (error) {
        console.error("Error fetching progress:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

export default router;

