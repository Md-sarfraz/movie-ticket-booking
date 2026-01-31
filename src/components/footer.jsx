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
        <div className='w-full min-h-[450px] bg-black flex flex-col items-center px-4'>

        <div className='flex flex-col md:flex-row justify-between w-full lg:w-[75%] min-h-28 items-center border-b-[1px] border-b-gray-600 py-4 md:py-0'>
          <div className='relative flex flex-col mb-4 md:mb-0'>
           <BookTheShowLogo/>
          </div>
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <p className='text-sm text-stone-500 hover:text-red-500 text-center md:text-left'>Help/privacy policy</p>
  
            <div className='flex gap-4'>
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
        </div>
        
        <div className='flex flex-col lg:flex-row justify-between w-full lg:w-[75%] min-h-28 items-start gap-6 lg:gap-10 py-6 lg:py-10'>
  
          <div className='w-full lg:w-[30%] text-center lg:text-left'>
            <h1 className='text-white py-3 text-base font-bold'>Buy movie tickets easily with Aovis system nationwide</h1>
            <button className='bg-red-500 text-white hover:bg-white hover:text-red-500 w-28 h-10 text-xs rounded-sm my-5 font-bold transition duration-300 ease-in-out hover:scale-105'>Get Your Ticket</button>
          </div>
          
          <div className='w-full sm:w-1/2 lg:w-[20%] flex flex-col gap-[10px] text-center lg:text-left'>
            <h1 className='text-red-500 py-3 '>Movies</h1>
            <p className="text-stone-500 text-sm w-full lg:w-10 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">Action</p>
            <p className="text-stone-500 text-sm w-full lg:w-16 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">Adventure</p>
            <p className="text-stone-500 text-sm w-full lg:w-16 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">Animation</p>
            <p className="text-stone-500 text-sm w-full lg:w-14 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">Comedy</p>
            <p className="text-stone-500 text-sm w-full lg:w-10 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">Crime</p>
          </div>
          
          <div className='w-full sm:w-1/2 lg:w-[20%] flex flex-col gap-[10px] text-center lg:text-left'>
            <h1 className='text-red-500 py-3'>Links</h1>
            <p className="text-stone-500 text-sm w-full lg:w-10 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer"> About</p>
  
            <p className="text-stone-500 text-sm w-full lg:w-20 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">My account</p>
            <p className="text-stone-500 text-sm w-full lg:w-9 border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">News</p>
            <p className="text-stone-500 text-sm w-full lg:w-[85px] border-b-0 hover:text-red-500 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer">Latest Events</p>
            <a href="http://localhost:5173/Home" className="text-stone-500 text-sm w-full lg:w-14 border-b-0 hover:border-b-red-500  relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-red-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Contact</a>
          </div>
          
          <div className='w-full lg:w-[30%] flex flex-col gap-[10px] text-center lg:text-left'>
            <h1 className='text-red-500 py-3'>Newsletter</h1>
            <p className='text-stone-500 text-sm'>Subscribe to leitmotif Newsletter this very day</p>
            <div className='relative flex justify-center lg:justify-start'>
              <input type="text" placeholder='Email Address' className='w-full max-w-56 h-10 text-xs outline-none px-4 bg-[#f3f3f3] '/>
              <i className="bi bi-send text-black absolute top-2 right-4 lg:right-10"></i>
            </div>
            <p className='text-stone-500 text-sm'>I agree to all terms and policies of the company</p>
          </div>
        </div>
      </div>
      ):('')
    
   
  )
}

export default Footer