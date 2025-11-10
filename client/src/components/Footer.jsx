import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
    <div className='bg-gradient-to-b from-[#F6F9FC] dark:from-gray-900 to-white dark:to-gray-950 text-gray-500/80 dark:text-gray-400 pt-10 px-6 md:px-16 lg:px-24 xl:px-32 bottom-0 w-full animate-fade-in'>
            <div className='flex flex-wrap justify-between gap-10 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert dark:invert-0 transition-transform hover:scale-105 cursor-pointer' />
                    <p className='text-sm'>
                        Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
                    </p>
                    <div className='flex items-center gap-4 mt-4'>
                        
                        <img src={assets.instagramIcon} alt="instagramIcon" className='w-6 cursor-pointer hover:scale-110 transition-transform dark:invert' />
                        <img src={assets.facebookIcon} alt="facebookIcon" className='w-6 cursor-pointer hover:scale-110 transition-transform dark:invert' />
                        <img src={assets.twitterIcon} alt="twitterIcon" className='w-6 cursor-pointer hover:scale-110 transition-transform dark:invert' />
                        <img src={assets.linkendinIcon} alt="linkdinIcon" className='w-6 cursor-pointer hover:scale-110 transition-transform dark:invert' />
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-700 dark:text-gray-300'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-700 dark:text-gray-300'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80 w-full sm:w-auto'>
                    <p className='font-playfair text-lg text-gray-700 dark:text-gray-300'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Subscribe to our newsletter for inspiration and special offers.
                    </p>
                    <div className='flex items-center mt-4 w-full max-w-sm'>
                        <input 
                            type="email" 
                            className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-l border border-gray-300 dark:border-gray-600 h-11 px-3 outline-none flex-1 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400' 
                            placeholder='Your email' 
                        />
                        <button className='relative overflow-hidden flex items-center justify-center bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 h-11 w-11 aspect-square rounded-r group transition-colors border border-gray-300 dark:border-gray-600 border-l-0 cursor-pointer'>
                            {/* Arrow icon */}
                            <img src={assets.arrowIcon} alt="arrow-icon" className='invert w-3.5 group-hover:translate-x-1 transition-transform' />
                            <span className='pointer-events-none absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 animate-shimmer'></span>
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-800 dark:border-gray-700 mt-12' />
            <div className='flex flex-col md:flex-row gap-3 items-center text-gray-700 dark:text-gray-400 justify-between py-6'>
                <p>© {new Date().getFullYear()} QuickStay. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer