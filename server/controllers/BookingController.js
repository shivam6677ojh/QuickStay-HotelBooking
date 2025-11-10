
// function to check Availbility of Rooms:

import Booking from "../models/BookingModel.js"
import Room from "../models/RoomModel.js";
import Hotel from "../models/HotelModel.js";
import transporter from "../configs/Nodemailer.js";
import { fr } from "date-fns/locale";

// Helper function to check availability
const checkRoomAvailability = async (checkInDate, checkOutDate, room) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate},
            status: { $ne: 'cancelled' }
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.log(error.message);
        return false;
    }
}


// add api to check availability of room;
// POST /api/bookings/check-availbility;

export const checkAvailability = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        
        const isAvailable = await checkRoomAvailability(checkInDate, checkOutDate, room);

        res.status(200).json({
            success: true,
            isAvailable
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// API to create a new Booking

//Post /api/booking/book


export const createBooking = async (req, res) => {
    try {

    const {  checkInDate, checkOutDate, room, guests } = req.body;

    // req.user may be null when using Clerk-only auth; fall back to req.auth.userId
    const userId = req.user?._id || req.auth?.userId;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
    }

        // check if room is available for given dates
        const isAvailable = await checkRoomAvailability(checkInDate, checkOutDate, room);

        if(!isAvailable){
            return res.status(404).json({
                success: false,
                message: "Room is not available"
            })
        }
        // Get total Price for Room
        const roomData = await Room.findById(room).populate("hotel");

        if (!roomData) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        if (!roomData.hotel) {
            return res.status(500).json({ success: false, message: 'Room has no associated hotel' });
        }

        // Ensure price is a number
        let pricePerNight = Number(roomData.pricePerNignt || roomData.pricePerNight || 0);

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        let totalPrice = pricePerNight * diffDays;

        const newBooking = await Booking.create({
            user: userId,
            room,
            hotel: roomData.hotel._id,
            checkInDate,
            checkOutDate,
            totalPrice,
            guests: +guests,
        });

        // Send email only if user data is available
        if (req.user && req.user.email) {
            try {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: req.user.email,
                    subject: "Booking Confirmation - QuickStay",
                    html: `
                    <h1>Your Booking Details</h1>
                    <p>Dear ${req.user.name || 'Guest'},</p>
                    <p>Your booking has been confirmed with the following details:</p>
                    <ul>
                        <li><strong>Hotel:</strong> ${roomData.hotel.name}</li>
                        <li><strong>Room Type:</strong> ${roomData.roomType}</li>
                        <li><strong>Check-In Date:</strong> ${new Date(checkInDate).toLocaleDateString()}</li>
                        <li><strong>Check-Out Date:</strong> ${new Date(checkOutDate).toLocaleDateString()}</li>
                        <li><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</li>
                        <li><strong>Guests:</strong> ${guests}</li>
                    </ul>
                    <p>We look forward to hosting you!</p>
                    <p>Best regards,<br/>QuickStay Team</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Booking confirmation email sent to ${req.user.email}`);
            } catch (emailError) {
                console.error('⚠️  Failed to send confirmation email:', emailError.message);
                // Don't fail the booking if email fails
            }
        } else {
            console.log('⚠️  Skipping email - user data not available in database');
        }

        console.log(`✅ Booking created for user ${userId}`);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking
        }); 

        
    } catch (error) {
        console.error('❌ Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// API to get all bookings for a user
// GET /api/bookings/user-bookings

export const getUserBookings = async (req, res) => {
    try {
    // fall back to auth user id if req.user is not present in DB
    const user = req.user?._id || req.auth.userId;

    const bookings = await Booking.find({user}).populate("room").populate("hotel").sort({createdAt: -1});

        res.status(200).json({
            success: true,
            bookings
        }); 
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        })
    }   
}

// API to get all bookings for a hotel owner
// GET /api/bookings/owner-bookings

export const getOwnerBookings = async (req, res) => {
    try {
        // For testing - get any hotel since we don't have user-hotel mapping yet
        const hotel = await Hotel.findOne({});

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "No hotel found. Please create a hotel first."
            });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate("room")
            .populate("user")
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalEarnings = bookings.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
        
        res.status(200).json({
            success: true,
            bookings,
            totalBookings,
            totalEarnings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// API to cancel a booking
// PUT /api/booking/:id/cancel

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findById(id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        
        // Check if user owns this booking
        if (booking.user.toString() !== req.auth.userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this booking"
            });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}