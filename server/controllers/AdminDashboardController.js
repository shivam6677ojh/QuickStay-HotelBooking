import Booking from '../models/BookingModel.js';
import Hotel from '../models/HotelModel.js';
import Room from '../models/RoomModel.js';
import User from '../models/UserModel.js';

// Get all bookings (admin view)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'title price images')
      .populate('hotel', 'name location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all hotels with stats
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('owner', 'name email');
    
    // Get room counts for each hotel
    const hotelsWithStats = await Promise.all(hotels.map(async (hotel) => {
      const roomCount = await Room.countDocuments({ hotel: hotel._id });
      const bookingCount = await Booking.countDocuments({ hotel: hotel._id });
      return {
        ...hotel.toObject(),
        roomCount,
        bookingCount
      };
    }));
    
    res.json({ success: true, hotels: hotelsWithStats });
  } catch (error) {
    console.error('Get all hotels error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all rooms with hotel info
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('hotel', 'name city')
      .sort({ createdAt: -1 });
    
    console.log(`📋 Admin fetched ${rooms.length} rooms`);
    
    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Cancel/delete booking (admin)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('room hotel user');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, booking, message: 'Booking status updated' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete hotel (admin)
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete associated rooms
    await Room.deleteMany({ hotel: id });
    
    // Delete hotel
    const hotel = await Hotel.findByIdAndDelete(id);
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    
    res.json({ success: true, message: 'Hotel and associated rooms deleted' });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete room (admin)
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    console.log('📊 Admin Dashboard Stats:', {
      totalUsers,
      totalHotels,
      totalRooms,
      totalBookings
    });
    
    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('room', 'roomType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Revenue calculation (assuming booking has totalPrice)
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalHotels,
        totalRooms,
        totalBookings,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update user role (promote/demote admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin', 'owner'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user, message: 'User role updated' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
