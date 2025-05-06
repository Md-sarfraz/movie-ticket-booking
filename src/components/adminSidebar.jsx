import React, { useState } from 'react';
import { FaUsers, FaFilm, FaChartBar, FaCog, FaSignOutAlt, FaBuilding, FaTachometerAlt, FaTicketAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  
  // Check if current path matches the route
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(`/adminDashboard/${path}`);
  };
  
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 bg-white flex flex-col h-[85vh]">
      {/* Logo */}
      <div className="flex items-center justify-center py-6 border-b">
        <div className="flex items-center">
          <FaTicketAlt size={24} className="mr-2 text-red-500" />
          <div className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
            <span className="font-bold text-xl tracking-tight">Book</span>
            <span className="font-light text-xl">The</span>
            <span className="font-bold text-xl">Show</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Links - Added max-height and overflow-y-auto for scrollability */}
      <nav className="flex-grow py-6 px-4 max-h-96 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleNavigation("dashboard")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/dashboard") || activeItem === "dashboard"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaTachometerAlt size={18} className={isActive("/dashboard") || activeItem === "dashboard" ? "text-red-500" : "text-gray-500"} />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => handleNavigation("userList")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/users") || activeItem === "users"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaUsers size={18} className={isActive("/userList") || activeItem === "userList" ? "text-red-500" : "text-gray-500"} />
              <span>Manage Users</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => handleNavigation("movieList")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/movieList") || activeItem === "movieList"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaFilm size={18} className={isActive("/movieList") || activeItem === "movieList" ? "text-red-500" : "text-gray-500"} />
              <span>Manage Movies</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => handleNavigation("theaterList")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/theaterList") || activeItem === "theaterList"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaBuilding size={18} className={isActive("/theaterList") || activeItem === "theaterList" ? "text-red-500" : "text-gray-500"} />
              <span>Manage Theaters</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => handleNavigation("reports")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/reports") || activeItem === "reports"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaChartBar size={18} className={isActive("/reports") || activeItem === "reports" ? "text-red-500" : "text-gray-500"} />
              <span>Reports</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => handleNavigation("settings")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/settings") || activeItem === "settings"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaCog size={18} className={isActive("/settings") || activeItem === "settings" ? "text-red-500" : "text-gray-500"} />
              <span>Settings</span>
            </button>
          </li>
          
          {/* Adding extra items to demonstrate scrolling */}
          <li>
            <button
              onClick={() => handleNavigation("bookings")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/bookings") || activeItem === "bookings"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaTicketAlt size={18} className={isActive("/bookings") || activeItem === "bookings" ? "text-red-500" : "text-gray-500"} />
              <span>Manage Bookings</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => handleNavigation("analytics")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/analytics") || activeItem === "analytics"
                  ? "bg-red-100 text-red-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 active:bg-red-50"
              }`}
            >
              <FaChartBar size={18} className={isActive("/analytics") || activeItem === "analytics" ? "text-red-500" : "text-gray-500"} />
              <span>Analytics</span>
            </button>
          </li>

          <li>
             {/* Logout Button */}
      <div className=" border-t p-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 p-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors active:bg-red-100"
        >
          <FaSignOutAlt size={16} className="text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
          </li>
        </ul>
      </nav>
      
     
    </div>
  );
};

export default AdminSidebar;