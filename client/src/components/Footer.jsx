import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-950 text-gray-700 dark:text-gray-300 py-12 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <img src={assets.logo} alt="QuickStay" className="h-10 mb-3 invert dark:invert-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Discover extraordinary stays — curated hotels, villas and unique homes around the world.
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                            <a href="#" aria-label="Instagram" className="group">
                                <img src={assets.instagramIcon} alt="Instagram" className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </a>
                            <a href="#" aria-label="Facebook" className="group">
                                <img src={assets.facebookIcon} alt="Facebook" className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </a>
                            <a href="#" aria-label="Twitter" className="group">
                                <img src={assets.twitterIcon} alt="Twitter" className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="group">
                                <img src={assets.linkendinIcon} alt="LinkedIn" className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </a>
                        </div>
                    </div>

                    {/* Company links */}
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:underline" href="#">About</a></li>
                            <li><a className="hover:underline" href="#">Careers</a></li>
                            <li><a className="hover:underline" href="#">Partners</a></li>
                            <li><a className="hover:underline" href="#">Blog</a></li>
                        </ul>
                    </div>

                    {/* Support links */}
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:underline" href="#">Help Center</a></li>
                            <li><a className="hover:underline" href="#">Safety</a></li>
                            <li><a className="hover:underline" href="#">Cancellation</a></li>
                            <li><a className="hover:underline" href="#">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Stay updated</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Subscribe to get deals, travel inspiration and updates.</p>

                        <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()} aria-label="Subscribe to newsletter">
                            <label htmlFor="footer-email" className="sr-only">Email address</label>
                            <input id="footer-email" type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 rounded-l-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none" />
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md">Subscribe</button>
                        </form>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">We respect your privacy. Unsubscribe anytime.</p>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm">© {new Date().getFullYear()} QuickStay. All rights reserved.</p>

                    <div className="flex items-center gap-4 text-sm">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer