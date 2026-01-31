import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

const slides = [
    
    { src: "./images/Akshay-kumar.avif", name: "Akshay Kumar", role: "as Rishabh Malik" },
    { src: "./images/vaani-kapoor.avif", name: "Vaani Kapoor", role: "as Pooja" },
    { src: "./images/ammy-virk.avif", name: "Ammy Virk", role: "as Harry" },
    { src: "./images/taapsee-pannu.avif", name: "Taapsee Pannu", role: "as Sia" },
    { src: "./images/aditya-seal.avif", name: "Aditya Seal", role: "as Kabir" },
    { src: "./images/pragya-jaiswal.avif", name: "Pragya Jaiswal", role: "as Meera" },
    { src: "./images/fardeen-khan.avif", name: "Fardeen Khan", role: "as Aryan" },
    { src: "./images/actor8.avif", name: "Actor 8", role: "as Character 8" },
    { src: "./images/actor9.avif", name: "Actor 9", role: "as Character 9" },
];

export default function AboutMovieSlider() {
    return (
        <>
            <Swiper navigation={true} modules={[Navigation]} className="mySwiper"
                slidesPerView={6}
                spaceBetween={30}
            >
                {slides.map((slide,index)=>(    
                    <SwiperSlide className=' h-64 w-80 flex flex-col justify-center items-center '>
                    <img src={slide.src} alt={slide.name} className='rounded-full' />
                    <h1 className='text-xl'>{slide.name}</h1>
                    <p className='text-base text-gray-500'>{slide.role}</p>
                </SwiperSlide>
                ))}

                

            </Swiper>
        </>
    );
}