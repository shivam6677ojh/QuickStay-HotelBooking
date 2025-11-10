import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
    try {
        // clerkMiddleware should populate req.auth; be defensive if it's missing
        const userId = req.auth?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized, no user found" });
        }

        // Fetch your MongoDB user using Clerk's userId
        let user = await User.findById(userId).select("-password");

        // If user doesn't exist in DB, create a minimal user record
        if (!user) {
            console.log(`⚠️  User ${userId} not found in database - creating minimal user record`);
            
            // Create a minimal user record with Clerk ID
            // The webhook should have created this, but we'll create it as fallback
            try {
                user = await User.create({
                    _id: userId,
                    name: 'Guest User', // Default name, will be updated by webhook
                    email: `user_${userId}@temp.com`, // Temporary email
                    image: '', // Empty image
                    role: 'user'
                });
                console.log(`✅ Created minimal user record for ${userId}`);
            } catch (createError) {
                console.error('❌ Failed to create user:', createError.message);
                req.user = null;
                req.auth.userId = userId;
                return next();
            }
        }

        req.user = user; // attach user for downstream routes
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Middleware to check if user has admin/owner role
export const adminOnly = async (req, res, next) => {
    try {
        // Ensure protect middleware ran first
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        // 🚨 TEMPORARY DEVELOPMENT BYPASS - REMOVE IN PRODUCTION!
        // TODO: Set proper admin role in Clerk before deploying
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️  DEV MODE: Bypassing admin check for user:', req.user.email);
            return next();
        }

        // Check if user has admin or owner role
        const userRole = req.user.role;
        
        if (userRole !== 'admin' && userRole !== 'owner') {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required." 
            });
        }

        // User is admin, proceed
        next();
    } catch (error) {
        console.error("Admin Middleware Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
