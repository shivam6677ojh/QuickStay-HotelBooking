import express from 'express'
import upload from '../middlewares/uploadMiddleWares.js';
import { protect, adminOnly } from '../middlewares/AuthMiddleWares.js';
import { 
    createRoom, 
    getOwnerRoom, 
    getRoom, 
    getRoomById, 
    updateRoom,
    deleteRoom,
    toggleRoomAvailibilty 
} from '../controllers/RoomController.js';

const RoomRouter = express.Router();

// Admin-only routes for room management (define specific routes before dynamic :id routes)
RoomRouter.post('/', upload.array("images", 4), protect, adminOnly, createRoom)
RoomRouter.get('/owner', protect, adminOnly, getOwnerRoom)
RoomRouter.post('/toggle-availbility', protect, adminOnly, toggleRoomAvailibilty)

// Public routes (no authentication needed)
RoomRouter.get('/', getRoom)
RoomRouter.get('/:id', getRoomById)

// Admin-only routes with :id parameter
RoomRouter.put('/:id', upload.array("images", 4), protect, adminOnly, updateRoom)
RoomRouter.delete('/:id', protect, adminOnly, deleteRoom)

export default RoomRouter;