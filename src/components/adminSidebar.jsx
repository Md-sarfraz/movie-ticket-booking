import React, { useMemo, useState } from 'react';
import { FaUsers, FaFilm, FaChartBar, FaCog, FaSignOutAlt, FaBuilding, FaTachometerAlt, FaTicketAlt, FaClock, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { key: 'userList', label: 'Manage Users', icon: FaUsers },
  { key: 'movieList', label: 'Manage Movies', icon: FaFilm },
  { key: 'theaterList', label: 'Manage Theaters', icon: FaBuilding },
  { key: 'showList', label: 'Manage Shows', icon: FaClock },
  { key: 'eventList', label: 'Manage Events', icon: FaCalendarAlt },
  { key: 'bookings', label: 'Manage Bookings', icon: FaTicketAlt },
  { key: 'reports', label: 'Reports', icon: FaChartBar },
  { key: 'profile', label: 'Profile', icon: FaUser },
  { key: 'settings', label: 'Settings', icon: FaCog },
];

const PATH_GROUPS = {
  '': 'dashboard',
  addMovie: 'movieList',
  editMovie: 'movieList',
  addEvent: 'eventList',
  editEvent: 'eventList',
  addTheater: 'theaterList',
};

const SidebarNavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-red-50 text-red-600 shadow-sm'
          : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={17} className={isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'} />
      <span>{item.label}</span>
    </button>
  );
};

const AdminSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const activeItem = useMemo(() => {
    const currentSegment = location.pathname.split('/')[2] || '';
    return PATH_GROUPS[currentSegment] || currentSegment;
  }, [location.pathname]);
  
  const handleNavigation = (path) => {
    navigate(`/adminDashboard/${path}`);
    if (onNavigate) {
      onNavigate();
    }
  };
  
  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="flex h-full w-full flex-col border-r border-gray-200 bg-white">
      <nav className="flex-1 overflow-y-auto px-3 py-4 md:px-4">
        <ul className="space-y-1.5">
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.key}>
              <SidebarNavItem
                item={item}
                isActive={activeItem === item.key}
                onClick={() => handleNavigation(item.key)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <FaSignOutAlt size={16} className="text-red-500" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-1">
              <FaSignOutAlt size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Logout?</h2>
            <p className="text-gray-500 text-sm text-center">Are you sure you want to logout from the admin panel?</p>
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

export default AdminSidebar;