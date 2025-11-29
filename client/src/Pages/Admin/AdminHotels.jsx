import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    address: '',
    contact: '',
    city: '',
    ownerId: '',
    image: ''
  });

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
      toast.success('Hotel deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete hotel');
      console.error(error);
    }
  };

  const openForm = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormValues({
        name: hotel.name || '',
        address: hotel.address || '',
        contact: hotel.contact || '',
        city: hotel.city || '',
        ownerId: hotel.owner?._id || hotel.owner || '',
        image: hotel.image || ''
      });
    } else {
      setEditingHotel(null);
      setFormValues({ name: '', address: '', contact: '', city: '', ownerId: '', image: '' });
    }
    setFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHotel = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingHotel) {
        await apiClient.put(`/hotel/${editingHotel._id}`, formValues);
        toast.success('Hotel updated successfully');
      } else {
        await apiClient.post('/hotel', formValues);
        toast.success('Hotel created successfully');
      }
      setFormOpen(false);
      fetchHotels();
    } catch (error) {
      console.error('Hotel save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save hotel');
    } finally {
      setSaving(false);
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
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Hotels</h1>
          <p className="text-gray-600">Add new properties, update ownership, or clean up inventory.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition"
        >
          + Add Hotel
        </button>
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
              {hotel.image ? (
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Hotel';
                  }}
                />
              ) : (
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl">
                  🏨
                </div>
              )}

              {/* Hotel Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{hotel.city || hotel.address || 'Location not set'}</p>

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
                  <p className="text-xs">{hotel.owner?.email || hotel.owner || ''}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openForm(hotel)}
                    className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel._id)}
                    className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingHotel ? 'Update Hotel' : 'Create Hotel'}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveHotel}>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Hotel Name
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleFormChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                City
                <input
                  type="text"
                  name="city"
                  value={formValues.city}
                  onChange={handleFormChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                Address
                <input
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleFormChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                Cover Image URL
                <input
                  type="url"
                  name="image"
                  value={formValues.image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/hotel.jpg"
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-xs text-gray-400">Optional hero photo shown on the admin cards.</span>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Contact Number
                <input
                  type="text"
                  name="contact"
                  value={formValues.contact}
                  onChange={handleFormChange}
                  required
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Owner (User ID)
                <input
                  type="text"
                  name="ownerId"
                  value={formValues.ownerId}
                  onChange={handleFormChange}
                  placeholder="Leave blank to assign yourself (admins can create multiple hotels)"
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-xs text-gray-400">Paste a Clerk user ID to assign someone else, or leave blank to keep it under your account.</span>
              </label>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHotels;
