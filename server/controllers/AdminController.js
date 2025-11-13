import User from '../models/UserModel.js';

// Promote the currently authenticated user to admin (requires ADMIN_PROMOTE_TOKEN)
export const promoteSelf = async (req, res) => {
  try {
    const secret = req.body?.token || req.headers['x-admin-token'];
    const expected = process.env.ADMIN_PROMOTE_TOKEN;

    if (!expected) {
      return res.status(500).json({ success: false, message: 'Server not configured for self-promotion' });
    }

    if (!secret || secret !== expected) {
      return res.status(403).json({ success: false, message: 'Invalid promotion token' });
    }

    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Promote the user in the DB (create record if needed)
    await User.updateOne({ _id: clerkUserId }, { $set: { role: 'admin' } }, { upsert: true });

    return res.json({ success: true, message: 'User promoted to admin' });
  } catch (error) {
    console.error('Admin promote error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
