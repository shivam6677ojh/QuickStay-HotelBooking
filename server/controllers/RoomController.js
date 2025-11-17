import { response } from "express";
import Hotel from "../models/HotelModel.js";
import { v2 as cloudinary } from 'cloudinary'
import Room from "../models/RoomModel.js";

// Api to create new room for hotel
export const createRoom = async (req, res) => { 
    try {
        const { roomType, pricePerNight, capacity, description, amenities } = req.body;

        // Validate required fields
        if (!roomType || !pricePerNight) {
            return res.status(400).json({
                success: false,
                message: "Room type and price per night are required"
            });
        }

        // Validate price is a positive number
        const price = Number(pricePerNight);
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a positive number"
            });
        }

        // Validate capacity if provided
        if (capacity && (isNaN(Number(capacity)) || Number(capacity) <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be a positive number"
            });
        }

        // Check if images were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one room image is required"
            });
        }

        // For testing - use the first hotel since we don't have user-hotel mapping
        let hotel = await Hotel.findOne({});

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "No hotel found. Please create a hotel first."
            });
        }

        // Upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        const images = await Promise.all(uploadImages);

        // Parse amenities if it's a string
        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch (e) {
                // If it's already an array or fails to parse, use as is
                parsedAmenities = amenities;
            }
        }

        const newRoom = await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNignt: +pricePerNight,
            capacity: capacity ? +capacity : 2,
            description: description || '',
            amenities: parsedAmenities,
            images,
            isAvailable: true
        });

        console.log(`✅ Room created: ${newRoom.roomType} - $${newRoom.pricePerNignt}/night`);

        res.status(200).json({
            success: true,
            message: "Room created successfully",
            room: newRoom
        })

    } catch (error) {
        console.error('❌ Error creating room:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Api to get all rooms with filters

export const getRoom = async (req, res) => {
    try {
        const { 
            destination, 
            checkIn, 
            checkOut, 
            guests, 
            minPrice, 
            maxPrice, 
            roomType, 
            sortBy,
            limit 
        } = req.query;

        // Build filter query
        let query = { isAvailable: true };

        // Filter by destination (search in hotel city/name/address)
        if (destination) {
            const hotels = await Hotel.find({
                $or: [
                    { city: { $regex: destination, $options: 'i' } },
                    { name: { $regex: destination, $options: 'i' } },
                    { address: { $regex: destination, $options: 'i' } }
                ]
            }).select('_id');
            
            if (hotels.length > 0) {
                query.hotel = { $in: hotels.map(h => h._id) };
            } else {
                // No hotels match, return empty
                return res.status(200).json({
                    success: true,
                    rooms: []
                });
            }
        }

        // Filter by room type
        if (roomType) {
            // Handle both single room type and comma-separated multiple types
            const types = roomType.split(',').map(t => t.trim());
            if (types.length > 1) {
                query.roomType = { $in: types };
            } else {
                query.roomType = { $regex: roomType, $options: 'i' };
            }
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.pricePerNignt = {};
            if (minPrice) query.pricePerNignt.$gte = Number(minPrice);
            if (maxPrice) query.pricePerNignt.$lte = Number(maxPrice);
        }

        // Filter by capacity (guests)
        if (guests) {
            query.capacity = { $gte: Number(guests) };
        }

        // Build sort options
        let sortOptions = { createdAt: -1 }; // Default: newest first
        
        if (sortBy === 'price_asc') {
            sortOptions = { pricePerNignt: 1 };
        } else if (sortBy === 'price_desc') {
            sortOptions = { pricePerNignt: -1 };
        } else if (sortBy === 'newest') {
            sortOptions = { createdAt: -1 };
        }

        // Execute query
        let roomsQuery = Room.find(query).populate('hotel').sort(sortOptions);
        
        // Apply limit if provided
        if (limit) {
            roomsQuery = roomsQuery.limit(Number(limit));
        }

        const rooms = await roomsQuery;

        // Filter by availability dates if checkIn and checkOut are provided
        let availableRooms = rooms;
        if (checkIn && checkOut) {
            const Booking = (await import('../models/BookingModel.js')).default;
            
            availableRooms = [];
            for (const room of rooms) {
                const bookings = await Booking.find({
                    room: room._id,
                    checkInDate: { $lte: new Date(checkOut) },
                    checkOutDate: { $gte: new Date(checkIn) },
                    status: { $ne: 'cancelled' }
                });
                
                if (bookings.length === 0) {
                    availableRooms.push(room);
                }
            }
        }

        console.log(`✅ Found ${availableRooms.length} available rooms (${rooms.length} before date filtering)`);
        
        res.status(200).json({
            success: true,
            rooms: availableRooms
        });
    } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Api to get single room by ID

export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const room = await Room.findById(id).populate('hotel');
        
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }
        
        console.log(`✅ Found room: ${room.roomType}`);
        
        res.status(200).json({
            success: true,
            room
        });
    } catch (error) {
        console.error('❌ Error fetching room by ID:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Api to get all rooms for owner

export const getOwnerRoom = async (req, res) => {
    try {
        // Get all rooms (not just from one hotel)
        const rooms = await Room.find({}).populate("hotel");
        
        console.log(`📋 Owner fetched ${rooms.length} total rooms`);
    
        res.status(200).json({ 
            success: true, 
            rooms 
        });
    } catch (error) {
        console.error('❌ Error fetching owner rooms:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}
// Api to toggle room availability

export const toggleRoomAvailibilty  = async (req,res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);

        if (!roomData) {
            return res.status(404).json({
                success: false, 
                message: 'Room not found'
            });
        }

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        
        res.status(200).json({
            success: true, 
            message: 'Room availability updated'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

// Api to update room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, pricePerNight, capacity, description, amenities } = req.body;
        
        const room = await Room.findById(id);
        
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }
        
        // Update fields
        if (roomType) room.roomType = roomType;
        if (pricePerNight) room.pricePerNignt = +pricePerNight;
        if (capacity) room.capacity = +capacity;
        if (description) room.description = description;
        if (amenities) room.amenities = JSON.parse(amenities);
        
        // Handle image uploads
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const response = await cloudinary.uploader.upload(file.path);
                return response.secure_url;
            });
            const images = await Promise.all(uploadImages);
            room.images = images;
        }
        
        await room.save();
        
        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
            room
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Api to delete room
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        
        const room = await Room.findByIdAndDelete(id);
        
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Room deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

