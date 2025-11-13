import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';

const AdminLogin = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  React.useEffect(() => {
    if (isSignedIn && user) {
      setChecking(true);
      // Check if user is admin
      const userRole = user?.publicMetadata?.role || user?.unsafeMetadata?.role;
      
      if (userRole === 'admin' || userRole === 'owner') {
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setChecking(false);
      }
    }
  }, [isSignedIn, user, navigate]);

  const handleSignIn = () => {
    openSignIn({
      redirectUrl: '/admin/login',
      appearance: {
        elements: {
          rootBox: 'mx-auto',
          card: 'shadow-2xl'
        }
      }
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-indigo-200">QuickStay Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {isSignedIn ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
                <p className="text-indigo-200 mb-4">
                  You are signed in as <span className="font-medium text-white">{user?.primaryEmailAddress?.emailAddress}</span>
                </p>
                <p className="text-sm text-indigo-300 mb-6">
                  This account does not have admin privileges. Please contact a system administrator to grant admin access.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin-setup')}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Request Admin Access
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 text-indigo-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-2xl font-semibold text-white mb-2">Sign In Required</h3>
                <p className="text-indigo-200">
                  Sign in with your admin account to access the dashboard
                </p>
              </div>

              <button
                onClick={handleSignIn}
                className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In to Admin Portal
              </button>

              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={() => navigate('/')}
                  className="text-indigo-200 hover:text-white transition-colors text-sm"
                >
                  ← Back to Website
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-indigo-300">
            🔒 Secure admin access · Protected by Clerk authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
