import mongoose from "mongoose";

const careerPathSchema = new mongoose.Schema(
    {
        goalTitle: {
            type: String,
            required: true,
            unique: true
        },
        requiredSkills: {
            type: [String],
            required: true
        },
        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const CareerPath = mongoose.model("CareerPath", careerPathSchema);

export default CareerPath;
