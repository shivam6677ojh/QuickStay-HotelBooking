import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formValues, setFormValues] = useState({
    hotelId: '',
    roomType: '',
    pricePerNight: '',
    capacity: 2,
    description: '',
    amenities: ''
  });
  const [images, setImages] = useState([]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/rooms');
      // console.log('Admin Rooms Response:', response.data);
      // console.log('Total rooms fetched:', response.data.rooms?.length || 0);
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await apiClient.delete(`/admin/rooms/${id}`);
      setRooms(rooms.filter((r) => r._id !== id));
      toast.success('Room deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
      console.error(error);
    }
  };

  const fetchHotels = useCallback(async () => {
    try {
      const response = await apiClient.get('/admin/hotels');
      setHotels(response.data.hotels || []);
      const firstHotelId = response.data.hotels?.[0]?._id;
      if (firstHotelId) {
        setFormValues((prev) => (prev.hotelId ? prev : { ...prev, hotelId: firstHotelId }));
      }
    } catch (error) {
      console.error('Error fetching hotels for room form:', error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, [fetchRooms, fetchHotels]);

  const openRoomForm = () => {
    setFormValues({ hotelId: hotels[0]?._id || '', roomType: '', pricePerNight: '', capacity: 2, description: '', amenities: '' });
    setImages([]);
    setFormOpen(true);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!formValues.hotelId) {
      toast.error('Please select a hotel');
      return;
    }
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append('hotelId', formValues.hotelId);
      formData.append('roomType', formValues.roomType);
      formData.append('pricePerNight', formValues.pricePerNight);
      formData.append('capacity', formValues.capacity);
      formData.append('description', formValues.description);
      const amenitiesArray = formValues.amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      formData.append('amenities', JSON.stringify(amenitiesArray));
      images.forEach((file) => formData.append('images', file));

      await apiClient.post('/room', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Room created successfully');
      setFormOpen(false);
      fetchRooms();
    } catch (error) {
      console.error('Create room error:', error);
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
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
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Rooms</h1>
          <p className="text-gray-600">View, add, or remove rooms across every property ({rooms.length} total)</p>
        </div>
        <button
          onClick={openRoomForm}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow hover:bg-purple-500 transition"
        >
          + Add Room
        </button>
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
              <div className="h-48 overflow-hidden bg-gray-200">
                {room.images && room.images.length > 0 ? (
                  <img 
                    src={room.images[0]} 
                    alt={room.roomType || 'Room'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Room+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 text-white text-4xl">
                    🛏️
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.roomType || 'Untitled Room'}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {room.hotel?.name || 'No hotel'} - {room.hotel?.city || 'No location'}
                </p>

                {/* Room Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900">Rs {Number(room.pricePerNignt || room.pricePerNight || 0).toFixed(2)}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-900">{room.capacity || 2} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amenities:</span>
                    <span className="font-semibold text-gray-900">{room.amenities?.length || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Create New Room</h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateRoom}>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Select Hotel
                <select
                  name="hotelId"
                  value={formValues.hotelId}
                  onChange={handleFieldChange}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="" disabled>
                    {hotels.length ? 'Choose property' : 'No hotels available'}
                  </option>
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name} — {hotel.city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Room Type / Title
                <input
                  type="text"
                  name="roomType"
                  value={formValues.roomType}
                  onChange={handleFieldChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Price Per Night (INR)
                <input
                  type="number"
                  name="pricePerNight"
                  min="1"
                  step="0.01"
                  value={formValues.pricePerNight}
                  onChange={handleFieldChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Capacity (guests)
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={formValues.capacity}
                  onChange={handleFieldChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                Description
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleFieldChange}
                  rows="3"
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Highlight what makes this room special"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                Amenities (comma separated)
                <input
                  type="text"
                  name="amenities"
                  value={formValues.amenities}
                  onChange={handleFieldChange}
                  placeholder="WiFi, Pool, Breakfast, ..."
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                Room Photos
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="rounded-xl border border-dashed border-gray-300 px-4 py-3 bg-gray-50"
                />
                <span className="text-xs text-gray-400">Upload up to 4 images. First image will be used as thumbnail.</span>
              </label>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold shadow hover:bg-purple-500 disabled:opacity-60"
                >
                  {creating ? 'Creating…' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
