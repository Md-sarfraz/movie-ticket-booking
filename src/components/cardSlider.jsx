import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { Navigation } from 'swiper/modules';
import MovieCard from './movieCard';

export default function CardSlider({slides}) {
  return (
    <>
      <Swiper slidesPerView={5} navigation={true} modules={[Navigation]}  className="mySwiper w-full h-[85%]">

        {
          slides.map((item,index)=>(
            <SwiperSlide className=' flex justify-center items-center' key={index}>
            <MovieCard image={item.image} title={item.title} movieName={item.movieName} movieItem={item}/>
          </SwiperSlide>
          ))
        }
      </Swiper>
    </>
  );
}