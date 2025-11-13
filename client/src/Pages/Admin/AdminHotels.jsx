import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/hotels');
      setHotels(response.data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Are you sure? This will delete the hotel and all its rooms!')) return;

    try {
      await apiClient.delete(`/admin/hotels/${id}`);
      setHotels(hotels.filter((h) => h._id !== id));
      alert('Hotel deleted successfully');
    } catch (error) {
      alert('Failed to delete hotel');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Hotels</h1>
        <p className="text-gray-600">View and manage all hotels on the platform</p>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hotels found
          </div>
        ) : (
          hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Hotel Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl">
                🏨
              </div>

              {/* Hotel Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{hotel.location || 'Location not set'}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 mb-1">Rooms</p>
                    <p className="text-2xl font-bold text-blue-700">{hotel.roomCount || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 mb-1">Bookings</p>
                    <p className="text-2xl font-bold text-green-700">{hotel.bookingCount || 0}</p>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Owner:</span> {hotel.owner?.name || 'N/A'}</p>
                  <p className="text-xs">{hotel.owner?.email || ''}</p>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDeleteHotel(hotel._id)}
                  className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Delete Hotel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHotels;
