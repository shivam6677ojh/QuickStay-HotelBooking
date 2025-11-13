import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/stats');
      setStats(response.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Complete control over QuickStay platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="bg-blue-500"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Total Hotels"
          value={stats?.totalHotels || 0}
          icon="🏨"
          color="bg-green-500"
          onClick={() => navigate('/admin/hotels')}
        />
        <StatCard
          title="Total Rooms"
          value={stats?.totalRooms || 0}
          icon="🛏️"
          color="bg-purple-500"
          onClick={() => navigate('/admin/rooms')}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon="📅"
          color="bg-orange-500"
          onClick={() => navigate('/admin/bookings')}
        />
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-1">Total Revenue</p>
            <p className="text-4xl font-bold">${stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
          <div className="text-6xl">💰</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActionCard
          title="Manage Bookings"
          description="View, cancel, and update booking statuses"
          icon="📋"
          onClick={() => navigate('/admin/bookings')}
        />
        <ActionCard
          title="Manage Hotels"
          description="View and manage all hotels on the platform"
          icon="🏨"
          onClick={() => navigate('/admin/hotels')}
        />
        <ActionCard
          title="Manage Users"
          description="View users and update roles"
          icon="👤"
          onClick={() => navigate('/admin/users')}
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="space-y-3">
          {stats?.recentBookings && stats.recentBookings.length > 0 ? (
            stats.recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium">{booking.room?.title || 'Room'}</p>
                  <p className="text-sm text-gray-600">{booking.user?.name || 'User'} - {booking.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
    <p className="text-gray-600 text-sm mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// Action Card Component
const ActionCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-indigo-500"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default AdminDashboard;
