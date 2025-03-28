import React, { useEffect, useState } from "react";
import { FaTicketAlt, FaRecycle, FaBell, FaHome, FaCog, FaEnvelope, FaChartBar, FaFilm, FaCalendarAlt } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import { doLogout, isLoggedIn } from "../auth";
import { FaUser } from "react-icons/fa";

const UserSidebar = () => {
     const user = JSON.parse(localStorage.getItem("user"));
      const navigate = useNavigate();
      const [ImageUrl, setImageUrl] = useState("");
    
      useEffect(() => {
        const profileImage = JSON.parse(localStorage.getItem("user"));
        setImageUrl(profileImage?.profileImage);
      }, []);
    
      const logout = () => {
        localStorage.clear();
        doLogout(() => {
          navigate("/");
        });
      };

  return (
     <div className="w-56 bg-gradient-to-b from-red-500 to-red-600 p-6 pt-10 flex flex-col h-100vh shadow-lg">
          {/* Profile Section */}
          <div className="flex flex-col items-center border-b pb-4">
            <img
              // src={`http://localhost:1111/api/v1/post/image/${ImageUrl}`}
              src="./images/dummy-img.jpg"
              alt="Profile"
              className="rounded-full w-16 h-16 mb-2"
            />
            <h2 className="text-white font-semibold">{user?.username}</h2>
          </div>
    
          {/* Navigation Links */}
          <nav className="mt-4">
            <ul className="space-y-3 text-white">
              <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer" onClick={() => navigate("/userDashboard/userProfile")}>
                <FaUser className="text-lg" />
                <span className="text-base">Profile</span>
              </li>
    
              <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer"  onClick={() => navigate("/useDashboard/dashboard")}>
                <FaHome className="text-lg" />
                <span className="text-base">Dashboard</span>
              </li>
              <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                <FaFilm className="text-lg" />
                <span className="text-base">Movies</span>
              </li>
              <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                <FaCalendarAlt className="text-lg" />
                <span className="text-base">Bookings</span>
              </li>
              <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                <FaCog className="text-lg" />
                <span className="text-base">Settings</span>
              </li>
            </ul>
          </nav>
    
          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t">
            <button
              onClick={logout}
              className="w-full text-left flex items-center space-x-3 text-base p-2 text-white hover:bg-red-700 rounded-lg cursor-pointer"
            >
              <FaRecycle className="text-lg" />
              <span>Logou</span>
            </button>
          </div>
        </div>
  )
}

export default UserSidebar