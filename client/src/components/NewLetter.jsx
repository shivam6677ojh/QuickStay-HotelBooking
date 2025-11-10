// import React from 'react';
// import { assets } from '../assets/assets';

// // You can use an icon library like react-icons if you prefer
// // import { FiArrowRight } from 'react-icons/fi';

// const NewsLetter = () => {
//     const handleSubmit = (event) => {
//         event.preventDefault();
//         // Your form submission logic here
//         alert('Thank you for subscribing!');
//     };

//     return (
//         <div className='flex justify-center items-center  mb-30 px-4 '>
//             <div className="bg-[#1a1f2e] p-8 sm:p-12 rounded-3xl max-w-5xl w-full text-center shadow-2xl">
//                 {/* Heading */}
//                 <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white mb-4">
//                     Stay Inspired
//                 </h2>

//                 {/* Description */}
//                 <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
//                     Join our newsletter and be the first to discover new destinations,
//                     exclusive offers, and travel inspiration.
//                 </p>

//                 {/* Form */}
//                 <form
//                     onSubmit={handleSubmit}
//                     className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto mb-4"
//                 >
//                     <input
//                         type="email"
//                         placeholder="Enter your email"
//                         aria-label="Email Address"
//                         required
//                         className="bg-white text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-0 w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
//                     />
//                     <button
//                         type="submit"
//                         className="bg-black text-white font-semibold px-6 py-3 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1f2e] focus:ring-white transition-colors group"
//                     >
//                         Subscribe
//                         {/* Using an HTML entity for the arrow */}
//                         <img src={assets.arrowIcon} alt="arrow-icon" className='invert group-hover:translate-x-2 transition-all ' />
//                         {/* Or use an icon: <FiArrowRight size={20} /> */}
//                     </button>
//                 </form>

//                 {/* Privacy Note */}
//                 <p className="text-xm text-gray-500">
//                     By subscribing, you agree to our Privacy Policy and consent to receive
//                     updates.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default NewsLetter;
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const NewsLetter = () => {
    const mountRef = useRef(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Effect for the three.js background animation
    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Particle Geometry
        const particleCount = 5000;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 500;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Particle Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.8, // Increased size to make particles more visible
            color: 0xffffff,
            transparent: true,
            opacity: 1.0, // Make them fully opaque
            blending: THREE.AdditiveBlending, // This makes particles glow and appear brighter
        });

        const starField = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(starField);

        // Mouse tracking for interaction
        const mouse = new THREE.Vector2();
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // --- Particle Movement ---
            // This creates the "flying through space" effect
            const positions = starField.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                let i3 = i * 3;
                
                // Move particle forward on the z-axis
                positions[i3 + 2] += 0.4; // Adjust speed here

                // If a particle passes the camera, reset its position to the back
                if (positions[i3 + 2] > camera.position.z) {
                    positions[i3 + 2] = -500; // Reset z
                    positions[i3] = (Math.random() - 0.5) * 500; // Reset x
                    positions[i3 + 1] = (Math.random() - 0.5) * 500; // Reset y
                }
            }
            starField.geometry.attributes.position.needsUpdate = true;

            // --- Interactive Camera Movement ---
            camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
            camera.position.y += (mouse.y * 5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);


            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isAnimating) return;

        setIsSubscribed(true);
        setIsAnimating(true);

        setTimeout(() => {
            setIsSubscribed(false);
            setIsAnimating(false);
        }, 4000);
    };

    return (
        <div className='relative flex justify-center items-center p-4 overflow-hidden'>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 dark:from-gray-900 dark:via-indigo-900/30 dark:to-violet-900/30"></div>
            
            {/* Animated gradient orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
                {/* Three.js canvas container */}
                <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />

                {/* Content Overlay with gradient */}
                <div className="relative z-10 bg-gradient-to-br from-indigo-500/90 via-violet-600/90 to-pink-600/90 backdrop-blur-md p-8 sm:p-12 text-center border border-white/20">
                    {/* Heading */}
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Stay Inspired ✨
                    </h2>

                    {/* Description */}
                    <p className="text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed text-lg">
                        Join our newsletter and be the first to discover new destinations,
                        exclusive offers, and travel inspiration.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto mb-4"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            aria-label="Email Address"
                            required
                            className="bg-white/95 text-gray-800 placeholder-gray-500 px-5 py-3.5 rounded-xl border-0 w-full flex-grow focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300 shadow-lg"
                        />
                        <button
                            type="submit"
                            className="bg-white text-indigo-600 hover:text-indigo-700 font-bold px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-300 group shadow-lg hover:shadow-2xl hover:scale-105 cursor-pointer"
                        >
                            Subscribe
                            {/* Inlined SVG Arrow */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 group-hover:translate-x-1 transition-transform" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>
                    
                    {/* Subscription Message */}
                    <div className="h-8 flex items-center justify-center">
                         {isSubscribed && (
                            <p className="text-white font-semibold transition-opacity duration-500 text-lg">
                                Thank you for subscribing! 🎉
                            </p>
                        )}
                    </div>

                    {/* Privacy Note */}
                    <p className="text-xs text-white/70">
                        By subscribing, you agree to our Privacy Policy and consent to receive updates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewsLetter;

