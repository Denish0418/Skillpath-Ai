import express from "express";
import { generateStaticRoadmap } from "../services/roadmapService.js";
import Roadmap from "../model/roadmap.js";
import Progress from "../model/progress.js";

const router = express.Router();

// Generate and Save Roadmap
router.post("/roadmap/generate", async (req, res) => {
    try {
        const { userId, careerGoal, skills, studyHours } = req.body;
        
        if (!userId || !careerGoal || !studyHours) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await generateStaticRoadmap({
            userId,
            careerGoal,
            skills: skills || [],
            studyHours: Number(studyHours)
        });

        res.status(200).json({ 
            message: "Roadmap generated successfully",
            roadmap: result.roadmap,
            progress: result.progress
        });
    } catch (error) {
        console.error("Error generating roadmap:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Save roadmap manually (if needed, but generate already saves)
router.post("/roadmap/save", async (req, res) => {
    // Redundant for now since generate saves, but keeping the endpoint per request
    res.status(200).json({ message: "Roadmap saved via generate endpoint" });
});

// Get roadmap by User ID
router.get("/roadmap/:userId", async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ userId: req.params.userId });
        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
        
        res.status(200).json(roadmap);
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        res.status(500).json({ error: error.message, message: "Internal server error" });
    }
});

// Update Progress
router.post("/progress/update", async (req, res) => {
    try {
        const { userId, skill } = req.body;
        
        const roadmap = await Roadmap.findOne({ userId });
        const progress = await Progress.findOne({ userId });
        
        if (!roadmap || !progress) {
            return res.status(404).json({ message: "Data not found" });
        }

        // Add skill to completed
        if (!progress.completedSkills.includes(skill)) {
            progress.completedSkills.push(skill);
            
            // Calculate percentage
            const totalSkills = roadmap.roadmap.length;
            const completedCount = progress.completedSkills.length;
            progress.percentage = Math.round((completedCount / totalSkills) * 100);
            
            await progress.save();
        }

        res.status(200).json(progress);
    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ error: error.message, message: "Internal server error" });
    }
});

// Get Progress by User ID
router.get("/progress/:userId", async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.params.userId });
        if (!progress) return res.status(404).json({ message: "Progress not found" });
        
        res.status(200).json(progress);
    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ error: error.message, message: "Internal server error" });
    }
});

export default router;
