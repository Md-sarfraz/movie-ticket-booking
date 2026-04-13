import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { myAxios } from '../../../services/helper';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllBookings } from '../../../services/booking-service';
import { getRecentActivities } from '../../../services/activity-service';


const Dashboard = () => {
  const [dateRange, setDateRange] = useState('weekly');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State for all dynamic data
  const [revenueData, setRevenueData] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [todayData, setTodayData] = useState({
    bookings: 0,
    revenue: 0,
    shows: 0,
    seatsSold: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalTheaters: 0,
    totalEvents: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Helper function to format relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Helper function to format time as HH:MM AM/PM
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

useEffect(() => {
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard counts (now includes booking data)
      const countsResponse = await myAxios.get('/admin/dashboard');
      if (countsResponse.data.status) {
        const data = countsResponse.data.data;
        
        // Set main counts
        setCounts({
          totalUsers: data.totalUsers || 0,
          totalMovies: data.totalMovies || 0,
          totalTheaters: data.totalTheaters || 0,
          totalEvents: data.totalEvents || 0
        });

        // Set booking and revenue data from the main response
        setTotalBookings(data.totalBookings || 0);
        setTotalRevenue(data.totalRevenue || 0);
        
        // Set today's data from the main response
        setTodayData({
          bookings: data.todayBookings || 0,
          revenue: data.todayRevenue || 0,
          shows: data.todayShows || 0,
          seatsSold: data.seatsSoldToday || 0
        });
      }

      // Fetch recent bookings (limit to 10 most recent)
      const bookingsData = await getAllBookings();
      if (bookingsData) {
        // Sort by confirmedAt or createdAt, get latest 10
        const sortedBookings = [...bookingsData]
          .sort((a, b) => {
            const dateA = new Date(a.confirmedAt || a.createdAt);
            const dateB = new Date(b.confirmedAt || b.createdAt);
            return dateB - dateA;
          })
          .slice(0, 10);
        setRecentBookings(sortedBookings);
      }

      // Fetch recent activities from API
      const activitiesData = await getRecentActivities(6);
      if (activitiesData && activitiesData.length > 0) {
        // Map activity types to icons and colors
        const mappedActivities = activitiesData.map(activity => {
          let icon = FaBell;
          let color = 'blue';

          switch (activity.activityType) {
            case 'USER_REGISTERED':
              icon = FaUsers;
              color = 'green';
              break;
            case 'MOVIE_ADDED':
            case 'MOVIE_UPDATED':
              icon = FaFilm;
              color = 'purple';
              break;
            case 'SHOW_CREATED':
              icon = FaCalendarAlt;
              color = 'blue';
              break;
            case 'THEATER_ADDED':
            case 'THEATER_UPDATED':
              icon = FaTheaterMasks;
              color = 'yellow';
              break;
            case 'EVENT_ADDED':
              icon = FaTicketAlt;
              color = 'red';
              break;
            default:
              icon = FaBell;
              color = 'blue';
          }

          return {
            id: activity.activityId,
            message: activity.message,
            timestamp: activity.createdAt,
            icon,
            color,
            type: activity.activityType
          };
        });
        setRecentActivities(mappedActivities);
      } else {
        // Fallback to placeholder data if no activities exist
        const placeholderActivities = [
          {
            id: 1,
            message: "No recent system activities",
            timestamp: new Date(),
            icon: FaBell,
            color: 'blue',
            type: 'placeholder'
          }
        ];
        setRecentActivities(placeholderActivities);
      }

    } catch (error) {
      console.error("Failed to load dashboard data", error);
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/loginPage');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add small delay to ensure token is properly set in localStorage
  const timer = setTimeout(() => {
    fetchDashboardData();
  }, 100);

  return () => clearTimeout(timer);
}, [navigate]);

// Fetch chart data when date range changes
useEffect(() => {
  const fetchChartData = async () => {
    try {
      const chartResponse = await myAxios.get('/admin/revenue-chart', {
        params: { period: dateRange }
      });
      if (chartResponse.data.status) {
        setChartData(chartResponse.data.data);
      }
    } catch (error) {
      console.error("Failed to load chart data", error);
    }
  };
  
  fetchChartData();
}, [dateRange]);


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="p-3 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome back, Admin!</h2>
          <p className="text-gray-600">Here's what's happening with your theater today.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{counts.totalUsers}</h3>
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
                <h3 className="text-2xl font-bold text-gray-800">{counts.totalMovies}</h3>
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
                <h3 className="text-2xl font-bold text-gray-800">{counts.totalTheaters}</h3>
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
                <h3 className="text-2xl font-bold text-gray-800">{counts.totalEvents}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaCalendarAlt className="text-xl text-green-600" />
              </div>
            </div>
          </div>


          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalBookings}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaTicketAlt className="text-xl text-green-600" />
              </div>
            </div>

          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</h3>
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

        {/* Today's Activity Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Today's Bookings</p>
                  <h4 className="text-3xl font-bold">{todayData.bookings}</h4>
                </div>
                <FaTicketAlt className="text-4xl text-blue-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Today's Revenue</p>
                  <h4 className="text-3xl font-bold">${todayData.revenue}</h4>
                </div>
                <FaDollarSign className="text-4xl text-green-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Today's Shows</p>
                  <h4 className="text-3xl font-bold">{todayData.shows}</h4>
                </div>
                <FaTheaterMasks className="text-4xl text-purple-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Seats Sold Today</p>
                  <h4 className="text-3xl font-bold">{todayData.seatsSold}</h4>
                </div>
                <FaChartBar className="text-4xl text-orange-200 opacity-50" />
              </div>
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

            {/* Revenue Chart */}
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#ef4444" 
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      name="Revenue (₹)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#3b82f6" 
                      fill="url(#colorBookings)"
                      strokeWidth={2}
                      name="Bookings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartBar className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
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
            <div className="space-y-3">
              {upcomingShows.slice(0, 5).map((show, index) => {
                const seatPercentage = (show.availableSeats / 200) * 100;
                const statusColor = seatPercentage > 50 ? 'green' : seatPercentage > 25 ? 'yellow' : 'red';
                
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{show.movie}</h4>
                        <p className="text-xs text-gray-600">{show.theater} - {show.screen}</p>
                      </div>
                      <span className={`bg-${statusColor}-100 text-${statusColor}-700 text-xs px-2 py-1 rounded-full font-medium`}>
                        {show.availableSeats} seats
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaClock className="mr-1" />
                      <span>{show.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-lg shadow-md mt-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
              <button 
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
                onClick={() => navigate('/adminDashboard/bookings')}
              >
                View All →
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theater
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <FaTicketAlt className="mx-auto text-gray-300 mb-2" size={32} />
                      <p>No recent bookings</p>
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.bookingReference}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {booking.bookingId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          User #{booking.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.show?.movie?.title || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.show?.showDate} • {booking.show?.showTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {booking.show?.theater?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Screen {booking.show?.screenName || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {booking.seatLabels}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.numberOfSeats} seat{booking.numberOfSeats !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{booking.totalAmount?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${booking.paymentStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                            booking.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent System Activity</h3>
            </div>

            <div className="bg-white">
              {recentActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <FaBell className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-500">No recent activities</p>
                </div>
              ) : (
                <ul>
                  {recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    
                    // Color mapping for Tailwind classes
                    const colorMap = {
                      green: { text: 'text-green-600' },
                      blue: { text: 'text-blue-600' },
                      yellow: { text: 'text-yellow-600' },
                      red: { text: 'text-red-600' },
                      purple: { text: 'text-purple-600' }
                    };
                    
                    const colors = colorMap[activity.color] || colorMap.blue;
                    
                    return (
                      <li 
                        key={activity.id} 
                        className={`py-3 flex justify-between items-center ${
                          index !== recentActivities.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <div className="flex items-center flex-1">
                          <IconComponent className={`${colors.text} mr-3 flex-shrink-0`} size={18} />
                          <span className="text-gray-700 text-sm">{activity.message}</span>
                        </div>
                        <span className="text-gray-500 text-sm ml-4 flex-shrink-0">
                          {formatTime(activity.timestamp)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;