import express from 'express';
import { createHotel, getOwnerHotel, updateHotel } from '../controllers/HotelController.js';
import { protect, adminOnly } from '../middlewares/AuthMiddleWares.js';

const HotelRoutes = express.Router();

// Admin-only routes for hotel management
HotelRoutes.post('/', protect, adminOnly, createHotel);
HotelRoutes.get('/owner', protect, adminOnly, getOwnerHotel);
HotelRoutes.put('/:id', protect, adminOnly, updateHotel);

export default HotelRoutes;