import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

export default function AboutMovieSlider({ people = [], type = "cast" }) {
    // If no people data provided, show a message
    if (!people || people.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No {type} information available for this movie.</p>
            </div>
        );
    }

    return (
        <>
            <Swiper 
                navigation={true} 
                modules={[Navigation]} 
                className="mySwiper"
                slidesPerView={7}
                spaceBetween={20}
                breakpoints={{
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 8
                    },
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 12
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 15
                    },
                    1280: {
                        slidesPerView: 7,
                        spaceBetween: 20
                    }
                }}
            >
                {people.map((person, index) => {
                    // Handle both string (legacy) and object formats
                    const personName = typeof person === 'string' ? person : person.name;
                    const personImage = typeof person === 'object' ? person.imageUrl : null;
                    const personRole = typeof person === 'object' ? person.role : null;
                    
                    return (
                        <SwiperSlide key={index} className='py-3'>
                            <div className="flex flex-col items-center group cursor-pointer">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2 ring-2 ring-gray-300 group-hover:ring-red-500 transition-all duration-300 shadow-md group-hover:shadow-xl">
                                    {personImage ? (
                                        <img 
                                            src={personImage} 
                                            alt={personName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div 
                                            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl font-bold group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300"
                                        >
                                            {personName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h1 className='text-sm font-semibold text-center text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 px-1'>{personName}</h1>
                                <p className='text-xs text-gray-500 mt-0.5'>{personRole || type}</p>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </>
    );
}