import React from 'react'
import Dashboard from '../user/dashboard';
import UserSidebar from '@/components/userSidebar';
import UserProfile from '../user/userProfile';
import Bookings from '../user/bookings';
import { Route, Routes } from 'react-router-dom';
const userDashboardLayout = () => {
  return (
        <div className='flex min-h-screen bg-gray-100 pt-28 md:pt-16 lg:pt-20'>
            <div className="hidden md:block md:w-64">
                <UserSidebar />
            </div>

            <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
                <Routes>
                    <Route path='/' element={<Dashboard/>}/>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/bookings' element={<Bookings/>}/>
                    <Route path='/myTickets' element={<Bookings/>}/>
                    <Route path='/userProfile' element={<UserProfile/>}/>
                    <Route path='/settings' element={<UserProfile/>}/>
                </Routes>
            </div>
        </div>
  )
}

export default userDashboardLayout
