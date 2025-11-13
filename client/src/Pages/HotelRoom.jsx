import React, { useState, useEffect } from 'react'
import { assets, facilityIcons } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StarRating from '../components/StarRating';
import useInView from '../hooks/useInView'
import { roomService } from '../api/services';
import { toast } from 'react-toastify';
import HotelCard from '../components/HotelCard';

const CheckBox = ({label, selected = false, onChange = () => { }}) => {
    return (
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm text-gray-700 dark:text-gray-300'>
            <input 
                type="checkbox" 
                checked={selected} 
                onChange={(e) => onChange(e.target.checked, label)}
                className='w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2'
            />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({label, selected = false, onChange = () => { }}) => {
    return (
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm text-gray-700 dark:text-gray-300'>
            <input 
                type="radio" 
                name="sortOption" 
                checked={selected} 
                onChange={() => onChange(label)}
                className='w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2'
            />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const HotelRoom = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [openFilters, setopenFilters] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        destination: searchParams.get('destination') || '',
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        guests: searchParams.get('guests') || '',
        roomTypes: [],
        priceRange: '',
        sortBy: ''
    });

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Bed",
        "Family Suite",
    ]

    const priceRange = [
        "0 to 500",
        '500 to 1000',
        '1000 to 2000',
        '2000 to 3000',
    ]

    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First"
    ]

    // Fetch rooms
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const queryFilters = { ...filters };
                
                // Parse price range
                if (filters.priceRange) {
                    const [min, max] = filters.priceRange.split(' to ');
                    queryFilters.minPrice = min;
                    queryFilters.maxPrice = max;
                    delete queryFilters.priceRange;
                }
                
                // Convert sort option to API format
                if (filters.sortBy === 'Price Low to High') {
                    queryFilters.sortBy = 'price_asc';
                } else if (filters.sortBy === 'Price High to Low') {
                    queryFilters.sortBy = 'price_desc';
                } else if (filters.sortBy === 'Newest First') {
                    queryFilters.sortBy = 'newest';
                }
                
                console.log('Sending filters to API:', queryFilters);
                const response = await roomService.getRooms(queryFilters);
                console.log('Received rooms:', response.rooms?.length || 0, 'rooms');
                setRooms(response.rooms || []);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                toast.error('Failed to fetch rooms');
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [filters]);

    const handleRoomTypeChange = (checked, label) => {
        setFilters(prev => ({
            ...prev,
            roomTypes: checked 
                ? [...prev.roomTypes, label]
                : prev.roomTypes.filter(type => type !== label)
        }));
    };

    const handlePriceRangeChange = (checked, label) => {
        setFilters(prev => ({
            ...prev,
            priceRange: checked ? label : ''
        }));
    };

    const handleSortChange = (label) => {
        setFilters(prev => ({
            ...prev,
            sortBy: label
        }));
    };

    const clearFilters = () => {
        setFilters({
            destination: '',
            checkIn: '',
            checkOut: '',
            guests: '',
            roomTypes: [],
            priceRange: '',
            sortBy: ''
        });
    };

    const { ref, inView } = useInView({ threshold: 0.1 });
    return (
        <div ref={ref} className='relative flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen overflow-hidden'>
            {/* Gradient Background - Enhanced vibrant colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 -z-10"></div>
            
            {/* Animated gradient orbs - More visible */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-pink-400/35 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/35 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '2s' }}></div>


            {/* Left section: Rooms */}
            <div className="flex-1 relative z-10">
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px] text-gray-900 dark:text-gray-100'>Hotel Rooms</h1>
                    <p className='text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-174'>
                        {filters.destination ? `Showing results for ${filters.destination}` : 'Discover amazing hotel rooms for your perfect stay'}
                    </p>
                    {loading && (
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>Loading rooms...</p>
                    )}
                    {!loading && rooms.length === 0 && (
                        <p className='text-sm text-gray-700 dark:text-gray-300 mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
                            No rooms found matching your criteria. Try adjusting your filters.
                        </p>
                    )}
                </div>

                {!loading && rooms.length > 0 && rooms.map((room, idx) => (
                    <div
                        key={room._id}
                        className={`flex mr-2 flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 dark:border-gray-700 last:pb-30 last:border-0 mb-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-xl px-4 transition-all duration-300 ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-4'}`}
                        style={{ animationDelay: `${idx * 80}ms` }}
                    >
                        <div className='relative md:w-1/2 rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300'>
                            <img
                                onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                                src={room.images[0]}
                                alt="hotel-img"
                                title='View Room Details'
                                className='max-h-65 w-full rounded-xl object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110'
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 bg-shimmer animate-shimmer'></span>
                        </div>
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider'>{room.hotel?.city || 'City'}</p>
                            <p
                                onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                                className='text-gray-800 dark:text-gray-100 text-3xl font-playfair cursor-pointer hover:text-brand dark:hover:text-blue-400 transition-colors duration-300'
                            >
                                {room.hotel?.name || 'Hotel Name'}
                            </p>
                            <div className='flex items-center gap-2'>
                                <StarRating />
                                <p className='ml-2 text-gray-600 dark:text-gray-400 text-sm'>200+ reviews</p>
                            </div>
                            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2'>
                                <img src={assets.locationIcon} alt="locationIcon" className='dark:invert w-4 h-4' />
                                <span className='text-sm'>{room.hotel?.address || 'Address'}</span>
                            </div>
                            {/* room Type */}
                            <div className='mt-2 px-4 py-1.5 rounded-full bg-brand/10 dark:bg-blue-900/30 text-brand dark:text-blue-400 inline-block w-fit text-sm font-semibold shadow-sm'>
                                {room.roomType}
                            </div>
                            {/* room Aminity */}
                            {room.amenities && room.amenities.length > 0 && (
                                <div className='flex flex-wrap items-center mt-3 mb-6 gap-3'>
                                    {room.amenities.map((item, index) => (
                                        <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm'>
                                            {facilityIcons[item] && <img src={facilityIcons[item]} alt={item} className='w-5 h-5 dark:invert' />}
                                            <p className='text-xs font-medium text-gray-700 dark:text-gray-300'>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* room price per Night */}
                            <div className='flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700'>
                                <p className='flex flex-col'>
                                    <span className='text-2xl font-bold text-gray-800 dark:text-gray-100'>${room.pricePerNignt || room.pricePerNight || 0}</span>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>per night</span>
                                </p>
                                <button 
                                    onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                                    className='px-6 py-2.5 rounded-lg btn-brand hover:brightness-110 hover:scale-105 transition-all duration-300 cursor-pointer font-semibold shadow-md hover:shadow-lg'
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right section: Filters */}
            <div className="relative w-80 max-lg:mb-8 min-lg:mt-16">
                {/* decorative glow orb */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full bg-gradient-to-br from-pink-300/30 via-purple-300/20 to-indigo-300/10 blur-3xl mix-blend-screen -z-10" />
                <div className="pointer-events-none absolute -bottom-10 -left-8 w-56 h-56 rounded-full bg-gradient-to-br from-indigo-300/20 via-violet-300/10 to-pink-300/10 blur-3xl mix-blend-screen -z-10" />

                <div className="relative bg-gradient-to-br from-white/80 to-indigo-50/40 dark:from-gray-900/70 dark:via-indigo-900/30 dark:to-violet-900/20 border border-transparent dark:border-transparent rounded-xl p-0 overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/30 to-transparent dark:from-black/20 rounded-xl" />
                    <div className="relative z-10 bg-transparent border border-transparent p-0">
                        <div className="px-5 py-4 flex items-center justify-between">
                            <p className="text-base font-medium text-gray-800 dark:text-gray-100">FILTERS</p>

                            <div className="text-xs">
                                <span
                                    onClick={() => setopenFilters(!openFilters)}
                                    className="lg:hidden dark:text-gray-300 cursor-pointer"
                                >
                                    {openFilters ? "HIDE" : "SHOW"}
                                </span>

                                <span className="hidden lg:block hover:text-indigo-600 transition dark:text-gray-300 dark:hover:text-indigo-300 cursor-pointer" onClick={clearFilters}>CLEAR</span>
                            </div>
                        </div>

                        <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                            <div className='px-5 pt-5'>
                                <p className='font-medium text-gray-800 dark:text-gray-200 pb-2 flex items-center gap-2'>
                                    <span className='inline-block w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]'></span>
                                    Popular filters
                                </p>
                                {roomTypes.map((room, index) => (
                                    <CheckBox 
                                        key={index} 
                                        label={room}
                                        selected={filters.roomTypes.includes(room)}
                                        onChange={handleRoomTypeChange}
                                    />
                                ))}
                            </div>
                            <div className='px-5 pt-5'>
                                <p className='font-medium text-gray-800 dark:text-gray-200 pb-2 flex items-center gap-2'>
                                    <span className='inline-block w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.45)]'></span>
                                    Price Range
                                </p>
                                {priceRange.map((range, index) => (
                                    <CheckBox 
                                        key={index} 
                                        label={`$${range}`}
                                        selected={filters.priceRange === range}
                                        onChange={(checked) => handlePriceRangeChange(checked, range)}
                                    />
                                ))}
                            </div>
                            <div className='px-5 pt-5 mb-6'>
                                <p className='font-medium text-gray-800 dark:text-gray-200 pb-2 flex items-center gap-2'>
                                    <span className='inline-block w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.45)]'></span>
                                    Sort By
                                </p>
                                {sortOptions.map((options, index) => (
                                    <RadioButton 
                                        key={index} 
                                        label={options}
                                        selected={filters.sortBy === options}
                                        onChange={handleSortChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelRoom
