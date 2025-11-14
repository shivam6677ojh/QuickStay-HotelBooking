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

connectDB()
connectCloudinary()
const app = express()



app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}); 