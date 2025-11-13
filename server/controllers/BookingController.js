
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

        // Send email - fetch user email from Clerk if not in DB
        let userEmail = req.user?.email;
        let userName = req.user?.name || 'Guest';

        // If email not in DB, try to fetch from Clerk
        if (!userEmail && req.auth?.userId) {
            try {
                const { clerkClient } = await import('@clerk/clerk-sdk-node');
                const clerkUser = await clerkClient.users.getUser(req.auth.userId);
                userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
                userName = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : userName;
                console.log(`📧 Fetched email from Clerk: ${userEmail}`);
            } catch (clerkError) {
                console.error('⚠️  Failed to fetch user from Clerk:', clerkError.message);
            }
        }

        if (userEmail) {
            try {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: userEmail,
                    subject: "Booking Confirmation - QuickStay",
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #4F46E5;">Booking Confirmed! 🎉</h1>
                        <p>Dear ${userName},</p>
                        <p>Your booking has been confirmed with the following details:</p>
                        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin: 10px 0;"><strong>Hotel:</strong> ${roomData.hotel.name}</li>
                                <li style="margin: 10px 0;"><strong>Location:</strong> ${roomData.hotel.city || 'N/A'}</li>
                                <li style="margin: 10px 0;"><strong>Room Type:</strong> ${roomData.roomType}</li>
                                <li style="margin: 10px 0;"><strong>Check-In Date:</strong> ${new Date(checkInDate).toLocaleDateString()}</li>
                                <li style="margin: 10px 0;"><strong>Check-Out Date:</strong> ${new Date(checkOutDate).toLocaleDateString()}</li>
                                <li style="margin: 10px 0;"><strong>Number of Guests:</strong> ${guests}</li>
                                <li style="margin: 10px 0; font-size: 18px;"><strong>Total Price:</strong> <span style="color: #4F46E5;">$${totalPrice.toFixed(2)}</span></li>
                            </ul>
                        </div>
                        <p>We look forward to hosting you!</p>
                        <p style="color: #6B7280; font-size: 14px;">If you need to cancel or modify your booking, please visit your account dashboard.</p>
                        <p>Best regards,<br/><strong>QuickStay Team</strong></p>
                    </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Booking confirmation email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('⚠️  Failed to send confirmation email:', emailError.message);
                // Don't fail the booking if email fails
            }
        } else {
            console.log('⚠️  Skipping email - user email not available');
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
        
        const booking = await Booking.findById(id)
            .populate('room')
            .populate('hotel');
        
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

        // Send cancellation email
        let userEmail = req.user?.email;
        let userName = req.user?.name || 'Guest';

        // If email not in DB, try to fetch from Clerk
        if (!userEmail && req.auth?.userId) {
            try {
                const { clerkClient } = await import('@clerk/clerk-sdk-node');
                const clerkUser = await clerkClient.users.getUser(req.auth.userId);
                userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
                userName = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : userName;
                console.log(`📧 Fetched email from Clerk for cancellation: ${userEmail}`);
            } catch (clerkError) {
                console.error('⚠️  Failed to fetch user from Clerk:', clerkError.message);
            }
        }

        if (userEmail) {
            try {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: userEmail,
                    subject: "Booking Cancellation - QuickStay",
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #DC2626;">Booking Cancelled</h1>
                        <p>Dear ${userName},</p>
                        <p>Your booking has been successfully cancelled. Here are the details:</p>
                        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin: 10px 0;"><strong>Hotel:</strong> ${booking.hotel?.name || 'N/A'}</li>
                                <li style="margin: 10px 0;"><strong>Room Type:</strong> ${booking.room?.roomType || 'N/A'}</li>
                                <li style="margin: 10px 0;"><strong>Check-In Date:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</li>
                                <li style="margin: 10px 0;"><strong>Check-Out Date:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</li>
                                <li style="margin: 10px 0;"><strong>Total Amount:</strong> $${booking.totalPrice?.toFixed(2) || '0.00'}</li>
                            </ul>
                        </div>
                        <p style="color: #6B7280;">If you have any questions about refunds or need assistance, please contact our support team.</p>
                        <p>We hope to serve you again soon!</p>
                        <p>Best regards,<br/><strong>QuickStay Team</strong></p>
                    </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Booking cancellation email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('⚠️  Failed to send cancellation email:', emailError.message);
                // Don't fail the cancellation if email fails
            }
        } else {
            console.log('⚠️  Skipping cancellation email - user email not available');
        }
        
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