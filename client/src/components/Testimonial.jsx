import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'
import useInView from '../hooks/useInView'

const Testimonial = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });
  return (
    <div ref={ref} className='relative flex flex-col items-center px-6 md:px-16 lg:px-24 pt-16 md:pt-20 pb-20 overflow-hidden'>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-violet-900/20"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="relative z-10 w-full">
      <Title title={"What Our Guests Say"} subTitle={"Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."} align="center" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 md:mt-12 w-full">
        {testimonials.map((testimonial, idx) => (
          <div
            key={testimonial.id}
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-200/30 dark:border-indigo-800/30 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-900/40 hover:border-indigo-400/50 dark:hover:border-indigo-600/50 transform hover:-translate-y-1 transition duration-300 ease-in-out ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-4'}`}
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            <div className="flex items-center gap-3">
              <img className="w-12 h-12 rounded-full ring-2 ring-purple-500/50" src={testimonial.image} alt={testimonial.name} />
              <div>
                <p className="font-playfair text-xl text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                <p className="text-gray-500 dark:text-gray-400">{testimonial.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <StarRating />
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-90 mt-4">"{testimonial.review}"</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}



export default Testimonial