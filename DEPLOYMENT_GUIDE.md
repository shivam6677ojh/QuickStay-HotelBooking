# 🚀 Pre-Deployment Checklist

## ✅ Before You Deploy to Production

### 1. Set Up Admin Users in Clerk

**CRITICAL: Do this BEFORE deployment!**

For EACH user who needs admin access:

1. Go to: https://dashboard.clerk.com
2. Click **"Users"** in sidebar
3. Select the user
4. Find **"Public metadata"** section
5. Click **"Edit"**
6. Add this JSON:
```json
{
  "role": "admin"
}
```
7. Click **"Save"**

### 2. Set Environment Variable

In your hosting platform (Vercel, Netlify, etc.):

```bash
NODE_ENV=production
```

This will:
- ✅ Enable admin role checks on backend
- ✅ Enable admin role checks on frontend
- ✅ Block unauthorized access

### 3. Update Your Database Users (Optional but Recommended)

Make sure your MongoDB users also have the role field:

```javascript
// Connect to your MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### 4. Test Production Build Locally

Before deploying, test production mode locally:

**Backend:**
```powershell
cd server
$env:NODE_ENV="production"
npm start
```

**Frontend:**
```powershell
cd client
npm run build
npm run preview
```

Try accessing `/owner` - it should:
- ✅ Allow users with admin role
- ❌ Block users without admin role (403 error)
- ❌ Block non-authenticated users (redirect to home)

### 5. Deployment Configuration

#### For Vercel (Recommended):

**Backend (vercel.json already exists):**
```json
{
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Frontend (vercel.json):**
```json
{
  "env": {
    "VITE_NODE_ENV": "production"
  }
}
```

#### Environment Variables Needed:

**Backend:**
- `NODE_ENV=production`
- `MONGODB_URI=your_mongo_connection`
- `CLERK_SECRET_KEY=your_clerk_secret`
- `CLOUDINARY_NAME=your_cloudinary_name`
- `CLOUDINARY_API_KEY=your_key`
- `CLOUDINARY_SECRET_KEY=your_secret`

**Frontend:**
- `VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key`
- `VITE_API_URL=your_backend_url`

### 6. Post-Deployment Testing

After deployment:

**Test as Admin User:**
1. ✅ Sign in with admin account
2. ✅ See "Admin Dashboard" button in navbar
3. ✅ Access `/owner` successfully
4. ✅ Can create/edit/delete rooms
5. ✅ Can view all bookings

**Test as Regular User:**
1. ✅ Sign in with non-admin account
2. ❌ NO "Admin Dashboard" button visible
3. ❌ Cannot access `/owner` (redirected with error)
4. ✅ Can still browse rooms and make bookings

**Test as Guest (Not Signed In):**
1. ❌ No "Admin Dashboard" button
2. ❌ Cannot access `/owner` (redirected to home)
3. ✅ Can browse public rooms

### 7. Remove Development Code (Optional)

If you want to completely remove the bypass code:

**In `server/middlewares/AuthMiddleWares.js`, remove:**
```javascript
// Remove these lines after setting up admin roles:
if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  DEV MODE: Bypassing admin check');
    return next();
}
```

**In `client/src/components/ProtectedRoute.jsx`, remove:**
```javascript
// Remove these lines after setting up admin roles:
if (import.meta.env.DEV) {
    console.warn('⚠️  DEV MODE: Bypassing admin role check');
    return children;
}
```

But honestly, keeping them is fine - they only work in development mode anyway!

### 8. Security Best Practices

- ✅ Never commit `.env` files to git
- ✅ Use different Clerk apps for dev/production
- ✅ Regularly audit admin user list
- ✅ Use strong passwords for admin accounts
- ✅ Enable 2FA on admin Clerk accounts
- ✅ Monitor admin activity logs

### 9. Common Issues After Deployment

**Issue: "Access denied" even with admin role**

**Solution:**
1. Check Clerk dashboard - role is correctly set
2. Clear browser cache
3. Sign out and sign back in
4. Check browser console for Clerk user object
5. Verify `user.publicMetadata.role === "admin"`

**Issue: Everyone can access admin panel**

**Solution:**
1. Verify `NODE_ENV=production` is set in hosting
2. Check server logs for "DEV MODE" warnings
3. Restart production server

**Issue: Admin button not showing**

**Solution:**
1. Hard refresh browser (Ctrl + Shift + R)
2. Check Clerk user metadata
3. Verify you're signed in with correct account

### 10. Quick Verification Commands

**Check if production mode is enabled:**

```javascript
// In browser console on your deployed site:
console.log(import.meta.env.MODE); // Should show 'production'

// In your deployed backend logs:
// Should NOT see "⚠️  DEV MODE: Bypassing admin check"
```

## 🎯 Deployment Platforms

### Vercel (Recommended)
```bash
# Frontend
cd client
vercel --prod

# Backend
cd ../server
vercel --prod
```

### Heroku
```bash
# Backend
cd server
heroku create quickstay-api
git push heroku main
heroku config:set NODE_ENV=production

# Frontend on Vercel
cd ../client
vercel --prod
```

### Render
- Backend: Auto-deploys from GitHub
- Set environment variables in dashboard
- NODE_ENV=production is set automatically

## 🆘 Need Help?

If issues after deployment:
1. Check server logs for errors
2. Verify all environment variables are set
3. Test with admin user first
4. Check Clerk dashboard for user metadata
5. Review browser console for errors

## ✅ Ready to Deploy?

- [ ] Admin role set in Clerk for at least one user
- [ ] All environment variables documented
- [ ] Tested production build locally
- [ ] `.env` files not committed to git
- [ ] Backup of database taken
- [ ] Deployment platform chosen
- [ ] Domain/URL configured

**You're ready to deploy! 🚀**
