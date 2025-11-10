import apiClient from './client';

// Room API services
export const roomService = {
  // Get all available rooms with optional filters
  getRooms: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.checkIn) params.append('checkIn', filters.checkIn);
    if (filters.checkOut) params.append('checkOut', filters.checkOut);
    if (filters.guests) params.append('guests', filters.guests);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    // Handle both single roomType string and roomTypes array
    if (filters.roomType) {
      params.append('roomType', filters.roomType);
    } else if (filters.roomTypes && filters.roomTypes.length > 0) {
      params.append('roomType', filters.roomTypes.join(','));
    }
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiClient.get(`/room?${params.toString()}`);
    return response.data;
  },

  // Get single room by ID
  getRoomById: async (id) => {
    const response = await apiClient.get(`/room/${id}`);
    return response.data;
  },

  // Get owner's rooms
  getOwnerRooms: async () => {
    const response = await apiClient.get('/room/owner');
    return response.data;
  },

  // Create new room (with images)
  createRoom: async (formData) => {
    const response = await apiClient.post('/room', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update room
  updateRoom: async (id, formData) => {
    const response = await apiClient.put(`/room/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Toggle room availability
  toggleAvailability: async (roomId) => {
    const response = await apiClient.post('/room/toggle-availbility', { roomId });
    return response.data;
  },

  // Delete room
  deleteRoom: async (id) => {
    const response = await apiClient.delete(`/room/${id}`);
    return response.data;
  },
};

// Booking API services
export const bookingService = {
  // Check room availability
  checkAvailability: async (data) => {
    const response = await apiClient.post('/booking/check-availability', data);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/booking/book', bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async () => {
    const response = await apiClient.get('/booking/user');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await apiClient.get(`/booking/${id}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await apiClient.put(`/booking/${id}/cancel`);
    return response.data;
  },

  // Get owner's bookings
  getOwnerBookings: async () => {
    const response = await apiClient.get('/booking/owner');
    return response.data;
  },
};

// Hotel API services
export const hotelService = {
  // Create hotel
  createHotel: async (hotelData) => {
    const response = await apiClient.post('/hotel', hotelData);
    return response.data;
  },

  // Get hotel by owner
  getOwnerHotel: async () => {
    const response = await apiClient.get('/hotel/owner');
    return response.data;
  },

  // Update hotel
  updateHotel: async (id, hotelData) => {
    const response = await apiClient.put(`/hotel/${id}`, hotelData);
    return response.data;
  },
};

// User API services
export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/user/profile', userData);
    return response.data;
  },
};

export default {
  room: roomService,
  booking: bookingService,
  hotel: hotelService,
  user: userService,
};
