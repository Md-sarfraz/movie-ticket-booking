import React from 'react';
import Slider from '../components/slider';
import Slider2 from '../components/slider2';
import ServiceCard from '../components/serviceCard.jsx';
import CardSlider from '../components/cardSlider.jsx';

const Home = () => {
  const topFeatureArr = [
    { image: 'feature-img9.jpg', title: '8.9/10', movieName: 'THE FAIL GUY' },
    { image: 'feature-img8.jpg', title: '8.9/10', movieName: 'ALL OF US STRANGERS' },
    { image: 'feature-img7.jpg', title: '8.9/10', movieName: 'FURIOSA' },
    { image: 'feature-img6.jpg', title: '8.9/10', movieName: 'AVENGERS' },
    { image: 'feature-img5.jpg', title: '8.9/10', movieName: 'KALKI' },
    { image: 'feature-img4.jpg', title: '8.9/10', movieName: '12TH FAIL' },
    { image: 'feature-img3.jpg', title: '8.9/10', movieName: 'FIGHTER' },
    { image: 'feature-img2.jpg', title: '8.9/10', movieName: 'INDIAN 2' },
    { image: 'feature-img1.jpg', title: '8.9/10', movieName: 'JAILER' },
  ];

  const popularMovie = [
    {
      image: 'card-slider-img1.avif',
      title: '8.9/10',
      movieName: 'JOKER',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img2.avif',
      title: '8.9/10',
      movieName: 'THE BUKHINGHAM MURDERS',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img3.avif',
      title: '8.9/10',
      movieName: 'STREE 2',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img4.avif',
      title: '8.9/10',
      movieName: 'KHEL KHEL ME',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img5.avif',
      title: '8.9/10',
      movieName: 'VEDAA',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img6.avif',
      title: '8.9/10',
      movieName: 'THE GREATEST OF ALL TIME..',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img7.avif',
      title: '8.9/10',
      movieName: 'BEETLIJUICE BEETLIJUICE',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img8.avif',
      title: '8.9/10',
      movieName: 'BIBI RAJNI',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
    {
      image: 'card-slider-img9.avif',
      title: '8.9/10',
      movieName: 'URANCHHU',
      posterUrl: 'https://image-url.jpg',
      genres: ['Adventure', 'Fantasy', 'Action'],
      language: 'English',
      releaseDate: 'April 27, 2018 (USA)',
      duration: '2h 36m',
      description:
        'The Avengers and their allies must sacrifice all to defeat the powerful Thanos.',
      rating: 99,
    },
  ];

  const PopularEvents = [
    { image: 'popular-event-img1.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img2.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img3.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img4.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img5.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img6.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img7.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img8.avif', title: '8.9/10', movieName: 'SHAAN' },
    { image: 'popular-event-img9.avif', title: '8.9/10', movieName: 'SHAAN' },
  ];

  return (
    <div className="overflow-hidden">

      {/* -------- HERO SLIDER -------- */}
      <div className="pt-20 md:pt-28 mx-4 md:mx-8">
        <Slider />
      </div>

      {/* -------- UPCOMING MOVIES -------- */}
      <div className="py-6 md:py-10 mx-4 md:mx-8">
        <h1 className="text-xl md:text-2xl text-red-500 font-bold">Upcoming..</h1>

        <div className="my-3 flex justify-center">
          <Slider2 />
        </div>
      </div>

      {/* -------- MAIN MOVIE SECTION -------- */}
      <div className="relative min-h-screen bg-[#e3e0e3] w-full mt-6">
        <img src="./images/image-lines-header.jpg" className="w-full object-cover" />

        <div className="relative flex flex-col pt-10 md:pt-20">

          {/* SERVICE CARDS */}
          <div className="w-full flex flex-col md:flex-row justify-center gap-6 md:gap-10 px-4">
            <ServiceCard image="service-card3.png" title="Upcoming Film Festivals" />
            <ServiceCard image="service-card2.png" title="Watch Film Awards" />
            <ServiceCard image="service-card1.png" title="Comedy TV Shows" />
          </div>

          {/* POPULAR MOVIES */}
          <div className="flex flex-col items-center pt-10 px-4">
            <img src="./images/film-logo.png" className="w-8 md:w-10" />
            <p className="text-stone-400 text-xs">Watch Now</p>
            <h1 className="text-2xl md:text-3xl font-bold">Popular Movies</h1>
          </div>

          <div className="flex items-center gap-1 text-red-500 justify-end pr-6 md:pr-10">
            <p className="text-sm md:text-base">See All</p>
            <i className="fa-solid fa-angle-right text-xs"></i>
          </div>

          <div className="w-full flex justify-center px-2">
            <CardSlider slides={popularMovie} />
          </div>

          {/* TOP FEATURED MOVIES */}
          <div className="flex flex-col items-center pt-8 px-4">
            <p className="text-stone-400 text-xs">Watch Now</p>
            <h1 className="text-2xl md:text-3xl font-bold">Top Featured Movies</h1>
          </div>

          <div className="flex items-center gap-1 text-red-500 justify-end pr-6 md:pr-10">
            <p className="text-sm md:text-base">See All</p>
            <i className="fa-solid fa-angle-right text-xs"></i>
          </div>

          <div className="px-2">
            <CardSlider slides={topFeatureArr} />
          </div>

          {/* POPULAR EVENTS */}
          <div className="flex flex-col items-center pt-8 px-4">
            <p className="text-stone-400 text-xs">Watch Now</p>
            <h1 className="text-2xl md:text-3xl font-bold">Popular Events</h1>
          </div>

          <div className="flex items-center gap-1 text-red-500 justify-end pr-6 md:pr-10">
            <p className="text-sm md:text-base">See All</p>
            <i className="fa-solid fa-angle-right text-xs"></i>
          </div>

          <div className="px-2 pb-10">
            <CardSlider slides={PopularEvents} />
          </div>
        </div>
      </div>

      {/* -------- BEST SELLER SECTION -------- */}
      <div className="w-full flex flex-col lg:flex-row py-14 lg:py-24 px-4 lg:px-16">

        {/* LEFT IMAGES */}
        <div className="relative w-full lg:w-6/12 h-[80vh] lg:h-[140vh] flex items-center justify-center mt-10 lg:mt-0">

          <img className="absolute bottom-10 left-10 opacity-30 w-40 lg:w-60"
            src="./images/best-seller-img1.png" />

          <div className="absolute w-40 lg:w-60 right-10 bottom-20">
            <img src="./images/best-seller-img2.png" />
            <div className="relative">
              <p className="absolute text-4xl lg:text-5xl font-bold text-red-500 bottom-[120px] right-[70px]">20</p>
              <h1 className="absolute bottom-[70px] right-[65px] text-xs lg:text-sm text-gray-400">year of <br /> producing</h1>
            </div>
          </div>

          <img className="absolute left-16 bottom-28 rotate-[50deg] w-28 lg:w-52"
            src="./images/best-seller-img3.png" />

          <img className="absolute right-5 top-60 w-28 lg:w-40"
            src="./images/best-seller-img4.png" />

          <img className="absolute right-0 top-28 w-48 lg:w-60"
            src="./images/best-seller-img5.jpg" />

          <img className="absolute left-20 rotate-[-15deg] w-40 lg:w-72"
            src="./images/best-seller-img6.jpg" />

        </div>

        {/* RIGHT TEXT SECTION */}
        <div className="w-full lg:w-6/12 mt-16 lg:mt-24 lg:pl-12">
          <img className="w-8" src="./images/film-logo.png" />
          <h2 className="text-gray-400 text-xs font-bold mt-2">Get to know us</h2>
          <h1 className="text-3xl lg:text-4xl font-bold mt-2">
            The Best Movie Ticket <br /> Distributor
          </h1>

          <p className="text-gray-400 text-sm pt-5 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod tempor
            incididunt labore dolore magna aliqua.
          </p>

          <div className="flex flex-col md:flex-row w-full items-start gap-6 mt-8">
            <div className="md:w-[60%]">

              <div className="flex items-center gap-4 mb-6">
                <img src="./images/best-seller-logo2.png" className="w-14" />
                <div>
                  <h1 className="font-bold">Unlimited Awards</h1>
                  <p className="text-sm text-gray-400">
                    We’ve designed a culture that allows our stewards to excel.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img src="./images/best-seller-logo1.png" className="w-14" />
                <div>
                  <h1 className="font-bold">Our Directors</h1>
                  <p className="text-sm text-gray-400">
                    We’ve designed a culture that allows our team to perform.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-[40%] bg-[#F3F3F3] h-44 px-6 border-b-[6px] border-red-500 flex flex-col justify-center mt-4 md:mt-0">
              <h1 className="text-red-500 text-xs font-bold">JOIN US</h1>
              <p className="font-bold text-base">Seeking a Career in Movie Production?</p>
            </div>
          </div>

          <button className="bg-red-500 mt-8 w-40 h-10 text-xs font-bold text-white hover:bg-black hover:text-white duration-300 hover:scale-105">
            Discover More
          </button>
        </div>

      </div>

    </div>
  );
};

export default Home;
