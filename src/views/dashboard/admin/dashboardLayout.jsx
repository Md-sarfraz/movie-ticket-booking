import React from 'react'
import AdminSidebar from '../../../components/adminSidebar'
import { Route, Routes } from 'react-router-dom'
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


const DashboardLayout = () => {
    return (
        <div className='flex h-screen bg-gray-100 pt-20'>
            <div className="w-60">
                <AdminSidebar />
            </div>
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path='/' element={<Dashboard/>}/>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/movieList' element={<MovieList/>}/>
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