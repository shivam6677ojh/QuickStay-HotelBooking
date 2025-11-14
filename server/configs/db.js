import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    // If already connected, return existing connection
    if (mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection");
        return mongoose.connection;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 2) {
        console.log("Waiting for MongoDB connection...");
        await new Promise((resolve) => {
            mongoose.connection.once('connected', resolve);
        });
        return mongoose.connection;
    }

    // Attach event listeners only once
    if (!mongoose.connection.listeners('connected').length) {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });
    }

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quickstay';
        console.log("Establishing new MongoDB connection...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB initial connection failed:", error.message);
        throw error;
    }
};

export default connectDB;
