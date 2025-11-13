# Session Timeout Feature

## Overview
Automatic session timeout has been implemented to log out users after 1 hour of inactivity for security purposes.

## How It Works

### Inactivity Timer
- **Timeout Duration**: 1 hour (60 minutes)
- **Warning**: User gets a warning 5 minutes before automatic logout
- **Activity Detection**: Tracks mouse movements, clicks, keyboard input, scrolling, and touch events

### User Experience
1. User logs in and uses the application normally
2. If inactive for 55 minutes → Warning toast notification appears
3. If inactive for 60 minutes → Automatic logout + redirect to home page

### What Counts as Activity?
- Mouse movements
- Mouse clicks
- Keyboard input
- Page scrolling
- Touch events (mobile)

## Implementation Details

### Component: `SessionTimeout.jsx`
Located in: `client/src/components/SessionTimeout.jsx`

Key features:
- Uses React hooks (`useEffect`, `useCallback`, `useRef`)
- Integrates with Clerk authentication
- Provides toast notifications for user awareness
- Automatically cleans up timers on unmount

### Integration
Added to `App.jsx` so it runs globally across the entire application:
```jsx
<AuthSetup />
<SessionTimeout />
```

## Configuration

To adjust timeout duration, edit `client/src/components/SessionTimeout.jsx`:

```javascript
// Change these values (in milliseconds)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes warning
```

### Example Custom Timeouts

**30 Minutes:**
```javascript
const SESSION_TIMEOUT = 30 * 60 * 1000;
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000;
```

**2 Hours:**
```javascript
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
const WARNING_BEFORE_TIMEOUT = 10 * 60 * 1000;
```

## Testing

### Manual Testing Steps
1. Log in to the application
2. Wait for the warning (or reduce timeout for testing)
3. Verify warning notification appears
4. Verify automatic logout after timeout
5. Verify redirect to home page

### Quick Testing (Development)
Temporarily reduce timeout for faster testing:
```javascript
const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const WARNING_BEFORE_TIMEOUT = 30 * 1000; // 30 seconds warning
```

## Benefits

### Security
- Prevents unauthorized access if user leaves device unattended
- Automatically closes sessions on shared computers
- Reduces risk of session hijacking

### User Experience
- Clear warning before logout
- Activity detection is seamless and non-intrusive
- Timer resets with any interaction

## Limitations

### What Doesn't Reset the Timer
- Background API calls
- Automated processes
- Passive content loading

### Browser-Specific Behavior
- Timer runs only in active tab
- If user switches tabs, timer continues
- Browser sleep/wake may affect timing slightly

## Customization Options

### Disable for Certain Routes
Modify `SessionTimeout.jsx` to check route:
```javascript
const location = useLocation();
if (location.pathname.includes('/admin')) {
    return null; // Don't timeout admin users
}
```

### Different Timeouts for Different Users
```javascript
const { user } = useUser();
const SESSION_TIMEOUT = user?.publicMetadata?.role === 'admin' 
    ? 2 * 60 * 60 * 1000  // 2 hours for admins
    : 1 * 60 * 60 * 1000; // 1 hour for regular users
```

### Custom Warning Messages
Edit toast messages in `SessionTimeout.jsx`:
```javascript
toast.warning('Your session will expire soon...', {
    autoClose: 10000,
    position: 'top-center'
});
```

## Troubleshooting

### Issue: User Gets Logged Out Too Quickly
- Check `SESSION_TIMEOUT` value
- Verify activity events are being detected
- Check browser console for errors

### Issue: Timer Doesn't Reset
- Ensure event listeners are attached
- Check if events are bubbling properly
- Verify `resetTimer` is being called

### Issue: Warning Doesn't Appear
- Check toast notification configuration
- Verify react-toastify is properly imported
- Check browser console for errors

## Future Enhancements

Possible improvements:
1. **Server-side session validation** for additional security
2. **"Stay logged in" option** to extend session
3. **Configurable timeouts per user role** (admin vs regular user)
4. **Session activity logging** for analytics
5. **Remember last activity** across page reloads

## Related Files

- `client/src/components/SessionTimeout.jsx` - Main component
- `client/src/App.jsx` - Integration point
- `client/src/components/AuthSetup.jsx` - Authentication setup

## Dependencies

- `@clerk/clerk-react` - Authentication
- `react-toastify` - Toast notifications
- React hooks - `useEffect`, `useCallback`, `useRef`
