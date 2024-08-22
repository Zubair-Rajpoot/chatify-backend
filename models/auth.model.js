import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    }

}, { timestamps: true })

export default mongoose.model("User", authSchema)