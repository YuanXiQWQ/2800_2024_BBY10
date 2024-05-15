import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        height: {
            type: Number,
            required: false,
        },
        weight: {
            type: Number,
            required: false,
        },
        goal: {
            type: String,
            required: false,
        },
        time: {
            type: [Number],
            required: false,
            enum: [0, 1, 2, 3, 4, 5, 6],
        },
        birthday: {
            type: Date,
            required: false,
        },
        fitnessLevel: {
            type: String,
            required: false,
            enum: ["beginner", "intermediate", "advanced"],
        },
    },
    {timestamps: true}
);

const User = mongoose.model("users", userSchema);

module.exports = User;
