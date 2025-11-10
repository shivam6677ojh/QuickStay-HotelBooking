# Admin Access Setup Guide

## Overview
The admin panel is now protected with role-based authentication. Only users with the "admin" or "owner" role can access the `/owner` routes.

## Setting Up Admin Users

### Method 1: Using Clerk Dashboard (Recommended)

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - Select your application

2. **Navigate to Users**
   - Click on "Users" in the sidebar
   - Find the user you want to make an admin

3. **Add Admin Role**
   - Click on the user
   - Scroll to "Public metadata" section
   - Click "Edit"
   - Add the following JSON:
   ```json
   {
     "role": "admin"
   }
   ```
   - Click "Save"

### Method 2: Using Unsafe Metadata (Alternative)

If you prefer to use unsafe metadata (user can see but not edit):

1. In Clerk Dashboard, go to the user
2. Find "Unsafe metadata" section
3. Add:
   ```json
   {
     "role": "admin"
   }
   ```

### Method 3: Programmatically (For Development)

You can also set the role programmatically when testing:

```javascript
// In your backend or webhook
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: 'admin'
  }
});
```

## Database Role Setup

Make sure your MongoDB user document also has the role field:

```javascript
{
  _id: "clerk_user_id",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin", // or "owner"
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

## Testing Admin Access

### As Admin User:
1. Sign in with an account that has admin role
2. You should see "Admin Dashboard" button in navbar with a badge
3. Click to access `/owner` routes
4. All admin features should be accessible

### As Regular User:
1. Sign in with a regular account (no admin role)
2. "Admin Dashboard" button should NOT appear
3. Direct access to `/owner` routes will redirect to home with error message

### Without Sign-In:
1. Try accessing `/owner` directly
2. Should redirect to home with "Please sign in" message

## Features Protected

### Frontend Protection:
- ✅ `/owner` dashboard route
- ✅ `/owner/add-room` route
- ✅ `/owner/edit-room/:id` route
- ✅ `/owner/list-room` route
- ✅ Admin Dashboard button (only visible to admins)

### Backend Protection:
- ✅ Hotel creation (POST /api/hotels)
- ✅ Get owner hotels (GET /api/hotels/owner)
- ✅ Update hotel (PUT /api/hotels/:id)
- ✅ Room creation (POST /api/rooms)
- ✅ Get owner rooms (GET /api/rooms/owner)
- ✅ Update room (PUT /api/rooms/:id)
- ✅ Delete room (DELETE /api/rooms/:id)
- ✅ Toggle room availability (POST /api/rooms/toggle-availbility)

## Security Features

1. **Frontend ProtectedRoute Component**
   - Checks if user is signed in
   - Verifies user has correct role
   - Shows loading state during verification
   - Redirects unauthorized users

2. **Backend adminOnly Middleware**
   - Validates user authentication
   - Checks user role from database
   - Returns 403 for non-admin users
   - Properly handles errors

3. **Visual Indicators**
   - Admin badge on dashboard button
   - Pulsing indicator for admin status
   - Shield icon for admin access

## Troubleshooting

### User can't access admin panel:
1. Check Clerk dashboard - ensure role is set correctly
2. Verify MongoDB user document has matching role
3. Clear browser cache and re-login
4. Check browser console for error messages

### Dashboard button not showing:
1. Ensure user is signed in
2. Check that publicMetadata or unsafeMetadata has role: "admin"
3. Hard refresh the page (Ctrl+F5)

### Backend returns 403 Forbidden:
1. Verify user document in MongoDB has role: "admin"
2. Check that protect middleware runs before adminOnly
3. Ensure Clerk webhook properly syncs user data

## Multiple Admin Types

The system supports two role values:
- **"admin"** - Full administrative access
- **"owner"** - Hotel owner access (same permissions)

Both roles have identical access to the admin panel.

## Security Best Practices

1. ✅ Never hardcode admin credentials
2. ✅ Always verify role on both frontend and backend
3. ✅ Use HTTPS in production
4. ✅ Regularly audit admin user list
5. ✅ Keep Clerk SDK updated
6. ✅ Monitor admin access logs

## Need Help?

If you encounter issues:
1. Check Clerk Dashboard for user metadata
2. Check MongoDB for user role field
3. Review browser console for errors
4. Check server logs for authentication issues
5. Ensure environment variables are set correctly
