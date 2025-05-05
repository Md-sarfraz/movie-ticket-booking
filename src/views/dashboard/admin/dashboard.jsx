import React, { useState } from 'react';
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  FaUsers,
  FaFilm,
  FaTicketAlt,
  FaChartBar,
  FaCog,
  FaCalendarAlt,
  FaBell,
  FaSearch,
  FaTheaterMasks,
  FaDollarSign,
  FaListAlt,
  FaClock
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('weekly');
  const navigate = useNavigate();

  // Mock data for charts
  const revenueData = { daily: 2150, weekly: 12500, monthly: 45000 };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Bar */}
      {/* <div className="bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button className="p-2 relative">
            <FaBell className="text-gray-600 text-xl" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center space-x-2">
            <img 
              src="/api/placeholder/40/40"
              alt="Admin"
              className="rounded-full h-8 w-8 border-2 border-gray-200"
            />
            <span className="font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome back, Admin!</h2>
          <p className="text-gray-600">Here's what's happening with your theater today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">1,254</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaUsers className="text-xl text-red-600" />
              </div>
            </div>

          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Movies</p>
                <h3 className="text-2xl font-bold text-gray-800">48</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaFilm className="text-xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Theaters</p>
                <h3 className="text-2xl font-bold text-gray-800">12</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaMapMarkerAlt className="text-xl text-purple-600" />
              </div>
            </div>
          </div>


          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <h3 className="text-2xl font-bold text-gray-800">20</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaCalendarAlt className="text-xl text-green-600" />
              </div>
            </div>
          </div>


          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Booking</p>
                <h3 className="text-2xl font-bold text-gray-800">328</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaTicketAlt className="text-xl text-green-600" />
              </div>
            </div>

          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">$12,450</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaDollarSign className="text-xl text-purple-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">+8%</span>
              <span className="text-gray-500 ml-2">from last week</span>
            </div>
          </div>
        </div>

        {/* Financial Overview & Upcoming Shows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${dateRange === 'daily' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setDateRange('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${dateRange === 'weekly' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setDateRange('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${dateRange === 'monthly' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setDateRange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <FaChartBar className="mx-auto text-4xl text-gray-300 mb-2" />
                <p className="text-gray-500">Revenue Chart: ${revenueData[dateRange]}</p>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Tickets</p>
                <p className="text-lg font-medium text-gray-800">62%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Concessions</p>
                <p className="text-lg font-medium text-gray-800">28%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Other</p>
                <p className="text-lg font-medium text-gray-800">10%</p>
              </div>
            </div>
          </div>

          {/* Upcoming Shows */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Shows</h3>
              <button className="text-sm text-red-500 hover:text-red-600">View All</button>
            </div>

            {/* Show List */}
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-md flex items-center justify-center mr-4">
                  <FaTheaterMasks className="text-red-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Dune: Part Two</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-1" /> 7:30 PM
                    <span className="mx-2">•</span>
                    <span>Hall 1</span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">80% Full</span>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                  <FaTheaterMasks className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Joker: Folie à Deux</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-1" /> 8:00 PM
                    <span className="mx-2">•</span>
                    <span>Hall 2</span>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">45% Full</span>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center mr-4">
                  <FaTheaterMasks className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">The Batman 2</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-1" /> 9:15 PM
                    <span className="mx-2">•</span>
                    <span>Hall 3</span>
                  </div>
                </div>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">90% Full</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-red-500 hover:text-red-600">View All</button>
            </div>

            <div className="divide-y">
              <div className="py-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <FaUsers className="text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">New user registered <span className="font-medium">John Doe</span></p>
                  <p className="text-sm text-gray-500">10 minutes ago</p>
                </div>
              </div>

              <div className="py-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FaTicketAlt className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">Ticket sale completed for <span className="font-medium">Dune: Part Two</span></p>
                  <p className="text-sm text-gray-500">25 minutes ago</p>
                </div>
              </div>

              <div className="py-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <FaFilm className="text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">New movie added <span className="font-medium">Deadpool & Wolverine</span></p>
                  <p className="text-sm text-gray-500">1 hour ago</p>
                </div>
              </div>

              <div className="py-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <FaCog className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">System maintenance completed</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg flex flex-col items-center transition-colors">
                <FaFilm className="text-red-500 text-xl mb-2" />
                <span className="text-sm text-gray-800">Add Movie</span>
              </button>

              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center transition-colors">
                <FaCalendarAlt className="text-blue-500 text-xl mb-2" />
                <span className="text-sm text-gray-800">Schedule</span>
              </button>

              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center transition-colors">
                <FaUsers className="text-green-500 text-xl mb-2" />
                <span className="text-sm text-gray-800">Users</span>
              </button>

              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center transition-colors">
                <FaListAlt className="text-purple-500 text-xl mb-2" />
                <span className="text-sm text-gray-800">Reports</span>
              </button>
            </div>

            {/* System Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">System Status</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Database</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Payment System</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Booking API</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Online</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;