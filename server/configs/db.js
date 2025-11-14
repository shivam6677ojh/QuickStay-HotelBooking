import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    // If already connected, return existing connection
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    // Attach event listeners
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
    });

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quickstay';
        await mongoose.connect(uri);
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB initial connection failed:", error.message);
        // In serverless, don't exit - just log the error
        throw error;
    }
};

export default connectDB;
