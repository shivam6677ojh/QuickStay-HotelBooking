# 🚨 QUICK ADMIN SETUP - DO THIS NOW!

## The 403 Error means you need to set up an admin user

### Option 1: Set Admin Role in Clerk (2 minutes)

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Select your application**
3. **Click "Users" in sidebar**
4. **Find YOUR user** (the one you're logged in with)
5. **Click on your user**
6. **Scroll to "Public metadata" section**
7. **Click "Edit"**
8. **Paste this JSON**:
```json
{
  "role": "admin"
}
```
9. **Click "Save"**
10. **Refresh your QuickStay app** and try accessing `/owner` again

### Option 2: Update Your Database User (Quick Fix)

If Clerk isn't working, update your MongoDB user directly:

1. Open MongoDB Compass or Mongo Shell
2. Connect to your database
3. Find your user in the `users` collection
4. Update the document:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },  // Your email
  { $set: { role: "admin" } }
)
```
5. Refresh your app

### Option 3: Temporary Development Bypass

**WARNING: Only for development! Remove before production!**

I can temporarily disable admin checks so you can test. Let me know if you want this.

### Verify It Worked

After setting the role:
1. ✅ Refresh your browser (hard refresh: Ctrl + Shift + R)
2. ✅ Sign out and sign back in
3. ✅ You should see "Admin Dashboard" button in navbar
4. ✅ Access `/owner` should work without 403 error

### Still Getting 403?

If you still get the error:
1. Check browser console for the Clerk user object
2. Verify `user.publicMetadata.role` shows "admin"
3. Check MongoDB that your user document has `role: "admin"`
4. Make sure you're signed in with the correct account

### Need Help Setting This Up?

Let me know and I can help you:
- Walk through Clerk dashboard steps
- Update your database directly
- Add temporary bypass for testing
