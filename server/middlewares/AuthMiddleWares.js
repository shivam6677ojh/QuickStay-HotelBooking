import User from "../models/UserModel.js";
import { clerkClient } from '@clerk/clerk-sdk-node';

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

        // Prefer Clerk public metadata for role checks to avoid DB-sync race conditions.
        // This requires a server-side Clerk API key to be present in env vars.
        let userRole = req.user?.role;
        try {
            const clerkUserId = req.auth?.userId;
            if (clerkUserId) {
                const clerkUser = await clerkClient.users.getUser(clerkUserId);
                const clerkRole = clerkUser?.publicMetadata?.role || clerkUser?.unsafeMetadata?.role || null;
                if (clerkRole) userRole = clerkRole;
            }
        } catch (clerkErr) {
            console.warn('Warning: failed to fetch Clerk user for role check (check CLERK API key):', clerkErr.message || clerkErr);
            // keep DB role as fallback
        }

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
