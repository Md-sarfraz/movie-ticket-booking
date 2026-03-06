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
    <div className='w-full'>
      <Swiper
        slidesPerView={2}
        spaceBetween={16}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          480:  { slidesPerView: 2, spaceBetween: 16 },
          640:  { slidesPerView: 3, spaceBetween: 18 },
          900:  { slidesPerView: 4, spaceBetween: 20 },
          1100: { slidesPerView: 5, spaceBetween: 20 },
          1400: { slidesPerView: 6, spaceBetween: 20 },
        }}
        className='mySwiper w-full !pb-2'
      >
        {slides.map((item, index) => (
          <SwiperSlide key={index} className='!h-auto'>
            <MovieCard
              image={item.image}
              title={item.title}
              movieName={item.movieName}
              movieItem={item}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}