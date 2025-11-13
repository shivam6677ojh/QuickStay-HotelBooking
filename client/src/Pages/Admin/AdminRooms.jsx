import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/rooms');
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await apiClient.delete(`/admin/rooms/${id}`);
      setRooms(rooms.filter((r) => r._id !== id));
      alert('Room deleted successfully');
    } catch (error) {
      alert('Failed to delete room');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Rooms</h1>
        <p className="text-gray-600">View and manage all rooms on the platform</p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No rooms found
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Room Image */}
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl">
                🛏️
              </div>

              {/* Room Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.title || 'Untitled Room'}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {room.hotel?.name || 'No hotel'} - {room.hotel?.location || 'No location'}
                </p>

                {/* Room Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900">${room.price || 0}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-900">{room.capacity || 0} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold text-gray-900">{room.size || 0} sq ft</span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDeleteRoom(room._id)}
                  className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Delete Room
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRooms;
