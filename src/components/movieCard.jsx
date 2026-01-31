import React from 'react'
import { useNavigate } from 'react-router-dom'
const MovieCard = (props) => {
  const navigate = useNavigate();
  //handle the navigate
  const handleNavigate = () => {
    navigate('/movieDetails', { 
  state: { data: props.movieItem }   // key unified
});

  }
  return (
    <div className='overflow-hidden w-[220px] h-[325px] border-4 hover:border-red-500 rounded-lg my-12 cursor-pointer '>
      <div className=' movie-card relative w-full h-[325px] transition duration-300 ease-in-out hover:scale-105 '>
        <img src={`./images/${props.image}`} className='w-full h-full object-cover' alt="" />
        <div className="h-full w-full absolute  top-0" style={{ background: 'linear-gradient(0deg, black 0%, rgba(0, 0, 0, 0) 65%)' }}></div>
      </div>
      <div className='absolute bottom-[45px] left-[40px]'>
        <div className='flex  items-center gap-2'>
          <i class="bi bi-suit-heart-fill text-[#e53935] text-base"></i>
          <p className='text-sm text-white m-0' >{props.title}</p>
        </div>
        <h1 className='text-LG font-bold text-white'>{props.movieName}</h1>
        <button className='mt-4 w-20 h-8 bg-white text-xs hover:bg-red-500  hover:text-white font-bold transition duration-300 ease-in-out hover:scale-105' onClick={() => handleNavigate()}>Get Ticket</button>
      </div>
    </div>
  )
}

export default MovieCard