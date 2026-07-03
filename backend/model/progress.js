import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        completedSkills: {
            type: [String],
            default: []
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
