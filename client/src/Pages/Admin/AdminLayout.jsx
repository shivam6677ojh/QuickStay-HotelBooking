import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Hotels', path: '/admin/hotels', icon: '🏨' },
    { name: 'Rooms', path: '/admin/rooms', icon: '🛏️' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold mb-1">QuickStay</h1>
          <p className="text-sm text-indigo-200">Admin Portal</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-white/20 shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <UserButton />
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.fullName || user?.firstName || 'Admin'}</p>
              <p className="text-xs text-indigo-200">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Website
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
