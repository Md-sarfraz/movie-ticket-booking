import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../auth';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import SearchBar from './searchbar';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCity } from '../store/slices/citySlice';
import BookTheShowLogo from './bookTheShowLogo';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ onSearch }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const reduxUser = useSelector((state)=>state.auth.user);
  const selectedCity = useSelector((state)=>state.city.selectedCity);
  
  // Fallback to localStorage if Redux state is not populated yet
  const getUser = () => {
    if (reduxUser) return reduxUser;
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  const user = getUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const getDashboardPath = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' ? '/adminDashboard' : '/userDashboard';
  };

  const getProfilePath = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' ? '/adminDashboard/profile' : '/userDashboard/userProfile';
  };

  const getSettingsPath = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' ? '/adminDashboard/settings' : '/userDashboard/settings';
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutConfirm(false);
    setShowProfileDropdown(false);
    navigate('/');
    window.location.reload();
  };

  const handleShowMenu = () => {
    setIsShowMenu(!isShowMenu);
    if (isShowMenu) {
      // Reset search when closing menu
      setCitySearchQuery("");
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  // City data
  const featuredCities = [
    { name: "Ahmedabad", image: "./images/Ahmedabad-img.webp" },
    { name: "Delhi", image: "./images/Delhi-img.avif" },
    { name: "Mumbai", image: "./images/Mumbai-img.avif" },
    { name: "Bangaluru", image: "./images/Bengaluru-img.webp" },
    { name: "Chandigarh", image: "./images/Chandigarh-img.avif" },
    { name: "Chennai", image: "./images/Chennai-img.avif" },
    { name: "Hyderabad", image: "./images/Hyderabad-img.webp" },
    { name: "Kolkata", image: "./images/Kolkata-img.avif" }
  ];

  const otherCities = [
    "Ahmedabad", "Ajmer", "Amritsar", "Anand", "Armoor", "Aurangabad", "Bareilly", 
    "Belagavi", "Belgaum", "Bengaluru", "Bharuch", "Bhilai", "Bhilwara", "Bhiwadi", 
    "Bhopal", "Bhubaneswar", "Bilaspur", "Bokaro", "Burdwan", "Chandigarh", "Chennai", 
    "Coimbatore", "Cuddalore", "Cuttack", "Darjeeling", "Dehradun", "Delhi", "Delhi-NCR",
    "Dhanbad", "Dharwad", "Durgapur", "Faridabad", "Gandhinagar", "Ghaziabad", "Goa", 
    "Gorakhpur", "Greater Noida", "Gulbarga", "Guntur", "Gurugram", "Guwahati", "Gwalior", 
    "Howrah", "Hubli", "Hyderabad", "Indore", "Jaipur", "Jalandhar", "Jalgaon", "Jammu", 
    "Jamnagar", "Jodhpur", "Jorhat", "Kakinada", "Kalyan", "Kanpur"
  ];

  // Filter cities based on search query
  const filteredFeaturedCities = featuredCities.filter(city =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const filteredOtherCities = otherCities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Split other cities into two columns
  const midPoint = Math.ceil(filteredOtherCities.length / 2);
  const firstColumnCities = filteredOtherCities.slice(0, midPoint);
  const secondColumnCities = filteredOtherCities.slice(midPoint);

  const handleCitySearch = (e) => {
    setCitySearchQuery(e.target.value);
  };

  const handleCitySelect = (cityName) => {
    dispatch(setSelectedCity(cityName));
    setIsShowMenu(false);
    setCitySearchQuery("");
  };

  const userRole = localStorage.getItem('role');

  return (
    <div className='flex h-16 md:h-20 items-center justify-between border-b-2 border-gray-100 shadow-lg fixed w-full bg-white/95 backdrop-blur-md z-[100] px-4 md:px-8'>
      {/* Left section - Logo */}
      <div className='flex items-center gap-3 md:gap-6'>
        <BookTheShowLogo/>
        
        {userRole !== 'ADMIN' && (
          <div className='relative flex items-center'>
            <button 
              className='flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group' 
              onClick={() => handleShowMenu()}
            >
              <i className="fa-solid fa-location-dot text-base md:text-lg text-red-500 group-hover:scale-110 transition-transform"></i>
              <span className='text-xs md:text-sm font-medium text-gray-700'>
                {selectedCity || 'Select City'}
              </span>
              <i className="fa-solid fa-chevron-down text-xs text-gray-400 group-hover:text-red-500 transition-colors"></i>
            </button>
            {
              isShowMenu &&
              <div className="bg-white max-h-[calc(100vh-6rem)] overflow-y-auto w-72 md:w-80 lg:w-96 p-4 rounded-lg shadow-xl border border-gray-200 absolute top-full left-0 mt-2 z-50 hide-scrollbar">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select City</h2>
                <button className="text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={() => handleShowMenu()}>&times;</button>
              </div>

              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search for city"
                  value={citySearchQuery}
                  onChange={handleCitySearch}
                  className="w-full pl-10 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
                {citySearchQuery && (
                  <button
                    onClick={() => setCitySearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {citySearchQuery && (
                <div className="mb-2 text-sm text-gray-600">
                  Found {filteredFeaturedCities.length + filteredOtherCities.length} cities
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-6">
                {filteredFeaturedCities.length > 0 ? (
                  filteredFeaturedCities.map((city, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => handleCitySelect(city.name)}
                    >
                      <img src={city.image} alt={city.name} className="rounded-lg w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                        <p className="text-white font-semibold">{city.name}</p>
                      </div>
                      {selectedCity === city.name && (
                        <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  citySearchQuery && filteredOtherCities.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-4">
                      <p className="font-semibold">No cities found</p>
                      <p className="text-xs mt-1">Try searching with a different name</p>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-center text-gray-500 font-medium mb-4">Other Cities</h3>
                {filteredOtherCities.length > 0 && (
                  <div className="flex flex-row justify-center items-center text-sm text-gray-700 gap-4 w-full">
                    <div className="w-[50%] flex flex-col justify-center items-center gap-2">
                      {firstColumnCities.map((city, index) => (
                        <a 
                          key={index} 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleCitySelect(city);
                          }}
                          className={`hover:text-red-400 transition-colors ${selectedCity === city ? 'text-red-500 font-semibold' : ''}`}
                        >
                          {city}
                        </a>
                      ))}
                    </div>
                    <div className="w-[50%] flex flex-col justify-center items-center gap-2">
                      {secondColumnCities.map((city, index) => (
                        <a 
                          key={index} 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleCitySelect(city);
                          }}
                          className={`hover:text-red-400 transition-colors ${selectedCity === city ? 'text-red-500 font-semibold' : ''}`}
                        >
                          {city}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            }
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <ul className='hidden lg:flex gap-8 justify-center text-sm font-medium'>
        <li className='group flex justify-center flex-col items-center relative'>
          <Link to='/' className='px-3 py-2 rounded-md hover:text-red-500 transition-colors'>Home</Link>
          <div className='absolute bottom-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300'></div>
        </li>
        <li className='group flex justify-center flex-col items-center relative'>
          <Link to='/movies' className='px-3 py-2 rounded-md hover:text-red-500 transition-colors'>Movies</Link>
          <div className='absolute bottom-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300'></div>
        </li>
        <li className='group flex justify-center flex-col items-center relative'>
          <Link to='/event' className='px-3 py-2 rounded-md hover:text-red-500 transition-colors'>Events</Link>
          <div className='absolute bottom-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300'></div>
        </li>
        <li className='group flex justify-center flex-col items-center relative'>
          <Link to='/contact' className='px-3 py-2 rounded-md hover:text-red-500 transition-colors'>Contact</Link>
          <div className='absolute bottom-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300'></div>
        </li>
        <li className='group flex justify-center flex-col items-center relative'>
          <Link to='/about' className='px-3 py-2 rounded-md hover:text-red-500 transition-colors'>About</Link>
          <div className='absolute bottom-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300'></div>
        </li>
      </ul>

      {/* Right section */}
      <ul className='flex flex-row gap-3 md:gap-6 items-center'>
        {/* Search - hidden on very small screens */}
        <li className='relative hidden sm:block'>
          <SearchBar/>
        </li>
        
        {/* Login/User Profile */}
        <li className="flex items-center justify-center">
          {!isLoggedIn() ? 
            <button className="relative overflow-hidden text-white text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-600 rounded-lg px-4 py-2 hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <Link to='LoginPage'>Login/Register</Link>
            </button>
            : 
            <div 
              ref={profileRef}
              className='relative'
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => !showLogoutConfirm && setShowProfileDropdown(false)}
            >
              {/* Avatar trigger */}
              <div className='flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 transition-all cursor-pointer'>
                <div className='w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 p-0.5 flex justify-center items-center overflow-hidden shadow-md hover:shadow-lg transition-shadow'>
                  <div className='w-full h-full rounded-full bg-white flex justify-center items-center overflow-hidden'>
                    <img
                      src={user?.image || "./images/user-dummy.png"}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display='none'; }}
                    />
                  </div>
                </div>
                <p className='text-gray-700 text-sm font-medium hidden md:block'>{user?.username || user?.firstName}</p>
                <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 hidden md:block ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-[200] overflow-hidden dropdown-animate">
                  {/* Arrow */}
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45"></div>

                  {/* User info */}
                  <div className="px-3 pt-2.5 pb-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-800 truncate">{user?.username || user?.firstName || 'User'}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-0.5">
                    <Link
                      to={getProfilePath()}
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaUser size={11} className="text-gray-400" />
                      My Profile
                    </Link>
                    <Link
                      to={getSettingsPath()}
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaCog size={11} className="text-gray-400" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-0.5">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt size={11} className="text-red-400" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          }
        </li>

        {/* Mobile Menu Button */}
        <li className='lg:hidden'>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </li>
      </ul>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 md:top-20 bg-white z-50 shadow-2xl">
          <div className="flex flex-col p-6 space-y-2">
            {/* Mobile Search */}
            <div className="sm:hidden mb-4">
              <SearchBar/>
            </div>
            
            {/* Mobile Navigation Links */}
            <Link 
              to='/' 
              className='py-3 px-4 text-base font-medium rounded-lg border-b border-gray-100 hover:text-red-500 hover:bg-red-50 transition-all'
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to='/movies' 
              className='py-3 px-4 text-base font-medium rounded-lg border-b border-gray-100 hover:text-red-500 hover:bg-red-50 transition-all'
              onClick={closeMobileMenu}
            >
              Movies
            </Link>
            <Link 
              to='/event' 
              className='py-3 px-4 text-base font-medium rounded-lg border-b border-gray-100 hover:text-red-500 hover:bg-red-50 transition-all'
              onClick={closeMobileMenu}
            >
              Events
            </Link>
            <Link 
              to='/contact' 
              className='py-3 px-4 text-base font-medium rounded-lg border-b border-gray-100 hover:text-red-500 hover:bg-red-50 transition-all'
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <Link 
              to='/about' 
              className='py-3 px-4 text-base font-medium rounded-lg border-b border-gray-100 hover:text-red-500 hover:bg-red-50 transition-all'
              onClick={closeMobileMenu}
            >
              About
            </Link>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setShowLogoutConfirm(false); setShowProfileDropdown(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <FaSignOutAlt size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Logout?</h2>
            <p className="text-gray-500 text-sm text-center">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => { setShowLogoutConfirm(false); setShowProfileDropdown(false); }}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar