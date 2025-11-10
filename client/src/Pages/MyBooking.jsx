import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
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

    const filteredBookings = filter === 'all' 
        ? bookings 
        : bookings.filter(b => b.status === filter)

    if (loading) {
        return (
            <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
                <div className='text-gray-500'>Loading your bookings...</div>
            </div>
        )
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>


            <Title title='My Bookings' subTitle='Easily manage past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />

            {/* Filter Tabs */}
            <div className='flex gap-2 mt-8 mb-6 flex-wrap'>
                {['all', 'pending', 'confirmed', 'cancelled'].map((filterOption, index) => (
                    <button
                        key={index}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                            filter === filterOption
                                ? 'btn-brand text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        {filterOption !== 'all' && ` (${bookings.filter(b => b.status === filterOption).length})`}
                    </button>
                ))}
            </div>

            {filteredBookings.length === 0 ? (
                <div className='text-center py-16 bg-gray-50 rounded-xl'>
                    <p className='text-gray-500 text-lg'>No bookings found</p>
                    <button
                        onClick={() => navigate('/rooms')}
                        className='mt-4 px-6 py-2 btn-brand rounded-lg cursor-pointer'
                    >
                        Browse Rooms
                    </button>
                </div>
            ) : (
                <>
                    <div className='max-w-10xl w-full text-gray-800'>
                        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                            <div>Hotels</div>
                            <div>Dates & Details</div>
                            <div>Payment</div>
                            <div>Actions</div>
                        </div>
                    </div>

                    {filteredBookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr_1fr] gap-4 w-full border-b border-gray-300 py-6 first:border-t items-center animate-fade-in"
                        >
                            {/* Hotel Details */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Hotel Image */}
                                <img
                                    src={booking.room?.images?.[0] || '/placeholder.jpg'}
                                    alt="hotel-img"
                                    className="w-full md:w-44 h-32 md:h-28 object-cover rounded-lg shadow-sm cursor-pointer hover:brightness-90 transition"
                                    onClick={() => navigate(`/rooms/${booking.room._id}`)}
                                />

                                {/* Hotel Info */}
                                <div className="flex flex-col justify-center">
                                    <p className="font-playfair text-2xl text-gray-800 hover:text-brand transition cursor-pointer"
                                        onClick={() => navigate(`/rooms/${booking.room._id}`)}>
                                        {booking.hotel?.name || 'Hotel'} 
                                        <span className="text-sm text-gray-500"> ({booking.room?.roomType || 'Room'})</span>
                                    </p>

                                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                                        <img
                                            src={assets.locationIcon}
                                            alt="location-icon"
                                            className="w-4 h-4"
                                        />
                                        <span>{booking.hotel?.address || 'Address'}</span>
                                    </div>

                                    <div className="mt-2">
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Dates & Details */}
                            <div className="flex flex-col gap-1 text-sm text-gray-700">
                                <p>
                                    <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Guests:</strong> {booking.guests}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div className="flex flex-col gap-1 text-sm">
                                <p className="text-lg font-bold text-brand">
                                    ${booking.totalPrice}
                                </p>
                                <p className="text-xs text-gray-500">{booking.paymentMethod || 'Pay At Hotel'}</p>
                                <p className={`text-xs ${booking.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                    {booking.isPaid ? '✓ Paid' : 'Pending Payment'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                {booking.status !== 'cancelled' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        disabled={cancellingId === booking._id}
                                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate(`/rooms/${booking.room._id}`)}
                                    className="px-4 py-2 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition text-sm cursor-pointer"
                                >
                                    View Room
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default MyBooking