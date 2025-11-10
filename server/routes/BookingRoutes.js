import express from 'express';
import { protect } from '../middlewares/AuthMiddleWares.js';
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  cancelBooking,
  checkAvailability
} from '../controllers/BookingController.js';

const BookingRouter = express.Router();

// Check room availability
BookingRouter.post('/check-availability', checkAvailability);

// Create new booking
BookingRouter.post('/book', protect, createBooking);

// Get user's bookings
BookingRouter.get('/user', protect, getUserBookings);

// Get owner's bookings
BookingRouter.get('/owner', protect, getOwnerBookings);

// Cancel booking
BookingRouter.put('/:id/cancel', protect, cancelBooking);

export default BookingRouter;
