# 🔐 Admin Security Setup Guide

## Overview
QuickStay uses **Clerk Authentication** with **role-based access control (RBAC)** to secure the admin portal. Only users with the `admin` or `owner` role can access admin routes.

---
## 🛡️ Security Layers

### 1. **Frontend Protection**
- `ProtectedRoute` component checks user role before rendering admin pages
- `AdminLogin` verifies role from Clerk metadata
- Automatic redirect to home page if access denied

### 2. **Backend Protection**
- `protect` middleware verifies Clerk JWT token
- `adminOnly` middleware checks user role from Clerk metadata (priority) or database
- All admin routes require both middlewares

### 3. **Role Sources (Priority Order)**
1. **Clerk Public Metadata** (Most reliable - set by admin)
2. **Clerk Unsafe Metadata** (Can be set by user - less secure)
3. **Database Role** (Fallback if Clerk unavailable)

---

## 🔧 How to Grant Admin Access

### Method 1: Using Clerk Dashboard (Recommended)

1. **Login to Clerk Dashboard**
   - Go to https://dashboard.clerk.com
   - Select your QuickStay application

2. **Find the User**
   - Navigate to "Users" section
   - Search for the user by email

3. **Set Public Metadata**
   - Click on the user
   - Go to "Metadata" tab
   - Under "Public Metadata", add:
   ```json
   {
     "role": "admin"
   }
   ```
   - Click "Save"

4. **User Must Sign Out and Sign In Again**
   - The role change takes effect after re-authentication

### Method 2: Using Admin Promotion Endpoint

1. **Set Environment Variable**
   - In `server/.env`, add:
   ```
   ADMIN_PROMOTE_TOKEN=your-super-secret-token-here
   ```

2. **Sign In to the Application**
   - User must be signed in with Clerk

3. **Make API Request**
   ```bash
   curl -X POST http://localhost:5000/api/admin/promote \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
     -d '{"token": "your-super-secret-token-here"}'
   ```

4. **Or Use Postman**
   - Method: `POST`
   - URL: `http://localhost:5000/api/admin/promote`
   - Headers:
     - `Authorization: Bearer YOUR_CLERK_JWT_TOKEN`
   - Body (JSON):
     ```json
     {
       "token": "your-super-secret-token-here"
     }
     ```

### Method 3: Programmatic Setup (Development Only)

1. **Navigate to Admin Setup Page**
   - Go to `http://localhost:5173/admin-setup`
   - Sign in with your account
   - Enter the `ADMIN_PROMOTE_TOKEN`
   - Click "Promote to Admin"

---

## 🔒 Security Features

### ✅ What's Protected

1. **All Admin Routes**
   - `/admin/*` - All admin dashboard pages
   - `/owner/*` - Hotel owner dashboard pages

2. **All Admin API Endpoints**
   - `GET /api/admin/stats` - Dashboard statistics
   - `GET /api/admin/bookings` - All bookings
   - `GET /api/admin/users` - All users
   - `GET /api/admin/hotels` - All hotels
   - `GET /api/admin/rooms` - All rooms
   - `DELETE /api/admin/bookings/:id` - Cancel booking
   - `PATCH /api/admin/bookings/:id/status` - Update booking
   - `DELETE /api/admin/hotels/:id` - Delete hotel
   - `DELETE /api/admin/rooms/:id` - Delete room
   - `PATCH /api/admin/users/:id/role` - Update user role

### 🚫 Access Control

- **Non-admin users** attempting to access admin pages are redirected to home
- **Unauthenticated users** are prompted to sign in
- **API requests without valid JWT** return `401 Unauthorized`
- **API requests without admin role** return `403 Forbidden`

### 📊 Logging & Monitoring

All admin access attempts are logged:
```
🔐 Admin Access Check: {
  userId: "user_xxx",
  email: "admin@example.com",
  role: "admin",
  roleSource: "clerk_metadata",
  hasAccess: true
}
```

Failed attempts are logged:
```
❌ Admin access denied: {
  userId: "user_xxx",
  role: "user",
  requiredRole: "admin or owner"
}
```

---

## 🧪 Testing Admin Access

### Test User Access Flow

1. **Create Test User**
   - Sign up with a test email

2. **Verify No Admin Access**
   - Try accessing `/admin/login`
   - Should see "Access Denied" message

3. **Grant Admin Role**
   - Use Clerk Dashboard method above

4. **Verify Admin Access**
   - Sign out and sign in again
   - Access `/admin/login`
   - Should redirect to `/admin/dashboard`

### Test API Protection

1. **Without Token**
   ```bash
   curl http://localhost:5000/api/admin/stats
   # Should return 401 Unauthorized
   ```

2. **With Valid Token, No Admin Role**
   ```bash
   curl -H "Authorization: Bearer USER_JWT_TOKEN" \
     http://localhost:5000/api/admin/stats
   # Should return 403 Forbidden
   ```

3. **With Admin Token**
   ```bash
   curl -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
     http://localhost:5000/api/admin/stats
   # Should return dashboard stats
   ```

---

## 🔐 Role Types

| Role | Access Level | Description |
|------|-------------|-------------|
| `user` | Standard | Can book rooms, view bookings |
| `owner` | Hotel Owner | Can manage own hotel, rooms |
| `admin` | Full Access | Can manage all hotels, rooms, users, bookings |

**Note:** Both `owner` and `admin` have full access to admin portal.

---

## ⚙️ Environment Variables Required

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Promotion (Optional)
ADMIN_PROMOTE_TOKEN=your-super-secret-token-here

# MongoDB
MONGODB_URI=mongodb+srv://...

# Server
PORT=5000
NODE_ENV=development
```

---

## 🚨 Security Best Practices

1. **Never Commit Secrets**
   - Keep `.env` in `.gitignore`
   - Use different tokens for dev/prod

2. **Use Public Metadata**
   - Always set role in Clerk's `publicMetadata`
   - Don't rely on `unsafeMetadata`

3. **Monitor Access Logs**
   - Check server logs for unauthorized access attempts
   - Enable logging in production

4. **Regular Audits**
   - Review admin users regularly
   - Remove admin access when no longer needed

5. **Secure Admin Token**
   - Use long, random `ADMIN_PROMOTE_TOKEN`
   - Rotate token periodically
   - Only share with trusted developers

---

## 🐛 Troubleshooting

### Issue: "Access Denied" even though I'm admin

**Solution:**
1. Check Clerk Dashboard - verify `publicMetadata.role = "admin"`
2. Sign out and sign in again
3. Clear browser cache and cookies
4. Check browser console for role information

### Issue: API returns 403 Forbidden

**Solution:**
1. Verify `CLERK_SECRET_KEY` is set in server `.env`
2. Check server logs for role verification details
3. Ensure JWT token is valid and not expired
4. Verify role is set in Clerk metadata

### Issue: Role not syncing from Clerk

**Solution:**
1. User must sign out and sign in after role change
2. Wait a few seconds for Clerk to propagate changes
3. Check if `CLERK_SECRET_KEY` is correct
4. Verify internet connection to Clerk servers

---

## 📞 Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set
3. Test with Postman to isolate frontend/backend issues
4. Check Clerk Dashboard for user metadata

---

## ✅ Quick Checklist

Before deploying to production:

- [ ] Set `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY`
- [ ] Set strong `ADMIN_PROMOTE_TOKEN` (if using promotion endpoint)
- [ ] Grant admin role to at least one user
- [ ] Test admin login with admin user
- [ ] Test admin login with regular user (should be denied)
- [ ] Test all admin API endpoints with Postman
- [ ] Review and understand access logs
- [ ] Remove test admin accounts
- [ ] Disable admin promotion endpoint in production (optional)

---

**Security Status:** ✅ Production Ready
**Last Updated:** November 17, 2025
