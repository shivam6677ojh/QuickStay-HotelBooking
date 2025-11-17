import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({ room, index }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = room?.images && Array.isArray(room.images) && room.images.length > 0 
        ? room.images 
        : ['https://via.placeholder.com/400x300?text=No+Image'];

    // Auto-slide images every 3 seconds
    useEffect(() => {
        if (images.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handleDotClick = (idx) => {
        setCurrentImageIndex(idx);
    };

    return (
        <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)} key={room._id}
            className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-600 dark:text-gray-300 shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-700 cursor-pointer group"
            style={{ 
                animationDelay: `${index * 150}ms`,
                transform: 'translateY(0)',
            }}
        >
            {/* Animated glow effect from back */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-700 animate-pulse"></div>
            
            {/* Card content wrapper */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                
                {/* Image Slideshow Section */}
                <div className="relative w-full h-56 overflow-hidden group/img">
                    {/* skeleton shimmer while loading */}
                    {!imgLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer" />
                    )}
                    
                    {/* Slideshow Images */}
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${room.hotel?.name} - View ${idx + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                                idx === currentImageIndex 
                                    ? 'opacity-100 scale-100' 
                                    : 'opacity-0 scale-110'
                            } group-hover/img:scale-110`}
                            onLoad={() => idx === 0 && setImgLoaded(true)}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                        />
                    ))}
                    
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Animated shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Best Seller Badge with animation */}
                    {index % 2 === 0 && (
                        <div className='absolute top-3 left-3 animate-bounce'>
                            <p className='px-3 py-1.5 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1'>
                                <span className='text-sm'>⭐</span> Best Seller
                            </p>
                        </div>
                    )}
                    
                    {/* Image Counter Dots */}
                    {images.length > 1 && (
                        <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10'>
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDotClick(idx);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === currentImageIndex 
                                            ? 'w-8 bg-white' 
                                            : 'w-1.5 bg-white/50 hover:bg-white/75'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Hotel Name on Image - Large and Visible */}
                    <div className='absolute bottom-0 left-0 right-0 p-4 z-10'>
                        <h3 className='font-playfair text-2xl md:text-3xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300'>
                            {room.hotel?.name || 'Luxury Hotel'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <img src={assets.locationIcon} alt="location" className='w-4 h-4 invert brightness-0 contrast-200' />
                            <span className='text-sm text-white/90 font-medium'>{room.hotel?.city || 'Premium Location'}</span>
                        </div>
                    </div>
                </div>

                {/* Card Details Section */}
                <div className='p-5 space-y-4 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50'>
                    
                    {/* Room Type & Rating */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse'></div>
                            <span className='text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                                {room.roomType}
                            </span>
                        </div>
                        <div className='flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full shadow-md'>
                            <img src={assets.starIconFilled} alt="star-icon" className='w-4 h-4' /> 
                            <span className='text-sm font-bold text-white'>4.5</span>
                        </div>
                    </div>

                    {/* Amenities Preview */}
                    {room.amenities && room.amenities.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                                <span 
                                    key={idx} 
                                    className='text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full font-medium border border-blue-200 dark:border-blue-800'
                                >
                                    {amenity}
                                </span>
                            ))}
                            {room.amenities.length > 3 && (
                                <span className='text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium'>
                                    +{room.amenities.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Divider with gradient */}
                    <div className='h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent'></div>

                    {/* Price & Book Button */}
                    <div className="flex items-end justify-between gap-3">
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>Starting from</span>
                            <div className='flex items-baseline gap-1'>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                                    ${room.pricePerNight || room.pricePerNignt || 0}
                                </span>
                                <span className='text-sm text-gray-500 dark:text-gray-400'>/night</span>
                            </div>
                        </div>
                        
                        <button className="relative px-6 py-3 font-bold text-white rounded-xl overflow-hidden group/btn transition-all duration-300 hover:scale-105 hover:shadow-xl shrink-0">
                            {/* Animated gradient background */}
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-[length:200%_200%] animate-[gradientMove_3s_ease_infinite]"></span>
                            
                            {/* Shine effect */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                            
                            {/* Button text */}
                            <span className="relative flex items-center gap-2 text-sm whitespace-nowrap">
                                Book Now
                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard