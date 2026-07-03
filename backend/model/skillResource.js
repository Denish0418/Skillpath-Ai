import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
});

const skillResourceSchema = new mongoose.Schema(
    {
        skillName: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        youtubePlaylists: [playlistSchema],
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner"
        },
        prerequisites: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const SkillResource = mongoose.model("SkillResource", skillResourceSchema);

export default SkillResource;
