import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        education: {
            type: String,
            default: ""
        },
        skills: {
            type: [String],
            default: []
        },
        careerGoal: {
            type: String,
            default: ""
        },
        studyHours: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving if modified and not already hashed
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (this.password && (this.password.startsWith("$2a$") || this.password.startsWith("$2b$"))) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare candidate password with stored hashed password safely
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password || !candidatePassword) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;