import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../auth';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { use } from 'react';
import { Search } from 'lucide-react';
import SearchBar from './searchbar';
import { useSelector } from 'react-redux';
import BookTheShowLogo from './bookTheShowLogo';

const Navbar = ({ onSearch }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const user = useSelector((state)=>state.auth.user);
  console.log(user)
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handlehandleImageClick = () => {
    const role = JSON.parse(localStorage.getItem('user'))?.role;
    if (role === "user") {
      navigate("/userDashboard")
    }
    else if (role === "admin") {
      navigate("/adminDashboard")
    }
  }


  const handleShowMenu = () => {
    setIsShowMenu(!isShowMenu);
  }

  

  return (
    <div className='flex h-20 items-center justify-between border-y-2 shadow-lg fixed w-full bg-white z-[100]'>
      <ul className='mx-10 flex items-center justify-center'>
        <li className='relative'><i className="fa-solid fa-location-dot text-3xl text-red-400 cursor-pointer" onClick={() => handleShowMenu()}></i>
          {
            isShowMenu &&
            <div class="bg-white h-[80vh] overflow-scroll w-80 md:w-96 p-4 rounded-lg shadow-xl  absolute" style={{ scrollbarWidth: 'none' }}>
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">Select City</h2>
                <button class="text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={() => handleShowMenu()}>&times;</button>
              </div>

              <div class="mb-4">
                <input
                  type="text"
                  placeholder="Search for city"
                  class="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              <div class="grid grid-cols-2 gap-2 mb-6">
                <div class="relative group cursor-pointer">
                  <img src="./images/Ahmedabad-img.webp" alt="Ahmedabad" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Ahmedabad</p>
                  </div>
                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Delhi-img.avif" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Delhi-NCR</p>
                  </div>
                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Mumbai-img.avif" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Mumbai-AII</p>
                  </div>

                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Bengaluru-img.webp" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Bangaluru</p>
                  </div>

                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Chandigarh-img.avif" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Chandigarh</p>
                  </div>

                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Chennai-img.avif" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Chennai</p>
                  </div>
                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Hyderabad-img.webp" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Hyderabad</p>
                  </div>

                </div>
                <div class="relative group cursor-pointer">
                  <img src="./images/Kolkata-img.avif" alt="City" class="rounded-lg w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 rounded-lg transition-opacity group-hover:bg-opacity-60">
                    <p class="text-white font-semibold">Kolkata</p>
                  </div>

                </div>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <h3 class="text-center text-gray-500 font-medium mb-4">Other Cities</h3>
                <div class="flex flex-row justify-center items-center text-sm text-gray-700 gap-4  w-full ">
                  <div className="w-[50%] flex flex-col justify-center items-center gap-2 ">
                    <a href="#" class="hover:text-red-400">Ahmedabad</a>
                    <a href="#" class="hover:text-red-400">Ajmer</a>
                    <a href="#" class="hover:text-red-400">Amritsar</a>
                    <a href="#" class="hover:text-red-400">Anand</a>
                    <a href="#" class="hover:text-red-400">Armoor</a>
                    <a href="#" class="hover:text-red-400">Aurangabad</a>
                    <a href="#" class="hover:text-red-400">Bareilly</a>
                    <a href="#" class="hover:text-red-400">Belagavi</a>
                    <a href="#" class="hover:text-red-400">Belgaum</a>
                    <a href="#" class="hover:text-red-400">Bengaluru</a>
                    <a href="#" class="hover:text-red-400">Bharuch</a>
                    <a href="#" class="hover:text-red-400">Bhilai</a>
                    <a href="#" class="hover:text-red-400">Bhilwara</a>
                    <a href="#" class="hover:text-red-400">Bhiwadi</a>
                    <a href="#" class="hover:text-red-400">Bhopal</a>
                    <a href="#" class="hover:text-red-400">Bhubaneswar</a>
                    <a href="#" class="hover:text-red-400">Bilaspur</a>
                    <a href="#" class="hover:text-red-400">Bokaro</a>
                    <a href="#" class="hover:text-red-400">Burdwan</a>
                    <a href="#" class="hover:text-red-400">Chandigarh</a>
                    <a href="#" class="hover:text-red-400">Chennai</a>
                    <a href="#" class="hover:text-red-400">Coimbatore</a>
                    <a href="#" class="hover:text-red-400">Cuddalore</a>
                    <a href="#" class="hover:text-red-400">Cuttack</a>
                    <a href="#" class="hover:text-red-400">Darjeeling</a>
                    <a href="#" class="hover:text-red-400">Dehradun</a>
                    <a href="#" class="hover:text-red-400">Delhi</a>
                    <a href="#" class="hover:text-red-400">Delhi-NCR</a>
                  </div>


                  <div className="w-[50%] flex flex-col justify-center items-center gap-2 ">
                    <a href="#" class="hover:text-red-400">Dhanbad</a>
                    <a href="#" class="hover:text-red-400">Dharwad</a>
                    <a href="#" class="hover:text-red-400">Durgapur</a>
                    <a href="#" class="hover:text-red-400">Faridabad</a>
                    <a href="#" class="hover:text-red-400">Gandhinagar</a>
                    <a href="#" class="hover:text-red-400">Ghaziabad</a>
                    <a href="#" class="hover:text-red-400">Goa</a>
                    <a href="#" class="hover:text-red-400">Gorakhpur</a>
                    <a href="#" class="hover:text-red-400">Greater Noida</a>
                    <a href="#" class="hover:text-red-400">Gulbarga</a>
                    <a href="#" class="hover:text-red-400">Guntur</a>
                    <a href="#" class="hover:text-red-400">Gurugram</a>
                    <a href="#" class="hover:text-red-400">Guwahati</a>
                    <a href="#" class="hover:text-red-400">Gwalior</a>
                    <a href="#" class="hover:text-red-400">Howrah</a>
                    <a href="#" class="hover:text-red-400">Hubli</a>
                    <a href="#" class="hover:text-red-400">Hyderabad</a>
                    <a href="#" class="hover:text-red-400">Indore</a>
                    <a href="#" class="hover:text-red-400">Jaipur</a>
                    <a href="#" class="hover:text-red-400">Jalandhar</a>
                    <a href="#" class="hover:text-red-400">Jalgaon</a>
                    <a href="#" class="hover:text-red-400">Jammu</a>
                    <a href="#" class="hover:text-red-400">Jamnagar</a>
                    <a href="#" class="hover:text-red-400">Jodhpur</a>
                    <a href="#" class="hover:text-red-400">Jorhat</a>
                    <a href="#" class="hover:text-red-400">Kakinada</a>
                    <a href="#" class="hover:text-red-400">Kalyan</a>
                    <a href="#" class="hover:text-red-400">Kanpur</a>
                  </div>
                </div>
              </div>
            </div>
          }



        </li>

        <li className='pl-5'><BookTheShowLogo/></li>
      </ul>
      <ul className='flex gap-10 justify-center text-base  '>
        <li className='group flex justify-center flex-col items-center'><Link to='/'>Home</Link>
          <div className='w-0 h-[2px] group-hover:w-full group-hover:bg-red-500 flex justify-center  group-hover:transition-all duration-300 ease-in-out'></div>
        </li>
        <li className='group flex justify-center flex-col items-center'><Link to='/movies'>Movies</Link>
          <div className='w-0 h-[2px] group-hover:w-full group-hover:bg-red-500 flex justify-center group-hover:transition-all duration-300 ease-in-out '></div>
        </li>
        <li className='group flex justify-center flex-col items-center'><Link to='/event'>Events</Link>
          <div className='w-0 h-[2px] group-hover:w-full group-hover:bg-red-500 flex justify-center group-hover:transition-all duration-300 ease-in-out '></div>
        </li>
        <li className='group flex justify-center flex-col items-center'><Link to='/contact'>Contact</Link>
          <div className='w-0 h-[2px] group-hover:w-full group-hover:bg-red-500 flex justify-center group-hover:transition-all duration-300 ease-in-out  '></div>
        </li>
        <li className='group flex justify-center flex-col items-center'><Link to='/about'>About</Link>
          <div className='w-0 h-[2px] group-hover:w-full group-hover:bg-red-500 flex justify-center group-hover:transition-all duration-300 ease-in-out '></div>
        </li>
      </ul>
      <ul className='flex flex-row gap-10 mx-10 items-center'>

        <li className='relative'>
          <SearchBar/>
        </li>
        <li class="flex items-center justify-center">
          {!isLoggedIn() ? <><button class="text-red-400 text-xs  border-2 border-red-400 rounded-lg px-2 py-2 hover:bg-red-500 hover:text-white transition-colors duration-300">
            <Link to='LoginPage'>Login/Register</Link></button></>
            : <div className='flex flex-row justify-center items-center gap-1'>
              <div className='w-9 h-9 rounded-full bg-gray-700 flex  justify-center items-center overflow-hidden'>
                <img
                  src={user?.image || "./images/user-dummy.png"}
                  alt="User Profile"
                  onClick={() => handlehandleImageClick()}
                  style={{ width: "200px", height: "auto", borderRadius: "50%" }}
                />
              </div>
              <p className='text-black text-xs'>{user?.username}</p>
            </div>
          }

        </li>
      </ul>
    </div>
  )

}

export default Navbar