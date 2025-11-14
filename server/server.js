import express from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clearWebhook from "./controllers/ClerkWebhooks.js";
import userRouter from "./routes/UserRoutes.js";
import HotelRoutes from "./routes/HotelRoutes.js";
import connectCloudinary from "./configs/Cloudinary.js";
import RoomRouter from "./routes/RoomRoutes.js";
import BookingRouter from "./routes/BookingRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";

const app = express()

// MongoDB connection caching for serverless
let cachedDb = null;
let isConnecting = false;

async function ensureDBConnection() {
    if (cachedDb) {
        return cachedDb;
    }
    
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
        // Wait for the existing connection attempt
        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return cachedDb;
    }
    
    isConnecting = true;
    try {
        console.log('Initializing database connection...');
        cachedDb = await connectDB();
        await connectCloudinary();
        console.log('Database connection established');
    } catch (error) {
        console.error('Connection initialization error:', error);
        throw error;
    } finally {
        isConnecting = false;
    }
    return cachedDb;
}

app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection before processing requests
app.use(async (req, res, next) => {
    try {
        await ensureDBConnection();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({ 
            success: false, 
            message: 'Database connection failed. Please try again.' 
        });
    }
});

app.use(clerkMiddleware());

// Api to listen cleark webhooks
app.use("/api/clerk", clearWebhook);
app.use("/api/user", userRouter);
app.use("/api/hotel", HotelRoutes)
app.use("/api/room", RoomRouter)
app.use("/api/booking", BookingRouter)
app.use("/api/admin", AdminRoutes)

app.get("/", (req, res) => {
    res.send("API is running fine")
    console.log("API is running fine")
})

// For Vercel serverless deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
} 