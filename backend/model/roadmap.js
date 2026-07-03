import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        skills: {
            type: [String],
            default: []
        },
        careerGoal: {
            type: String,
            required: true
        },
        studyHours: {
            type: Number,
            required: true
        },
        roadmap: {
            type: [String],
            default: []
        },
        timeline: {
            type: String,
            required: true
        },
        recommendedVideos: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
