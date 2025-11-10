import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
)

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/about' },
    ];



    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { openSignIn } = useClerk();
    const { user } = useUser();
    const  navigate  = useNavigate();
    const  location  = useLocation();


    useEffect(() => {
        if(location.pathname !== '/'){
            setIsScrolled(true);
            return ;
        }
        else{
            setIsScrolled(false);
        }

        setIsScrolled(prev => location.pathname !== '/' ? true : prev);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (

        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/90 dark:bg-gray-900/90 shadow-lg shadow-indigo-500/10 text-gray-900 dark:text-gray-100 backdrop-blur-lg py-3 md:py-4 border-b border-indigo-500/10" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to='/' className="relative group">
                <img src={assets.logo} alt="QuickStay logo" className={`h-9 transition-transform duration-300 group-hover:scale-105 ${isScrolled ? "invert dark:invert-0 opacity-90" : "dark:invert"}`} />
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 group-hover:w-full transition-all"></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} className={`group flex flex-col gap-0.5 font-medium ${isScrolled ? "text-gray-900 dark:text-gray-100" : "text-black dark:text-white"}`}>
                        {link.name}
                        <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500`} />
                    </Link>
                ))}
                
                {/* Show Dashboard button only for admin users */}
                {user && (user?.publicMetadata?.role === 'admin' || user?.unsafeMetadata?.role === 'admin' || user?.publicMetadata?.role === 'owner' || user?.unsafeMetadata?.role === 'owner') && (
                    <button 
                        className={`relative border-2 px-5 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 hover:scale-105 group ${isScrolled ? 'text-indigo-600 dark:text-indigo-400 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : 'text-indigo-600 dark:text-indigo-400 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`} 
                        onClick={() => navigate('/owner')}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admin Dashboard
                        </span>
                        {/* Admin badge indicator */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <img src={assets.searchIcon} alt="search" className={`${isScrolled && 'invert dark:invert-0'} ${!isScrolled && 'dark:invert'} h-7 transition-all duration-500 hover:scale-110 cursor-pointer`} />

                {user ? (<UserButton >
                    <UserButton.MenuItems>
                        <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => {
                            navigate('/my-bookings')
                        }}></UserButton.Action>
                    </UserButton.MenuItems>
                </UserButton>)
                    :
                    (<button onClick={openSignIn} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black dark:bg-white dark:text-black" : "bg-white dark:bg-gray-900 text-black dark:text-white"} hover:scale-105 cursor-pointer`}>
                        Login
                    </button>)
                }

            </div>

            {/* Mobile Menu Button */}
            

            <div className="flex items-center gap-3 md:hidden">
                {user && <UserButton >
                <UserButton.MenuItems>
                    <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => {
                        navigate('/my-bookings')
                    }}></UserButton.Action>
                </UserButton.MenuItems>
            </UserButton>
            }



                <button aria-label="Open menu" aria-controls="mobile-menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 cursor-pointer">
                    <img src={assets.menuIcon} alt="menu" className={`${isScrolled && "invert dark:invert-0"} ${!isScrolled && 'dark:invert'} h-4 `} />
                </button>
            </div>

            {/* Mobile Menu */}


            <div id="mobile-menu" className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-gray-900 text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 dark:text-gray-100 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className="h-6.5 dark:invert" />
                </button>

                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="hover:scale-105 transition-transform cursor-pointer">
                        {link.name}
                    </Link>
                ))}

                {user && <button onClick={() => {
                    navigate('/owner')
                }} className="border border-gray-300 dark:border-gray-600 px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800">
                    Dashboard
                </button>}


                {!user && <button onClick={openSignIn} className="bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full transition-all duration-500 hover:scale-105 cursor-pointer">
                    Login
                </button>}
            </div>
        </nav>
    );
}

export default Navbar