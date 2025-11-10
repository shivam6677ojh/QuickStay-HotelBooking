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
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB initial connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
