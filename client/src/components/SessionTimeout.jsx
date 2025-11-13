import { useEffect, useRef, useCallback } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const SessionTimeout = () => {
    const { signOut } = useClerk();
    const { isSignedIn } = useUser();
    const timeoutRef = useRef(null);
    const warningTimeoutRef = useRef(null);
    
    // Session timeout duration: 1 hour (in milliseconds)
    const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes warning

    const handleLogout = useCallback(async () => {
        try {
            toast.info('You have been logged out due to inactivity.', {
                position: 'top-center',
                autoClose: 5000
            });
            
            await signOut();
            
            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }, [signOut]);

    const resetTimer = useCallback(() => {
        // Clear existing timers
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
        }

        if (!isSignedIn) return;

        // Set warning timer (5 minutes before logout)
        warningTimeoutRef.current = setTimeout(() => {
            toast.warning('Your session will expire in 5 minutes due to inactivity. Please interact with the page to stay logged in.', {
                autoClose: 10000,
                position: 'top-center'
            });
        }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

        // Set logout timer (1 hour)
        timeoutRef.current = setTimeout(() => {
            handleLogout();
        }, SESSION_TIMEOUT);
    }, [isSignedIn, handleLogout, SESSION_TIMEOUT, WARNING_BEFORE_TIMEOUT]);

    useEffect(() => {
        if (!isSignedIn) return;

        // Events to track user activity
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Reset timer on any user activity
        const resetOnActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, resetOnActivity);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetOnActivity);
            });
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
        };
    }, [isSignedIn, resetTimer]);

    return null; // This component doesn't render anything
};

export default SessionTimeout;
