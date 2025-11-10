import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Hero = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.destination) {
            toast.error('Please select a destination');
            return;
        }
        
        if (formData.checkIn && formData.checkOut) {
            const checkIn = new Date(formData.checkIn);
            const checkOut = new Date(formData.checkOut);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkIn < today) {
                toast.error('Check-in date cannot be in the past');
                return;
            }
            
            if (checkOut <= checkIn) {
                toast.error('Check-out date must be after check-in date');
                return;
            }
        }
        
        // Build query params
        const params = new URLSearchParams();
        if (formData.destination) params.append('destination', formData.destination);
        if (formData.checkIn) params.append('checkIn', formData.checkIn);
        if (formData.checkOut) params.append('checkOut', formData.checkOut);
        if (formData.guests) params.append('guests', formData.guests);
        
        // Navigate to rooms page with query params
        navigate(`/rooms?${params.toString()}`);
        scrollTo(0, 0);
    };

    return (
        <div className='relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-cover bg-center bg-no-repeat bg-fixed min-h-[70vh] md:min-h-[100vh] overflow-hidden'>
            {/* Enhanced gradient overlay with indigo/violet tones */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-indigo-900/30 to-transparent" />
            
            {/* Animated gradient orbs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            <p className='relative px-4 py-2 rounded-full mt-24 md:mt-20 backdrop-blur-sm animate-float shadow-lg bg-gradient-to-r from-indigo-500/80 via-violet-500/80 to-pink-500/80'>
                <span className='font-semibold'>✨ The Ultimate Hotel Experience</span>
            </p>

            <h1 className='relative font-playfair text-3xl sm:text-4xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-2xl mt-4 animate-fade-up [text-shadow:0_4px_24px_rgba(0,0,0,0.35)]'>
                Discover Your Perfect Gateway Destination
            </h1>

            <p className='relative max-w-2xl mt-3 text-base md:text-lg animate-fade-in delay-150'>
                Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts.
                Start your journey today.
            </p>

            <form onSubmit={handleSubmit} className='relative bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-200 rounded-xl px-6 py-5 mt-8 w-full max-w-3xl flex flex-col md:flex-row md:items-end gap-4 md:gap-6 shadow-lg border border-white/60 dark:border-gray-700/60 backdrop-blur animate-scale-in'>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4 dark:invert' />
                    <label htmlFor="destinationInput">Destination</label>
                </div>
                <input 
                    list='destinations' 
                    id="destinationInput" 
                    name="destination"
                    type="text" 
                    className="w-full rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 mt-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-400 transition" 
                    placeholder="Type here" 
                    value={formData.destination}
                    onChange={handleChange}
                    required 
                />
                <datalist id='destinations'>
                    {cities.map((city, index) => (
                        <option key={index} value={city} />
                    ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon}  alt="" className='h-4 dark:invert' />
                    <label htmlFor="checkIn">Check in</label>
                </div>
                <input 
                    id="checkIn" 
                    name="checkIn"
                    type="date" 
                    className="w-full rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 mt-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon}  alt="" className='h-4 dark:invert' />
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input 
                    id="checkOut" 
                    name="checkOut"
                    type="date" 
                    className="w-full rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 mt-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-400 transition"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input 
                    min={1} 
                    max={10} 
                    id="guests" 
                    name="guests"
                    type="number" 
                    className="rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 mt-1.5 text-sm outline-none w-full md:max-w-16 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-400 transition" 
                    placeholder="1"
                    value={formData.guests}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className='relative overflow-hidden flex items-center justify-center gap-2 rounded-lg btn-brand py-3 px-5 my-auto cursor-pointer w-full md:w-auto transition-colors group'>
               <img src={assets.searchIcon}  alt="searchIcon" className='h-7' />
                <span>Search</span>
                {/* glossy shimmer on hover */}
                <span className='pointer-events-none absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 animate-shimmer rounded-lg'></span>
            </button>
        </form>

        </div>


    )
}

export default Hero
