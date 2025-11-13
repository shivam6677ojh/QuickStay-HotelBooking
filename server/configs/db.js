import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
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
    } catch (error) {
        console.error("MongoDB initial connection failed:", error.message);
        // In development allow server to continue running so other features can be tested.
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;
