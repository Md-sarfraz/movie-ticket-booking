import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../../components/adminSidebar'
import { Route, Routes } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Dashboard from '../admin/dashboard'
import MovieList from '../admin/movieList'
import TheaterList from '../admin/theaterLIst'
import UserProfile from '../user/userProfile'
import UserList from './userList'
import AddShowForm from '../../../components/addShowForm'
import AddMoviePage from './addMoviePage'
import EditMoviePage from './editMoviePage'
import AddTheaterPage from './addTheaterPage'
import ManageBookings from './manageBookings'
import Reports from './reports'
import AdminProfile from './adminProfile'
import EventList from './eventList'
import AddEventPage from './addEventPage'
import EditEventPage from './editEventPage'


const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className='flex min-h-screen bg-gray-100 pt-16 sm:pt-20'>
            <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="md:hidden fixed top-[5.4rem] left-3 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 text-gray-700"
                aria-label="Toggle admin menu"
            >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close admin menu"
                />
            )}

            <div
                className={`fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw] transform bg-white pt-16 shadow-xl transition-transform duration-300 md:static md:z-auto md:h-auto md:w-64 md:max-w-none md:translate-x-0 md:bg-transparent md:pt-0 md:shadow-none ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
                <Routes>
                    <Route path='/' element={<Dashboard/>}/>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/movieList' element={<MovieList/>}/>
                    <Route path='/eventList' element={<EventList/>}/>
                    <Route path='/addEvent' element={<AddEventPage/>}/>
                    <Route path='/editEvent/:eventId' element={<EditEventPage/>}/>
                    <Route path='/addMovie' element={<AddMoviePage/>}/>
                    <Route path='/editMovie/:movieId' element={<EditMoviePage/>}/>
                    <Route path='/userList' element={<UserList/>}/>
                    <Route path='/theaterList' element={<TheaterList/>}/>
                    <Route path='/addTheater' element={<AddTheaterPage/>}/>
                    <Route path='/showList' element={<AddShowForm/>}/>
                    <Route path='/bookings' element={<ManageBookings/>}/>
                    <Route path='/reports' element={<Reports/>}/>
                    <Route path='/profile' element={<AdminProfile/>}/>
                    <Route path='/userProfile' element={<UserProfile/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default DashboardLayout