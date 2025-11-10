import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const location = useLocation();

    // Show loading state while Clerk is loading
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-violet-900/20">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Check if user is signed in
    if (!isSignedIn) {
        toast.error('Please sign in to access the admin panel');
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 🚨 TEMPORARY DEVELOPMENT BYPASS - REMOVE IN PRODUCTION!
    // In development, allow any signed-in user to access admin panel
    // TODO: Set proper admin role in Clerk before deploying
    if (import.meta.env.DEV) {
        console.warn('⚠️  DEV MODE: Bypassing admin role check');
        return children;
    }

    // Check if user has the required role
    // In Clerk, you can set publicMetadata with role information
    const userRole = user?.publicMetadata?.role || user?.unsafeMetadata?.role;
    
    if (userRole !== requiredRole && userRole !== 'owner') {
        toast.error('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }

    // User is authenticated and has the right role
    return children;
};

export default ProtectedRoute;
