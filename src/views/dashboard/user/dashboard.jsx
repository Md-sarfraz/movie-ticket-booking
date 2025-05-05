import React, { useState } from 'react';
import { 
  FaTicketAlt, 
  FaBell, 
  FaEnvelope, 
  FaChartBar, 
  FaFilm,
  FaBars
} from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../../auth/index";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Handle responsive sidebar toggle (when sidebar component is external)
  const toggleSidebar = () => {
    // This function would typically control a state in parent component
    // or dispatch an action that controls sidebar visibility
    setSidebarVisible(!sidebarVisible);
    // You might need to emit this event to parent component
  };

  if (!isLoggedIn()) {
    return <Navigate to="/LoginPage" />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile menu toggle button - only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-red-600 text-white shadow-lg"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Welcoming Header with Gradient Background and Avatar */}
        <div className="rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white p-6 mb-8 flex justify-between items-center shadow-md">
          <div className="flex-1">
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">
              Welcome Back, {user?.username || "User"}!
            </h1>
            <p className="text-sm opacity-90 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.
            </p>
          </div>
          <div className="flex-shrink-0 ml-4">
            {/* This would be replaced with an actual avatar component or image */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full overflow-hidden">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="50" cy="35" r="20" fill="#4A5568" /> {/* Head */}
                <circle cx="42" cy="30" r="3" fill="#FFF" /> {/* Left eye */}
                <circle cx="58" cy="30" r="3" fill="#FFF" /> {/* Right eye */}
                <path d="M43,45 Q50,50 57,45" stroke="#FFF" strokeWidth="2" fill="none" /> {/* Smile */}
                <rect x="30" y="55" width="40" height="40" rx="10" fill="#4A5568" /> {/* Body */}
              </svg>
            </div>
          </div>
        </div>

        {/* Notification icons */}
        <div className="flex justify-end space-x-4 mb-8">
          <button className="p-2 bg-white rounded-full shadow hover:shadow-md">
            <FaBell className="text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow hover:shadow-md">
            <FaEnvelope className="text-gray-600" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1 text-sm">Upcoming Shows</p>
                <h2 className="text-2xl font-bold text-gray-800">3</h2>
              </div>
              <div className="bg-red-100 p-3 rounded-md">
                <FaTicketAlt className="text-xl text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-800 font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1 text-sm">Available Movies</p>
                <h2 className="text-2xl font-bold text-gray-800">42</h2>
              </div>
              <div className="bg-blue-100 p-3 rounded-md">
                <FaFilm className="text-xl text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New releases</span>
                <span className="text-gray-800 font-medium">12 this week</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1 text-sm">Reward Points</p>
                <h2 className="text-2xl font-bold text-gray-800">1,250</h2>
              </div>
              <div className="bg-green-100 p-3 rounded-md">
                <FaChartBar className="text-xl text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next reward at</span>
                <span className="text-gray-800 font-medium">1,500 points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-300 rounded overflow-hidden">
                          <div className="h-full w-full bg-red-200 flex items-center justify-center">
                            <FaFilm className="text-red-700" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Avengers: Endgame</div>
                          <div className="text-sm text-gray-500">IMAX</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">12/11/2024</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">2:00 PM</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">B12, B13</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-300 rounded overflow-hidden">
                          <div className="h-full w-full bg-red-200 flex items-center justify-center">
                            <FaFilm className="text-red-700" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Spider-Man: No Way Home</div>
                          <div className="text-sm text-gray-500">Standard</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">10/11/2024</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">5:30 PM</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">C4, C5, C6</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-300 rounded overflow-hidden">
                          <div className="h-full w-full bg-red-200 flex items-center justify-center">
                            <FaFilm className="text-red-700" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Dune: Part Two</div>
                          <div className="text-sm text-gray-500">IMAX</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">15/12/2024</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">7:15 PM</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">D8, D9</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Upcoming
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommended Movies */}
        {/* <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Recommended For You</h2>
            <button className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "The Batman", genre: "Action, Drama", rating: 4.5 },
              { title: "Black Widow", genre: "Action, Adventure", rating: 4.2 },
              { title: "Joker", genre: "Crime, Drama", rating: 4.8 },
              { title: "Godzilla vs. Kong", genre: "Action, Sci-Fi", rating: 4.0 }
            ].map((movie, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-red-100 flex items-center justify-center">
                  <FaFilm className="text-4xl text-red-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{movie.genre}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={i < Math.floor(movie.rating) ? "currentColor" : "none"} stroke="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({movie.rating})</span>
                  </div>
                  <button className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;