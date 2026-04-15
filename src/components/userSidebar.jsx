import React, { useState } from "react";
import { FaUser, FaHome, FaFilm, FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { doLogout } from "../auth";
import { useSelector } from "react-redux";

const UserSidebar = ({ onNavigate }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Check if current path matches the route
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  const confirmLogout = () => {
    localStorage.clear();
    doLogout(() => {
      navigate("/");
    });
    if (onNavigate) {
      onNavigate();
    }
  };

  const navigateAndClose = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="w-full bg-white flex flex-col h-full md:h-[85vh] shadow-lg md:shadow-none">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-6 md:py-8 bg-gray-50">
        {user?.image ? (
          <div className="relative">
            <img
              src={user.image || "./images/dummy-img.jpg"}
              alt="Profile"
              className="rounded-full w-20 h-20 mb-3 border-2 border-white shadow-md object-cover"
            />
            {/* <div className="absolute bottom-3 right-0 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div> */}
          </div>
        ) : (
          <div className="relative">
            <div className="w-20 h-20 rounded-full mb-3 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
              <FaUser size={30} className="text-blue-500" />
            </div>
            <div className="absolute bottom-3 right-0 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
        )}
        <h2 className="text-gray-800 font-semibold text-lg">{user?.username || "User"}</h2>
        {/* <p className="text-gray-500 text-sm">{user?.email || "user@example.com"}</p> */}
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-grow py-4 md:py-6 px-3 md:px-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigateAndClose("/userDashboard/dashboard")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/dashboard") 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaHome size={18} className={isActive("/dashboard") ? "text-blue-500" : "text-gray-500"} />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => navigateAndClose("/userDashboard/userProfile")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/userProfile") 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaUser size={18} className={isActive("/userProfile") ? "text-blue-500" : "text-gray-500"} />
              <span>Profile</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => navigateAndClose("/movies")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/movies") 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaFilm size={18} className={isActive("/movies") ? "text-blue-500" : "text-gray-500"} />
              <span>Movies</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => navigateAndClose("/userDashboard/bookings")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/bookings") 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaCalendarAlt size={18} className={isActive("/bookings") ? "text-blue-500" : "text-gray-500"} />
              <span>Bookings</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => navigateAndClose("/userDashboard/settings")}
              className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-colors ${
                isActive("/settings") 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaCog size={18} className={isActive("/settings") ? "text-blue-500" : "text-gray-500"} />
              <span>Settings</span>
            </button>
          </li>

          <li>
            {/* Logout Button */}
      <div className=" border-t pt-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center space-x-2 p-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaSignOutAlt size={16} className="text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-1">
              <FaSignOutAlt size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Logout?</h2>
            <p className="text-gray-500 text-sm text-center">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSidebar;