import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import useInView from '../hooks/useInView'
import { roomService } from '../api/services'

const FeaturedDestination = () => {

    const navigate = useNavigate();
    const { ref, inView } = useInView({ threshold: 0.2 });
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedRooms = async () => {
            try {
                const response = await roomService.getRooms({ limit: 4 });
                setRooms(response.rooms || []);
            } catch (error) {
                console.error('Error fetching featured rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedRooms();
    }, []);

    return (
        <div ref={ref} className='relative flex flex-col items-center px-6 md:px-16 lg:px-24 py-16 transition-colors duration-300 overflow-hidden'>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-violet-900/20"></div>
            
            {/* Animated gradient orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 w-full">
                <Title title={"Featured Destinations"} subTitle={"Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."} align="center" />

            {loading ? (
                <div className='mt-12 text-center'>
                    <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
                    <p className='mt-4 text-gray-500 dark:text-gray-400'>Loading featured rooms...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className='mt-12 text-center text-gray-500 dark:text-gray-400'>No featured rooms available at the moment.</div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12 w-full'>
                    {rooms.slice(0, 4).map((room, index) => (
                        <div
                            key={room._id || index}
                            className={`${inView ? 'animate-fade-up' : 'opacity-0 translate-y-4'} cursor-pointer`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <HotelCard room={room} index={index} />
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => {navigate('/rooms'); scrollTo(0,0)}}
                className="relative overflow-hidden my-16 px-8 py-3.5 text-base font-bold rounded-xl transition-all duration-300 cursor-pointer group text-white shadow-lg hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105"
            >
                {/* Animated gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-[length:200%_200%] animate-[gradientMove_3s_ease_infinite]"></span>
                
                {/* Shine effect */}
                <span className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></span>
                
                <span className='relative z-10 flex items-center gap-2'>
                    View All Destinations
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </button>
            </div>
        </div>
    )
}

export default FeaturedDestination