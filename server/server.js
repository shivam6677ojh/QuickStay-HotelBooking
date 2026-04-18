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
import ChatRoutes from "./routes/ChatRoutes.js";
import rateLimit from "express-rate-limit";

const app = express()

// Trust proxy for accurate IPs behind Vercel/Proxies
app.set('trust proxy', 1);

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

// Request logging middleware
app.use((req, res, next) => {
    // console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// Global rate limiter for all API routes
const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000), // default 1 minute
    max: Number(process.env.RATE_LIMIT_MAX || 300), // default 300 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Stricter limiter for AI chat endpoint
const aiLimiter = rateLimit({
    windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.AI_RATE_LIMIT_MAX || 20), // default 20 requests/min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'AI concierge rate limit exceeded. Please wait a minute.'
    }
});

// Api to listen cleark webhooks
app.use('/api', apiLimiter);
app.use("/api/clerk", clearWebhook);
app.use("/api/user", userRouter);
app.use("/api/hotel", HotelRoutes)
app.use("/api/room", RoomRouter)
app.use("/api/booking", BookingRouter)
app.use("/api/admin", AdminRoutes)
app.use("/api/ai", aiLimiter, ChatRoutes)

app.get("/", (req, res) => {
    res.send("API is running fine")
    // console.log("API is running fine")
})

// For Vercel serverless deployment
export default app;

// For local development - Always start server if not imported as module
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    const PORT = process.env.PORT || 5000;
    
    // Initialize connections and start server
    ensureDBConnection()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`🚀 Server is running on port ${PORT}`);
                console.log(`📍 API endpoint: http://localhost:${PORT}`);
                console.log(`\n📋 Available Admin Routes:`);
                console.log(`   POST   /api/admin/promote`);
                console.log(`   GET    /api/admin/stats`);
                console.log(`   GET    /api/admin/bookings`);
                console.log(`   GET    /api/admin/users`);
                console.log(`   GET    /api/admin/hotels`);
                console.log(`   GET    /api/admin/rooms`);
                console.log(`   DELETE /api/admin/bookings/:id`);
                console.log(`   PATCH  /api/admin/bookings/:id/status`);
                console.log(`   DELETE /api/admin/hotels/:id`);
                console.log(`   DELETE /api/admin/rooms/:id`);
                console.log(`   PATCH  /api/admin/users/:id/role\n`);
            });
        })
        .catch((error) => {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        });
} 