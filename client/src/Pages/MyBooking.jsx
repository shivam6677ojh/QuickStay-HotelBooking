import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { bookingService } from '../api/services'
import { toast } from 'react-toastify'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const MyBooking = () => {
    const { isSignedIn } = useUser()
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, confirmed, cancelled
    const [cancellingId, setCancellingId] = useState(null)

    // Helper function to get image URL
    const getImageUrl = (booking) => {
        // Try room images first
        if (booking.room?.images && booking.room.images.length > 0) {
            return booking.room.images[0]
        }
        // Try hotel image
        if (booking.hotel?.image) {
            return booking.hotel.image
        }
        // Fallback placeholder
        return 'https://via.placeholder.com/400x300?text=No+Image'
    }

    useEffect(() => {
        if (!isSignedIn) {
            toast.info('Please sign in to view your bookings')
            navigate('/')
            return
        }
        // Add small delay to ensure auth token is set up
        const timer = setTimeout(() => {
            fetchBookings()
        }, 100)
        
        return () => clearTimeout(timer)
    }, [isSignedIn, navigate])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            console.log('Fetching bookings...')
            const response = await bookingService.getUserBookings()
            console.log('Bookings response:', response)
            console.log('First booking data:', response.bookings?.[0])
            if (response.bookings?.[0]) {
                console.log('Room data:', response.bookings[0].room)
                console.log('Hotel data:', response.bookings[0].hotel)
                console.log('Room images:', response.bookings[0].room?.images)
            }
            setBookings(response.bookings || [])
        } catch (error) {
            console.error('Error fetching bookings:', error)
            if (error.response?.status === 401) {
                toast.error('Please sign in again to view your bookings')
            } else {
                toast.error(error.response?.data?.message || 'Failed to load bookings')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return
        }

        try {
            setCancellingId(bookingId)
            await bookingService.cancelBooking(bookingId)
            toast.success('Booking cancelled successfully')
            fetchBookings() // Refresh the list
        } catch (error) {
            console.error('Error cancelling booking:', error)
            toast.error('Failed to cancel booking')
        } finally {
            setCancellingId(null)
        }
    }

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.pending}`}>
                {status?.toUpperCase() || 'PENDING'}
            </span>
        )
    }

    const filteredBookings = Array.isArray(bookings) 
        ? (filter === 'all' ? bookings : bookings.filter(b => b?.status === filter))
        : [];

    if (loading) {
        return (
            <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
                <div className='text-gray-500'>Loading your bookings...</div>
            </div>
        )
    }

    return (
        <div className='relative py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen overflow-hidden'>
            {/* Warm Amber Background with gradient - Enhanced vibrant colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 dark:from-gray-900 dark:via-orange-900/10 dark:to-amber-900/10 -z-10"></div>
            
            {/* Decorative glow orbs - More visible */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-amber-400/40 dark:bg-amber-600/10 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-400/40 dark:bg-orange-600/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-rose-300/30 dark:bg-rose-600/5 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '3s' }}></div>

            <div className="relative z-10">
                <Title title='My Bookings' subTitle='Easily manage past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />

            {/* Filter Tabs */}
            <div className='flex gap-2 mt-8 mb-6 flex-wrap'>
                {['all', 'pending', 'confirmed', 'cancelled'].map((filterOption, index) => (
                    <button
                        key={index}
                        onClick={() => setFilter(filterOption)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md ${
                            filter === filterOption
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 border border-amber-200 dark:border-gray-600'
                        }`}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        {filterOption !== 'all' && ` (${bookings.filter(b => b.status === filterOption).length})`}
                    </button>
                ))}
            </div>

            {filteredBookings.length === 0 ? (
                <div className='text-center py-20 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 dark:border-gray-700'>
                    <div className="mb-4">
                        <svg className="w-24 h-24 mx-auto text-amber-300 dark:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className='text-gray-600 dark:text-gray-300 text-xl font-medium mb-2'>No bookings found</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm mb-6'>Start planning your next adventure!</p>
                    <button
                        onClick={() => navigate('/rooms')}
                        className='px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all cursor-pointer'
                    >
                        Browse Rooms →
                    </button>
                </div>
            ) : (
                <>
                    <div className='max-w-10xl w-full text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-t-2xl p-4 shadow-lg'>
                        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr_1fr] w-full font-bold text-base text-amber-900 dark:text-amber-100'>
                            <div>Hotels</div>
                            <div>Dates & Details</div>
                            <div>Payment</div>
                            <div>Actions</div>
                        </div>
                    </div>

                    {filteredBookings.map((booking, idx) => (
                        <div
                            key={booking._id}
                            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr_1fr] gap-4 w-full bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-b border-amber-100 dark:border-gray-700 py-6 px-4 hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 items-center shadow-sm animate-fade-in"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Hotel Details */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Hotel Image */}
                                <div className="relative group overflow-hidden rounded-xl shadow-md">
                                    <img
                                        src={getImageUrl(booking)}
                                        alt={`${booking.hotel?.name || 'Hotel'} - ${booking.room?.roomType || 'Room'}`}
                                        className="w-full md:w-44 h-32 md:h-28 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                                        onClick={() => booking.room?._id && navigate(`/rooms/${booking.room._id}`)}
                                        onError={(e) => { 
                                            console.error('Image failed to load:', e.target.src)
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' 
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Hotel Info */}
                                <div className="flex flex-col justify-center">
                                    <p className="font-playfair text-2xl text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                                        onClick={() => booking.room?._id && navigate(`/rooms/${booking.room._id}`)}>
                                        {booking.hotel?.name || 'Hotel'} 
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-sans"> ({booking.room?.roomType || 'Room'})</span>
                                    </p>

                                    <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{booking.hotel?.address || 'Address'}</span>
                                    </div>

                                    <div className="mt-3">
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Dates & Details */}
                            <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300 bg-amber-50/50 dark:bg-gray-900/30 p-3 rounded-lg">
                                <p className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <strong>Guests:</strong> {booking.guests}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                    Booked {new Date(booking.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div className="flex flex-col gap-1.5 text-sm bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg">
                                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    ${booking.totalPrice}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{booking.paymentMethod || 'Pay At Hotel'}</p>
                                <p className={`text-xs font-semibold ${booking.isPaid ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                    {booking.isPaid ? '✓ Paid' : '⏳ Pending Payment'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                {booking.status !== 'cancelled' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        disabled={cancellingId === booking._id}
                                        className="px-4 py-2.5 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:scale-105 shadow-sm"
                                    >
                                        {cancellingId === booking._id ? 'Cancelling...' : '✕ Cancel Booking'}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (booking.room?._id) {
                                            navigate(`/rooms/${booking.room._id}`)
                                        } else {
                                            toast.error('Room information not available')
                                        }
                                    }}
                                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold cursor-pointer hover:scale-105"
                                >
                                    View Room →
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
            </div>
        </div>
    )
}

export default MyBooking