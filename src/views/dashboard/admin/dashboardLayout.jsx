import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../../components/adminSidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
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
import BackButton from '../../../components/BackButton'


const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            return undefined;
        }

        document.body.style.overflow = sidebarOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    return (
        <div className='relative mt-16 h-[calc(100vh-4rem)] overflow-hidden bg-gray-100 md:mt-20 md:h-[calc(100vh-5rem)]'>
            <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="fixed left-3 top-[4.5rem] z-50 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-md md:hidden"
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
                className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-[260px] max-w-[85vw] transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out md:top-20 md:h-[calc(100vh-5rem)] md:max-w-none md:translate-x-0 md:shadow-none ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>

            <main className="h-full min-w-0 overflow-y-auto overflow-x-hidden md:ml-[260px]">
                <div className="min-h-full">
                    <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
                        <BackButton className="bg-white" />
                    </div>
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
                        <Route path='/settings' element={<AdminProfile/>}/>
                        <Route path='/userProfile' element={<UserProfile/>}/>
                    </Routes>
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout