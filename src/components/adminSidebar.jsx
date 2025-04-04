import React from 'react';
import { FaUsers, FaFilm, FaTicketAlt, FaChartBar, FaCog, FaUserPlus, FaBuilding } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate("/");
    };
    return (
        <div className='w-full'>
            {/* Sidebar */}
            <aside className="w-60 bg-gradient-to-b from-red-500 to-red-600 p-6 pt-10 flex flex-col h-screen shadow-lg fixed z-50 overflow-y-auto">
                <div className="flex flex-col items-center border-b pb-4">
                    <img
                        // src={`http://localhost:1111/api/v1/post/image/${ImageUrl}`}
                        src="./images/dummy-img.jpg"
                        alt="Profile"
                        className="rounded-full w-16 h-16 mb-2"
                    />
                    <h2 className="text-white font-semibold"></h2>
                </div>
                <nav className="mt-4 flex-1 overflow-auto">
                    <ul className="space-y-3 text-white">
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer" onClick={() => navigate("/adminDashboard/dashboard")}>
                            <FaChartBar className="text-lg" />
                            <span className="text-base">Dashboard</span>
                        </li>
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                            <FaUsers className="text-lg" />
                            <span className="text-base">Manage Users</span>
                        </li>
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer" onClick={() => navigate("/adminDashboard/movieList")}>
                            <FaFilm className="text-lg" />
                            <span className="text-base">Manage Movies</span>
                        </li>
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer" onClick={() => navigate("/adminDashboard/theaterList")}>
                            <FaBuilding className="text-lg" />
                            <span className="text-base">Manage Theaters</span>
                        </li>
                        {/* <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                            <FaTicketAlt className="text-lg" />
                            <span className="text-base">Manage Tickets</span>
                        </li> */}
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer" onClick={() => navigate("/adminDashboard/userProfile")}>
                            <FaChartBar className="text-lg" />
                            <span className="text-base">Reports</span>
                        </li>
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                            <FaCog className="text-lg" />
                            <span className="text-base">Settings</span>
                        </li>
                        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer">
                            <FaUserPlus className="text-lg" />
                            <button
                                onClick={logout}>
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default AdminSidebar