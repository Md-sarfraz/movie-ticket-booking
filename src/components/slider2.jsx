import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

export const SliderItems = ({ videolink, thumbnailImg }) => {
  const [playBtn, setPlayBtn] = useState(false);
  return (
    <>
      {playBtn ? (
        <iframe
          className="h-full w-full"
          src={videolink}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          <i
            className="bi bi-play-circle text-red-500 text-4xl hover:text-white absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={() => setPlayBtn(true)}
          ></i>
          <img
            src={thumbnailImg}
            alt=""
            className="h-full w-full object-cover rounded-lg"
          />
        </>
      )}
    </>
  );
};

export default function Slider2() {
  const slides = [
    { videolink: 'https://www.youtube.com/embed/szovD3BnvJI', thumbnailImg: './images/slider2-img1.jpg' },
    { videolink: 'https://www.youtube.com/embed/uV50UfcIT68', thumbnailImg: './images/slider2-img2.jpg' },
    { videolink: 'https://www.youtube.com/embed/uSWNCCChrC0', thumbnailImg: './images/slider2-img3.jpg' },
    { videolink: 'https://www.youtube.com/embed/lVjieoMPN-c', thumbnailImg: './images/slider2-img4.jpg' },
    { videolink: 'https://www.youtube.com/embed/szovD3BnvJI', thumbnailImg: './images/slider2-img5.jpg' },
  ];

  return (
    <>
      <Swiper
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: { slidesPerView: 3 },     // For mobile
          768: { slidesPerView: 4 },   // For tablets & desktops
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper pb-12"
      >
        {slides.map((item, index) => (
          <SwiperSlide
            key={index}
            className="slider2 h-40 w-72 relative overflow-hidden rounded-lg bg-gray-900"
          >
            <SliderItems
              videolink={item.videolink}
              thumbnailImg={item.thumbnailImg}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
