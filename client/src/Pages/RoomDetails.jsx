import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import StarRating from '../components/StarRating'
import { roomService, bookingService } from '../api/services'
import { toast } from 'react-toastify'
import { useUser } from '@clerk/clerk-react'

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isSignedIn } = useUser()
    
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [checkingAvailability, setCheckingAvailability] = useState(false)
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1
    })
    const [availabilityInfo, setAvailabilityInfo] = useState(null)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [stripeRedirecting, setStripeRedirecting] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await roomService.getRoomById(id)
                setRoom(response.room)
                if (response.room?.images?.length > 0) {
                    setMainImage(response.room.images[0])
                }
            } catch (error) {
                console.error('Error fetching room:', error)
                toast.error('Failed to load room details')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleInputChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        })
        setAvailabilityInfo(null)
    }

    const calculateNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0
        const checkIn = new Date(bookingData.checkIn)
        const checkOut = new Date(bookingData.checkOut)
        const diff = checkOut - checkIn
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    const calculateTotalPrice = () => {
        const nights = calculateNights()
        const pricePerNight = room?.pricePerNignt || room?.pricePerNight || 0
        return nights * pricePerNight
    }

    const handleCheckAvailability = async (e) => {
        e.preventDefault()
        
        if (!bookingData.checkIn || !bookingData.checkOut) {
            toast.error('Please select check-in and check-out dates')
            return
        }

        const checkIn = new Date(bookingData.checkIn)
        const checkOut = new Date(bookingData.checkOut)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (checkIn < today) {
            toast.error('Check-in date cannot be in the past')
            return
        }

        if (checkOut <= checkIn) {
            toast.error('Check-out date must be after check-in date')
            return
        }

        try {
            setCheckingAvailability(true)
            const response = await bookingService.checkAvailability({
                room: id,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut
            })

            if (response.isAvailable) {
                setAvailabilityInfo({
                    available: true,
                    nights: calculateNights(),
                    totalPrice: calculateTotalPrice()
                })
                toast.success('Room is available! You can proceed with booking.')
            } else {
                setAvailabilityInfo({ available: false })
                toast.warning('Room is not available for selected dates')
            }
        } catch (error) {
            console.error('Error checking availability:', error)
            toast.error('Failed to check availability')
        } finally {
            setCheckingAvailability(false)
        }
    }

    const handleBookNow = () => {
        if (!isSignedIn) {
            toast.info('Please sign in to book a room')
            return
        }

        if (!availabilityInfo?.available) {
            toast.error('Please check availability first')
            return
        }

        setShowBookingModal(true)
    }

    const redirectToStripe = async (bookingId) => {
        if (!bookingId) {
            throw new Error('Missing booking id for Stripe checkout')
        }

        const sessionResponse = await bookingService.initiateStripeCheckout(bookingId)
        if (!sessionResponse?.url) {
            throw new Error('Stripe session could not be created')
        }
        toast.info('Redirecting you to our secure payment partner...')
        window.location.href = sessionResponse.url
    }

    const confirmBooking = async (paymentType = 'hotel') => {
        try {
            if (paymentType === 'stripe') {
                setStripeRedirecting(true)
            } else {
                setBookingLoading(true)
            }
            
            const bookingPayload = {
                room: id,
                hotel: room.hotel._id || room.hotel,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut,
                guests: bookingData.guests,
                totalPrice: calculateTotalPrice(),
                paymentMethod: paymentType === 'stripe' ? 'Stripe' : 'Pay At Hotel'
            }

            // console.log('Creating booking with payload:', bookingPayload)
            const response = await bookingService.createBooking(bookingPayload)
            // console.log('Booking response:', response)
            
            if (response.success) {
                if (paymentType === 'stripe') {
                    await redirectToStripe(response.booking?._id)
                } else {
                    toast.success('Booking confirmed! Redirecting to your bookings...')
                    setShowBookingModal(false)
                    setTimeout(() => {
                        navigate('/my-bookings')
                    }, 1500)
                }
            }
        } catch (error) {
            console.error('Booking error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking'
            toast.error(errorMessage)
        } finally {
            if (paymentType === 'stripe') {
                setStripeRedirecting(false)
            } else {
                setBookingLoading(false)
            }
        }
    }

    if (loading) {
        return (
            <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
                <div className='text-gray-500'>Loading room details...</div>
            </div>
        )
    }

    if (!room) {
        return (
            <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
                <div className='text-gray-500'>Room not found</div>
                <button 
                    onClick={() => navigate('/rooms')}
                    className='mt-4 px-6 py-2 btn-brand rounded-lg cursor-pointer'
                >
                    Browse Rooms
                </button>
            </div>
        )
    }


    return (
        <div className='relative py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen overflow-hidden'>
            {/* Luxury Deep Blue/Teal Background - Enhanced vibrant colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100 dark:from-gray-900 dark:via-cyan-900/10 dark:to-teal-900/10 -z-10"></div>
            
            {/* Decorative glow orbs - More visible */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/40 dark:bg-cyan-600/10 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/40 dark:bg-teal-600/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/25 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '3s' }}></div>

            <div className="relative z-10">
            {/*     ROOM DETAILS */}

            <div className='flex flex-col md:flex-row items-start md:items-center gap-3 mb-2'>
                <h1 className='text-3xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-cyan-700 via-blue-700 to-teal-700 dark:from-cyan-300 dark:via-blue-300 dark:to-teal-300 bg-clip-text text-transparent'>
                    {room.hotel.name} <span className='font-inter text-base font-normal text-gray-600 dark:text-gray-400'>({room.roomType})</span>
                </h1>
                <p className='text-xs w-fit font-semibold py-2 px-4 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg animate-pulse'>✨ 20% OFF</p>
            </div>

            {/* Room Rating */}
            <div className='flex items-center gap-2 mt-3 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 w-fit shadow-md border border-cyan-100 dark:border-cyan-900'>
                <StarRating />
                <p className='ml-2 text-gray-700 dark:text-gray-300 font-medium'>200+ reviews</p>
            </div>

            {/* Room Address */}
            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-3 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg px-4 py-2.5 w-fit shadow-md'>
                <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{room?.hotel?.address || 'Location not specified'}</span>
            </div>

            {/* Room Image */}
            <div className='flex flex-col lg:flex-row mt-8 gap-6'>
                <div className='lg:w-1/2 w-full group relative overflow-hidden rounded-2xl shadow-2xl'>
                    <img src={mainImage || room?.images?.[0] || assets.uploadArea} alt="Room - Image" className='w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110' />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.images && room.images.length > 1 && room.images.map((image, index) => (
                        <div 
                            key={index} 
                            className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                            onClick={() => {
                                // console.log('Image clicked:', image);
                                setMainImage(image);
                            }}
                        >
                            <img 
                                src={image} 
                                alt={`Room View ${index + 1}`}
                                className={`w-full h-44 object-cover transition-all duration-500 group-hover:scale-110 ${mainImage === image ? 'ring-4 ring-cyan-500 dark:ring-cyan-400' : 'hover:ring-2 hover:ring-teal-300'}`} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {/* Click indicator */}
                            <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Room Highlights */}

            <div className='mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-cyan-200 dark:border-cyan-800'>
                <h2 className='font-playfair text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 dark:from-cyan-300 dark:to-teal-300 bg-clip-text text-transparent'>Experience Luxury Like Never Before</h2>
                <div className="flex flex-col items-end">
                    <p className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent'>Rs {Number(room.pricePerNignt || room.pricePerNight || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">per night</p>
                </div>
            </div>
            <div className='flex flex-wrap items-center mt-6 mb-6 gap-3'>
                {room.amenities && room.amenities.length > 0 ? room.amenities.map((item, index) => (
                    <div key={index} className='flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 border border-cyan-100 dark:border-cyan-900 hover:scale-105 cursor-pointer'>
                        {facilityIcons[item] ? (
                            <img src={facilityIcons[item]} alt={item} className='w-5 h-5 dark:invert' onError={(e) => e.target.style.display = 'none'} />
                        ) : (
                            <span className="w-5 h-5 text-cyan-600 dark:text-cyan-400">✓</span>
                        )}
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{item}</p>
                    </div>
                )) : <p className='text-gray-500 dark:text-gray-400'>No amenities listed</p>}
            </div>


            {/*  checkIn checkOut Form */}

            <form id='booking-form' onSubmit={handleCheckAvailability} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-gray-900 shadow-[0px_0px_20px_rgba(0,0,0,0.25)] dark:shadow-[0px_0px_20px_rgba(0,0,0,0.5)] p-6 rounded-xl mx-auto mt-16 max-w-6xl border dark:border-gray-800'>

                <div className='flex flex-col flex-wrap md:flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500 dark:text-gray-400'>

                    <div className='flex flex-col'>
                        <label htmlFor="checkIn" className='font-medium'>Check-In</label>
                        <input 
                            type="date" 
                            id='checkIn' 
                            name='checkIn'
                            value={bookingData.checkIn}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className='width-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
                            required 
                        />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="checkOut" className='font-medium'>Check-Out</label>
                        <input 
                            type="date" 
                            id='checkOut' 
                            name='checkOut'
                            value={bookingData.checkOut}
                            onChange={handleInputChange}
                            min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                            className='width-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
                            required 
                        />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input 
                            type="number" 
                            id='guests' 
                            name='guests'
                            value={bookingData.guests}
                            onChange={handleInputChange}
                            min='1'
                            max={room.capacity || 10}
                            className='max-w-20 rounded border border-gray-300 px-4 py-2 mt-1.5 outline-none' 
                            required 
                        />
                    </div>

                </div>

                <button 
                    type='submit' 
                    disabled={checkingAvailability}
                    className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gray-600'
                >
                    {checkingAvailability ? 'Checking...' : 'Check Availability'}
                </button>


            </form>

            {/* Availability Info */}
            {availabilityInfo && (
                <div
                    className={`mt-8 max-w-6xl mx-auto rounded-2xl border p-6 md:p-8 shadow-xl backdrop-blur-sm transition-all ${
                        availabilityInfo.available
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-emerald-900/10 dark:to-green-900/10 border-green-200 dark:border-emerald-800'
                            : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-rose-900/10 dark:to-red-900/10 border-rose-200 dark:border-rose-800'
                    }`}
                >
                    {availabilityInfo.available ? (
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center gap-3'>
                                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-emerald-900/40 dark:text-emerald-300'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.452a.75.75 0 1 0-1.22-.896l-3.236 4.41-1.69-1.69a.75.75 0 1 0-1.06 1.061l2.25 2.25a.75.75 0 0 0 1.137-.094l3.519-5.041Z" clipRule="evenodd"/></svg>
                                    </span>
                                    <div>
                                        <h3 className='text-xl md:text-2xl font-semibold text-green-800 dark:text-emerald-300'>Good news! This room is available</h3>
                                        <p className='text-sm text-green-700/80 dark:text-emerald-400/80'>Secure it now — no prepayment needed</p>
                                    </div>
                                </div>
                                <div className='hidden md:block px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white'>Available</div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div className='rounded-xl border border-green-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-900/20 p-4 flex items-center gap-3'>
                                    <span className='h-9 w-9 flex items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-emerald-800/50 dark:text-emerald-200'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>
                                    </span>
                                    <div>
                                        <p className='text-xs text-gray-500'>Nights</p>
                                        <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{availabilityInfo.nights}</p>
                                    </div>
                                </div>
                                <div className='rounded-xl border border-green-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-900/20 p-4 flex items-center gap-3'>
                                    <span className='h-9 w-9 flex items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-emerald-800/50 dark:text-emerald-200'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.25 1.5a.75.75 0 0 1 .75.75V3h1.5a.75.75 0 0 1 0 1.5H12v1.5h1.5a.75.75 0 0 1 0 1.5H12V9h1.5a.75.75 0 0 1 0 1.5H12v1.5h1.5a.75.75 0 0 1 0 1.5H12V15h1.5a.75.75 0 0 1 0 1.5H12v1.25a.75.75 0 0 1-1.5 0V16.5H9a.75.75 0 0 1 0-1.5h1.5V13.5H9a.75.75 0 0 1 0-1.5h1.5V10.5H9a.75.75 0 0 1 0-1.5h1.5V7.5H9A.75.75 0 0 1 9 6h1.5V4.5H9A.75.75 0 0 1 9 3h1.5V2.25a.75.75 0 0 1 .75-.75Z"/></svg>
                                    </span>
                                    <div>
                                        <p className='text-xs text-gray-500'>Price/Night</p>
                                        <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Rs {Number(room.pricePerNignt || room.pricePerNight || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className='rounded-xl border border-green-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-900/20 p-4 flex items-center gap-3'>
                                    <span className='h-9 w-9 flex items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-emerald-800/50 dark:text-emerald-200'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12"/></svg>
                                    </span>
                                    <div>
                                        <p className='text-xs text-gray-500'>Subtotal</p>
                                        <p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Rs {Number(availabilityInfo.totalPrice || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='rounded-xl bg-white/80 dark:bg-gray-900/50 border border-green-200 dark:border-emerald-800 p-5'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-600 dark:text-gray-300'>Breakdown</span>
                                </div>
                                <div className='mt-3 space-y-2 text-gray-700 dark:text-gray-200'>
                                    <div className='flex items-center justify-between'>
                                        <span>{availabilityInfo.nights} × Rs {Number(room.pricePerNignt || room.pricePerNight || 0).toFixed(2)}</span>
                                        <span>Rs {Number(availabilityInfo.totalPrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className='flex items-center justify-between text-sm text-gray-500'>
                                        <span>Fees</span>
                                        <span>Included</span>
                                    </div>
                                </div>
                                <div className='mt-4 pt-3 border-t border-green-200/70 dark:border-emerald-800/70 flex items-center justify-between'>
                                    <span className='text-lg font-semibold'>Total due at hotel</span>
                                    <span className='text-2xl font-bold text-green-700 dark:text-emerald-300'>Rs {Number(availabilityInfo.totalPrice || 0).toFixed(2)}</span>
                                </div>
                                <p className='mt-2 text-xs text-green-800/80 dark:text-emerald-400/80'>No prepayment needed • Free cancellation until check‑in</p>
                            </div>

                            <div className='flex flex-col md:flex-row gap-3'>
                                <button
                                    onClick={handleBookNow}
                                    className='flex-1 md:flex-none md:min-w-[200px] inline-flex items-center justify-center gap-2 px-8 py-3 btn-brand text-white rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121 0 2.1-.772 2.326-1.87l1.35-6.48A1.125 1.125 0 0 0 20.297 3H5.106m2.394 11.25L5.106 3m2.394 11.25L9 20.25m3-6.75v6.75"/></svg>
                                    Book Now
                                </button>
                                <button
                                    onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className='flex-1 md:flex-none md:min-w-[200px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border border-green-300 text-green-700 bg-white hover:bg-green-50 dark:bg-transparent dark:text-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/20 transition-all cursor-pointer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75h19.5m-16.5 3h13.5M6 13.5h12"/></svg>
                                    Change dates
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='space-y-5'>
                            <div className='flex items-center gap-3'>
                                <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.75 5.25a.75.75 0 1 0-1.5 0v5.25a.75.75 0 0 0 1.5 0V7.5Zm0 8.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd"/></svg>
                                </span>
                                <div>
                                    <h3 className='text-xl md:text-2xl font-semibold text-rose-800 dark:text-rose-300'>Not available for these dates</h3>
                                    <p className='text-sm text-rose-700/80 dark:text-rose-400/80'>Try adjusting your dates or explore similar rooms</p>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-2'>
                                <span className='px-3 py-1 text-xs rounded-full bg-white/80 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'>Flexible dates</span>
                                <span className='px-3 py-1 text-xs rounded-full bg-white/80 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'>Try fewer nights</span>
                                <span className='px-3 py-1 text-xs rounded-full bg-white/80 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'>Reduce guests</span>
                            </div>

                            <div className='flex flex-col md:flex-row gap-3'>
                                <button
                                    onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className='flex-1 md:flex-none md:min-w-[200px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 dark:bg-transparent dark:text-rose-300 dark:border-rose-700 dark:hover:bg-rose-900/20 transition-all cursor-pointer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75h19.5m-16.5 3h13.5M6 13.5h12"/></svg>
                                    Change dates
                                </button>
                                <Link
                                    to='/rooms'
                                    className='flex-1 md:flex-none md:min-w-[200px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all cursor-pointer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-9A2.25 2.25 0 0 0 2.25 5.25v13.5A2.25 2.25 0 0 0 4.5 21h9a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
                                    See similar rooms
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}


            {/* Common Specifications */}
            <div className='mt-25 space-y-4 mb-10'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className='w-11/12 md:w-2/3 lg:w-[40%] h-px bg-gray-400/70 mb-10'></div>

                <p className='w-11/12 md:w-2/3 lg:w-[40%] text-xs font-playfair text-gray-700'>
                    Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.
                </p>

                <div className='w-11/12 md:w-2/3 lg:w-[40%] h-px bg-gray-400/70 mt-10'></div>
            </div>


            {/* Hosted By */}
            {room?.hotel && (
                <div className='flex flex-col left-0 items-start gap-5 pt-4 pb-4 pr-4 border mt-4 border-gray-50 rounded-xl shadow-sm'>

                    {/* Header */}
                    <h2 className='text-2xl font-playfair text-gray-800'>
                        Hosted by {room.hotel.owner?.name || room.hotel.name}
                    </h2>

                    {/* Host Info */}
                    {room.hotel.owner && (
                        <div className='flex items-center gap-4'>
                            <div>
                                <img
                                    src={room.hotel.owner.image || 'https://via.placeholder.com/150'}
                                    alt={`Profile of ${room.hotel.owner.name}`}
                                    className='w-16 h-16 rounded-full object-cover'
                                />
                            </div>
                            <div>
                                <p className='text-lg font-semibold text-gray-900'>
                                    {room.hotel.owner.name}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    Superhost • 3 years hosting
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Host Bio/Description */}
                    <p className='text-gray-600 leading-relaxed'>
                        {room.hotel.owner?.bio || room.hotel.description || "Welcome to our hotel! We're dedicated to providing a fantastic stay for our guests. Don't hesitate to reach out with any questions you might have!"}
                    </p>

                    {/* Contact Button */}
                    <Link to='/contactHere' className='mt-2 px-6 py-3 cursor-pointer bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:ring-white transition-all'>
                        Contact Host
                    </Link>
                </div>
            )}

            {/* Booking Confirmation Modal */}
            {showBookingModal && (
                <div className='fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-8 shadow-2xl animate-fadeIn border dark:border-gray-800'>
                        <h2 className='text-2xl font-playfair font-bold mb-4'>Confirm Your Booking</h2>
                        
                        <div className='space-y-3 mb-6'>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Room:</span>
                                <span className='font-semibold'>{room.roomType}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Check-in:</span>
                                <span className='font-semibold'>{new Date(bookingData.checkIn).toLocaleDateString()}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Check-out:</span>
                                <span className='font-semibold'>{new Date(bookingData.checkOut).toLocaleDateString()}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Guests:</span>
                                <span className='font-semibold'>{bookingData.guests}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Nights:</span>
                                <span className='font-semibold'>{calculateNights()}</span>
                            </div>
                            <div className='pt-3 border-t border-gray-200'>
                                <div className='flex justify-between text-lg'>
                                    <span className='font-bold'>Total Amount:</span>
                                    <span className='font-bold text-green-600'>Rs {calculateTotalPrice()}</span>
                                </div>
                            </div>
                            <div className='bg-blue-50 p-3 rounded-lg'>
                                <p className='text-sm text-blue-800'>
                                    💳 Payment: Choose to pay now via Stripe for instant confirmation or settle at the hotel reception.
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <div className='flex gap-3'>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className='flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all'
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={() => confirmBooking('hotel')}
                                    disabled={bookingLoading}
                                    className='flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                                >
                                    {bookingLoading ? 'Booking...' : 'Confirm & Pay at Hotel'}
                                </button>
                            </div>
                            <button
                                onClick={() => confirmBooking('stripe')}
                                disabled={stripeRedirecting}
                                className='w-full inline-flex items-center justify-center gap-2 px-6 py-3 btn-brand text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed'
                            >
                                {stripeRedirecting ? 'Redirecting to Stripe...' : 'Pay Now with Card'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </div>
        </div>
    )
}

export default RoomDetails