import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BookTheShowLogo from './bookTheShowLogo';
const Footer = () => {
  const location=useLocation();
  const pathname=location.pathname;
  useEffect(()=>{
    console.log("path name:",location.pathname)
  },[location.pathname])
  return (
    
      pathname !== "/LoginPage" && pathname !== "/movieDetails" && pathname !== "/LoginPage" && pathname !== "/SignUpPage" && !pathname?.split('/')?.includes('userDashboard') && !pathname?.split('/')?.includes('adminDashboard')  && pathname !== "/seatSelection"?(
        <div className='w-full h-[450px] bg-black flex flex-col items-center'>

        <div className='flex justify-between w-[75%] h-28 items-center border-b-[1px] border-b-gray-600'>
          <div className='relative flex flex-col'>
           <BookTheShowLogo/>
          </div>
          <div className=' flex gap-4 items-center'>
            <p className=' text-sm text-stone-500 hover:text-red-500'>Help/privacy policy</p>
  
            <div className='w-10 h-10 rounded-full bg-gray-700 flex justify-center items-center hover:bg-red-500 cursor-pointer hover:mt-[-15px] transition-all ease-in-out duration-300'>
              <i className="bi bi-twitter text-white text-xs"></i>
            </div>
  
            <div className='w-10 h-10 rounded-full bg-gray-700 flex justify-center items-center hover:bg-red-500 cursor-pointer hover:mt-[-15px] transition-all ease-in-out duration-300'>
              <i className="fa-brands fa-facebook-f text-white text-xs"></i>
            </div>
  
            <div className='w-10 h-10 rounded-full bg-gray-700 flex justify-center items-center  hover:bg-red-500 cursor-pointer hover:mt-[-15px] transition-all ease-in-out duration-300'>
              <i className="fa-brands fa-pinterest-p text-white text-xs"></i>
            </div>
  
            <div className='w-10 h-10 rounded-full bg-gray-700 flex justify-center items-center hover:bg-red-500 cursor-pointer hover:mt-[-15px] transition-all ease-in-out duration-300'>
              <i className="fa-brands fa-instagram text-white text-xs"></i>
            </div>
  
          </div>
        </div>
        <div className='flex justify-between w-[75%] h-28 items-center gap-10 py-10'>
  
          <div className='w-[30%] h-full'>
            <h1 className='text-white py-3 text-base font-bold'>Buy movie tickets easily with Aovis system nationwide</h1>
            <button className='bg-red-500 text-white hover:bg-white hover:text-red-500  w-28 h-10 text-xs rounded-sm my-5 font-bold transition duration-300 ease-in-out hover:scale-105'>Get Your Ticket</button>
          </div>
          <div className='w-[20%] h-full flex flex-col gap-[10px]'>
            <h1 className='text-red-500 py-3 '>Movies</h1>
            <p className="text-stone-500 text-sm w-10 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Action</p>
            <p className="text-stone-500 text-sm w-16 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Adventure</p>
            <p className="text-stone-500 text-sm w-16 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Animation</p>
            <p className="text-stone-500 text-sm w-14 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Comedy</p>
            <p className="text-stone-500 text-sm w-10 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Crime</p>
          </div>
          <div className='w-[20%] h-full flex flex-col gap-[10px]'>
            <h1 className='text-red-500 py-3'>Links</h1>
            <p className="text-stone-500 text-sm w-10 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"> About</p>
  
            <p className="text-stone-500 text-sm w-20 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">My account</p>
            <p className="text-stone-500 text-sm w-9 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">News</p>
            <p className="text-stone-500 text-sm w-[85px] border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Latest Events</p>
            <a href="http://localhost:5173/Home" className="text-stone-500 text-sm w-14 border-b-0 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Contact</a>
          </div>
          <div className='w-[30%] h-full flex flex-col gap-[10px]'>
            <h1 className='text-red-500 py-3'>Newsletter</h1>
            <p className='text-stone-500 text-sm'>Subscribe to leitmotif Newsletter this very day</p>
            <div className='relative'>
              <input type="text" placeholder='Email Address' className='w-56 h-10 text-xs outline-none px-4 bg-[#f3f3f3] '/>
              <i className="bi bi-send text-black absolute top-2 right-10"></i>
            </div>
            <p className='text-stone-500 text-sm'>I agree to all terms and policies of the company</p>
          </div>
        </div>
      </div>
      ):('')
    
   
  )
}

export default Footer