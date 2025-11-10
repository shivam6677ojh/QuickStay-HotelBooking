import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/HotelOwner/SideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='flex flex-col h-screen'>
            {/* Fixed Navbar */}
            <Navbar className="fixed top-0 left-0 w-full z-50" />

            {/* Main content below navbar */}
            <div className='flex flex-1 pt-16'> {/* 👈 Add pt-16 to offset header height */}
                <Sidebar />
                <div className='flex-1 p-4 md:px-10 pb-20 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
