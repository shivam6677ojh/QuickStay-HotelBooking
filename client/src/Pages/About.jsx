import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
    const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [storyRef, storyInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const values = [
        {
            icon: "🎯",
            title: "Guest-Centric",
            description: "Every decision we make is centered around enhancing your travel experience and comfort."
        },
        {
            icon: "✨",
            title: "Quality First",
            description: "We carefully curate our hotel partners to ensure every stay meets our high standards."
        },
        {
            icon: "🤝",
            title: "Trust & Transparency",
            description: "No hidden fees, no surprises. Just honest pricing and clear communication."
        },
        {
            icon: "🌍",
            title: "Global Reach",
            description: "From bustling cities to serene getaways, we bring the world's best stays to your fingertips."
        },
        {
            icon: "💡",
            title: "Innovation",
            description: "Constantly evolving with technology to make booking faster, easier, and smarter."
        },
        {
            icon: "🛡️",
            title: "Security",
            description: "Your data and payment information are protected with industry-leading security measures."
        }
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "Chief Executive Officer",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Leading QuickStay's vision with 15+ years in hospitality technology."
        },
        {
            name: "Michael Chen",
            role: "Chief Technology Officer",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Building innovative solutions that revolutionize hotel booking experiences."
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Customer Experience",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            bio: "Ensuring every guest interaction exceeds expectations and creates lasting memories."
        },
        {
            name: "David Kumar",
            role: "Director of Operations",
            image: "https://randomuser.me/api/portraits/men/52.jpg",
            bio: "Streamlining processes to deliver seamless booking experiences worldwide."
        }
    ];

    const stats = [
        { number: "500K+", label: "Happy Travelers" },
        { number: "10K+", label: "Partner Hotels" },
        { number: "150+", label: "Countries" },
        { number: "98%", label: "Satisfaction Rate" }
    ];

    return (
        <div className="relative bg-gradient-to-br from-purple-100 via-violet-100 to-fuchsia-100 dark:from-gray-900 dark:via-purple-900/10 dark:to-violet-900/10 min-h-screen overflow-hidden">
            {/* Decorative background orbs - More vibrant */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400/35 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-violet-400/35 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-400/20 dark:bg-fuchsia-600/5 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '2s' }}></div>

            {/* Hero Section */}
            <div 
                ref={heroRef}
                className={`relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white py-20 md:py-32 transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Animated Background Orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-up drop-shadow-lg">
                            About QuickStay
                        </h1>
                        <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto animate-fade-up animation-delay-200 font-light leading-relaxed drop-shadow-md">
                            Connecting travelers with exceptional accommodations since 2020
                        </p>
                        <div className="mt-8 flex justify-center gap-4 animate-fade-up animation-delay-400">
                            <button
                                onClick={() => navigate('/rooms')}
                                className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl cursor-pointer text-lg"
                            >
                                🏨 Browse Hotels
                            </button>
                            <button
                                onClick={() => navigate('/contactHere')}
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-purple-600 transition-all cursor-pointer text-lg shadow-lg"
                            >
                                📧 Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div 
                ref={storyRef}
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${storyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-700 via-violet-700 to-fuchsia-700 dark:from-purple-300 dark:via-violet-300 dark:to-fuchsia-300 bg-clip-text text-transparent mb-6">
                            Our Story
                        </h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-light">
                            <p className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100 dark:border-purple-900">
                                QuickStay was born from a simple idea: travel accommodation booking should be 
                                effortless, transparent, and delightful. In 2020, our founders—seasoned travelers 
                                and tech enthusiasts—came together with a shared frustration about the complexity 
                                of finding and booking the perfect place to stay.
                            </p>
                            <p className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-violet-100 dark:border-violet-900">
                                What started as a small platform with just 50 partner hotels has blossomed into 
                                a global network spanning over 150 countries. Today, we're proud to serve more 
                                than half a million travelers annually, helping them discover everything from 
                                boutique city hotels to luxurious beachfront resorts.
                            </p>
                            <p className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-fuchsia-100 dark:border-fuchsia-900">
                                Our mission remains unchanged: to empower travelers with choices, confidence, 
                                and unforgettable experiences. Every feature we build, every partner we onboard, 
                                and every customer interaction is designed with your journey in mind.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                            <img 
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" 
                                alt="Luxury Hotel"
                                className="w-full h-[500px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div 
                ref={statsRef}
                className={`bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 py-20 transition-all duration-1000 ${statsInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20"
                            >
                                <div className="text-5xl md:text-7xl font-bold text-white mb-3 font-playfair drop-shadow-lg">
                                    {stat.number}
                                </div>
                                <div className="text-white/90 text-lg font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Values Section */}
            <div 
                ref={valuesRef}
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
                        Our Core Values
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        The principles that guide everything we do
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <div 
                            key={index}
                            className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer hover:-translate-y-2"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meet Our Team Section */}
            <div 
                ref={teamRef}
                className={`bg-gradient-to-br from-indigo-50/50 via-violet-50/30 to-pink-50/50 dark:from-indigo-950/20 dark:via-violet-950/10 dark:to-pink-950/20 py-20 transition-all duration-1000 ${teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
                            Meet Our Leadership
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Passionate experts dedicated to transforming your travel experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div 
                                key={index}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                            >
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
                            Why Choose QuickStay?
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                            We combine cutting-edge technology with personalized service to deliver 
                            unmatched booking experiences. From instant confirmations to 24/7 support, 
                            we're with you every step of your journey.
                        </p>
                        <button
                            onClick={() => navigate('/rooms')}
                            className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-3xl cursor-pointer"
                        >
                            Start Your Journey Today
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
