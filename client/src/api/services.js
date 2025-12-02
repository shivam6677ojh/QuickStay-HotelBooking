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

  getRoomById: async (id) => {
    const response = await apiClient.get(`/room/${id}`);
    return response.data;
  },

  getOwnerRooms: async () => {
    const response = await apiClient.get('/room/owner');
    return response.data;
  },

  createRoom: async (formData) => {
    const response = await apiClient.post('/room', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateRoom: async (id, formData) => {
    const response = await apiClient.put(`/room/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  toggleAvailability: async (roomId) => {
    const response = await apiClient.post('/room/toggle-availbility', { roomId });
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await apiClient.delete(`/room/${id}`);
    return response.data;
  },
};

// Booking API services
export const bookingService = {
  checkAvailability: async (data) => {
    const response = await apiClient.post('/booking/check-availability', data);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await apiClient.post('/booking/book', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await apiClient.get('/booking/user');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await apiClient.get(`/booking/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await apiClient.put(`/booking/${id}/cancel`);
    return response.data;
  },

  getOwnerBookings: async () => {
    const response = await apiClient.get('/booking/owner');
    return response.data;
  },

  initiateStripeCheckout: async (bookingId) => {
    const response = await apiClient.post('/booking/stripe-payment', { bookingId });
    return response.data;
  },

  verifyStripeSession: async (sessionId) => {
    const response = await apiClient.get(`/booking/stripe-session/${sessionId}`);
    return response.data;
  },
};

// Hotel API services
export const hotelService = {
  createHotel: async (hotelData) => {
    const response = await apiClient.post('/hotel', hotelData);
    return response.data;
  },

  getOwnerHotel: async () => {
    const response = await apiClient.get('/hotel/owner');
    return response.data;
  },

  updateHotel: async (id, hotelData) => {
    const response = await apiClient.put(`/hotel/${id}`, hotelData);
    return response.data;
  },
};

// User API services
export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/user/profile', userData);
    return response.data;
  },
};

// AI concierge services
export const aiService = {
  chat: async (payload) => {
    const response = await apiClient.post('/ai/chat', payload);
    return response.data;
  },
};

export default {
  room: roomService,
  booking: bookingService,
  hotel: hotelService,
  user: userService,
  ai: aiService,
};
