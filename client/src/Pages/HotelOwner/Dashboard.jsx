import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Title from '../../components/Title'
import { roomService, bookingService } from '../../api/services'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState([])

  // Get user role for display
  const userRole = user?.publicMetadata?.role || user?.unsafeMetadata?.role || 'admin'

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/')
      return
    }
    // Add small delay to ensure auth token is set up
    const timer = setTimeout(() => {
      fetchDashboardData()
    }, 100)
    
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      console.log('Fetching dashboard data...')
      
      // Fetch owner's rooms
      const roomsResponse = await roomService.getOwnerRooms()
      console.log('Rooms response:', roomsResponse)
      const rooms = roomsResponse.rooms || []
      
      // Fetch owner's bookings
      const bookingsResponse = await bookingService.getOwnerBookings()
      console.log('Bookings response:', bookingsResponse)
      const bookings = bookingsResponse.bookings || []
      
      // Calculate stats
      const totalRevenue = bookings
        .filter(b => b.status === 'confirmed' || b.isPaid)
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      
      const pendingBookings = bookings.filter(b => b.status === 'pending').length
      
      setStats({
        totalRooms: rooms.length,
        totalBookings: bookings.length,
        totalRevenue,
        pendingBookings
      })
      
      // Get recent 10 bookings
      setRecentBookings(bookings.slice(0, 10))
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please sign in again.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='p-8'>
        <div className='text-gray-500'>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Admin Welcome Banner */}
      <div className='mb-6 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/20 backdrop-blur-sm p-3 rounded-full'>
              <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold'>Welcome back, {user?.firstName || 'Admin'}!</h2>
              <p className='text-white/90 text-sm mt-1'>
                <span className='inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm'>
                  <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
                  Logged in as <span className='font-semibold capitalize'>{userRole}</span>
                </span>
              </p>
            </div>
          </div>
          <div className='hidden md:block text-right'>
            <p className='text-white/80 text-sm'>Admin Panel Access</p>
            <p className='text-2xl font-bold'>✓ Verified</p>
          </div>
        </div>
      </div>

      <Title 
        align='left' 
        font='outfit' 
        title='Dashboard' 
        subTitle='Monitor your room listings, track bookings and analyze revenue - all in one place. Stay updated with real-time insights to ensure smooth operations' 
      />

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8'>
        
        {/* Total Rooms */}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-600 dark:text-blue-400 text-sm font-medium mb-1'>Total Rooms</p>
              <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>{stats.totalRooms}</p>
            </div>
            <div className='bg-blue-500 dark:bg-blue-600 p-3 rounded-full'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-600 dark:text-green-400 text-sm font-medium mb-1'>Total Bookings</p>
              <p className='text-3xl font-bold text-green-900 dark:text-green-100'>{stats.totalBookings}</p>
            </div>
            <div className='bg-green-500 dark:bg-green-600 p-3 rounded-full'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-600 dark:text-purple-400 text-sm font-medium mb-1'>Total Revenue</p>
              <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>${stats.totalRevenue}</p>
            </div>
            <div className='bg-purple-500 dark:bg-purple-600 p-3 rounded-full'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200 dark:border-amber-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-amber-600 dark:text-amber-400 text-sm font-medium mb-1'>Pending</p>
              <p className='text-3xl font-bold text-amber-900 dark:text-amber-100'>{stats.pendingBookings}</p>
            </div>
            <div className='bg-amber-500 dark:bg-amber-600 p-3 rounded-full'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mb-8 flex gap-4'>
        <button
          onClick={() => navigate('/owner/add-room')}
          className='px-6 py-3 btn-brand text-white rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer'
        >
          Add New Room
        </button>
        <button
          onClick={() => navigate('/owner/list-room')}
          className='px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 transition-all cursor-pointer'
        >
          View All Rooms
        </button>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-xl text-blue-950/70 dark:text-gray-300 font-medium mb-5">
        Recent Bookings
      </h2> 

      {recentBookings.length === 0 ? (
        <div className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center'>
          <p className='text-gray-500 dark:text-gray-400'>No bookings yet</p>
        </div>
      ) : (
        <div className='w-full border border-gray-300 dark:border-gray-700 rounded-lg max-h-96 overflow-y-auto'>
          <table className='w-full'>
            <thead className='bg-gray-100 dark:bg-gray-800 sticky top-0'>
              <tr>
                <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-left'>
                  Guest
                </th>
                <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-left max-sm:hidden'>
                  Room
                </th>
                <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-left max-md:hidden'>
                  Check-in
                </th>
                <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-center'>
                  Total
                </th>
                <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-center'>
                  Status
                </th>
              </tr>
            </thead>

            <tbody className='text-sm'>
              {recentBookings.map((booking, index) => (
                <tr key={booking._id || index} className='hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'>
                  <td className='py-3 px-4 text-gray-800 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700'>
                    {booking.user?.name || booking.user?.username || 'Guest'}
                  </td>

                  <td className='py-3 px-4 text-gray-800 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 max-sm:hidden'>
                    {booking.room?.roomType || 'Room'}
                  </td>

                  <td className='py-3 px-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 max-md:hidden'>
                    {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '-'}
                  </td>

                  <td className='py-3 px-4 text-gray-800 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 text-center font-semibold'>
                    ${booking.totalPrice || 0}
                  </td>

                  <td className='py-3 px-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex justify-center'>
                      <span className={`py-1 px-3 text-xs rounded-full font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



    </div>
  )
}

export default Dashboard