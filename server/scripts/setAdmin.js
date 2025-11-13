import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/UserModel.js';

dotenv.config({ path: './.env' });

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickstay';
const clerkUserId = process.argv[2] || process.env.PROMOTE_USER_ID;

if (!clerkUserId) {
  console.error('Usage: node server/scripts/setAdmin.js <clerkUserId> OR set PROMOTE_USER_ID in .env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO, { });
  const res = await User.updateOne({ _id: clerkUserId }, { $set: { role: 'admin' } }, { upsert: true });
  console.log('Set role admin for', clerkUserId, 'result:', res);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
