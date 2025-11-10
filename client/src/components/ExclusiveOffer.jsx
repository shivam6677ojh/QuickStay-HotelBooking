import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'
import useInView from '../hooks/useInView'

const ExclusiveOffer = () => {
    const { ref, inView } = useInView({ threshold: 0.2 });
    return (
        <div ref={ref} className='relative flex flex-col items-center px-6 md:px-16 lg:px-24 xl-px-32 pt-16 md:pt-20 pb-20 overflow-hidden'>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-violet-900/20"></div>
            
            {/* Animated gradient orbs */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className='relative z-10 w-full'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4'>
                <Title align='left' title='Exclusive Offers' subTitle='Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.' />

                <button className='relative overflow-hidden group flex items-center justify-between gap-2 font-medium cursor-pointer max-md:mt-2 text-brand'>View All offers
                    <img src={assets.arrowIcon} alt="arrow-icon" className='group-hover:translate-x-2 transition-all ' />
                    <span className='pointer-events-none absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 animate-shimmer rounded-md'></span>
                </button>

                
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 md:mt-12 w-full'>
                {exclusiveOffers.map((item, idx) => {

                    return (<div key={item._id} className={`group relative min-h-72 flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center overflow-hidden ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-4'}`}
                        style = {{ backgroundImage: `url(${item.image})`, animationDelay: `${idx * 120}ms` }}>
                            {/* overlay */}
                            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                            <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-700 font-medium rounded-full'>{item.priceOff}% OFF</p>
                            
                            <div className='relative'>
                                <p className='font-medium text-2xl md:text-4xl leading-tight'>{item.title}</p>
                                <p className='mt-1 text-sm md:text-base'>{item.description}</p>
                                <p className='text-xs text-white/70 mt-3'>Expires {item.expiryDate}</p>
                            </div>
                            <button className='relative overflow-hidden flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5 py-2 px-3 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur group/btn'>
                                View Offers
                                <img src={assets.arrowIcon} alt="arrow-icon" className='invert group-hover:translate-x-2 transition-all ' />
                                <span className='pointer-events-none absolute inset-0 bg-shimmer opacity-0 group-hover/btn:opacity-100 animate-shimmer rounded-md'></span>
                            </button>
                    </div>)
                })}
            </div>
            </div>
        </div>
    )
}

export default ExclusiveOffer