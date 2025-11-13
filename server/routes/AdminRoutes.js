import express from 'express';
import { promoteSelf } from '../controllers/AdminController.js';
import { protect, adminOnly } from '../middlewares/AuthMiddleWares.js';
import {
  getAllBookings,
  getAllUsers,
  getAllHotels,
  getAllRooms,
  cancelBooking,
  updateBookingStatus,
  deleteHotel,
  deleteRoom,
  getDashboardStats,
  updateUserRole
} from '../controllers/AdminDashboardController.js';

const router = express.Router();

// Promote the signed-in user to admin (requires ADMIN_PROMOTE_TOKEN)
router.post('/promote', protect, promoteSelf);

// Admin dashboard routes (all require admin role)
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/hotels', protect, adminOnly, getAllHotels);
router.get('/rooms', protect, adminOnly, getAllRooms);

// Admin actions
router.delete('/bookings/:id', protect, adminOnly, cancelBooking);
router.patch('/bookings/:id/status', protect, adminOnly, updateBookingStatus);
router.delete('/hotels/:id', protect, adminOnly, deleteHotel);
router.delete('/rooms/:id', protect, adminOnly, deleteRoom);
router.patch('/users/:id/role', protect, adminOnly, updateUserRole);

export default router;
