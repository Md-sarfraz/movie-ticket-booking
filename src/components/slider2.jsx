import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay } from 'swiper/modules';

export const SliderItems = ({ videolink, thumbnailImg, title }) => {
  const [playBtn, setPlayBtn] = useState(false);
  return (
    <>
      {playBtn && videolink ? (
        <iframe
          className="h-full w-full"
          src={`${videolink}?autoplay=1`}
          title={title || "Trailer"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          {videolink && (
            <i
              className="bi bi-play-circle text-red-500 text-4xl hover:text-white absolute inset-0 flex items-center justify-center cursor-pointer z-10"
              onClick={() => setPlayBtn(true)}
            ></i>
          )}
          {thumbnailImg ? (
            <img src={thumbnailImg} alt={title || ''} className="h-full w-full object-cover rounded-lg" />
          ) : (
            <div className="h-full w-full bg-gray-800 flex items-center justify-center rounded-lg">
              <span className="text-white/30 text-3xl">🎬</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default function Slider2({ movies = [] }) {
  if (!movies.length) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No upcoming movies available</p>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={20}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      breakpoints={{
        0: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
      }}
      modules={[Pagination, Autoplay]}
      className="mySwiper pb-12 w-full"
    >
      {movies.map((movie, index) => {
        const poster = movie.posterUrl || null;
        return (
          <SwiperSlide
            key={movie.movieId || movie.id || index}
            className="slider2 h-40 w-72 relative overflow-hidden rounded-lg bg-gray-900"
          >
            <SliderItems
              videolink={movie.trailer || null}
              thumbnailImg={poster}
              title={movie.movieName || movie.title}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
