import React, { useState, useEffect } from 'react';
import Slider from '../components/slider';
import Slider2 from '../components/slider2';
import ServiceCard from '../components/serviceCard.jsx';
import CardSlider from '../components/cardSlider.jsx';
import { getTopRatedMovies, getTrendingMovies, getPopularMovies } from '../services/movie-service';
import { BASE_URL } from '../services/helper';

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all movie data on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        const [topRatedRes, trendingRes, popularRes] = await Promise.all([
          getTopRatedMovies(),
          getTrendingMovies(),
          getPopularMovies()
        ]);

        console.log('Top Rated Response:', topRatedRes);
        console.log('Trending Response:', trendingRes);
        console.log('Popular Response:', popularRes);

        // Map API response to component-friendly format
        const mapMovieData = (movie) => ({
          id: movie.movieId,
          image: movie.postUrl || 'card-slider-img1.avif',
          title: movie.rating ? `${movie.rating}/10` : '8.0/10',
          movieName: movie.title || movie.movieName,
          posterUrl: movie.postUrl || '',
          bannerUrl: movie.backgroundImageUrl || '',
          genres: movie.genres || [],
          language: movie.language || 'English',
          releaseDate: movie.releaseDate || '',
          duration: movie.duration || '',
          description: movie.description || '',
          rating: movie.rating || 0,
        });

        setTopRatedMovies(topRatedRes?.map(mapMovieData) || []);
        setTrendingMovies(trendingRes?.map(mapMovieData) || []);
        setPopularMovies(popularRes?.map(mapMovieData) || []);
        
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden">
        {/* -------- HERO SLIDER SKELETON -------- */}
        <div className="pt-20 md:pt-28 mx-4 md:mx-8">
          <Slider movies={[]} loading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">

      {/* -------- HERO SLIDER -------- */}
      <div className="pt-20 md:pt-28 mx-4 md:mx-8">
        <Slider movies={topRatedMovies} loading={loading} />
      </div>

      {/* -------- UPCOMING MOVIES -------- */}
      <div className="py-6 md:py-10 mx-4 md:mx-8">
        <h1 className="text-xl md:text-2xl text-red-500 font-bold">Upcoming..</h1>

        <div className="my-3 flex justify-center">
          <Slider2 movies={trendingMovies} />
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
          <div className="flex items-center justify-between pt-10 pb-3 px-10 md:px-16">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Movies</h2>
            <span className="text-red-500 text-sm font-semibold cursor-pointer hover:underline">See All &rsaquo;</span>
          </div>

          <div className="px-10 md:px-16">
            <CardSlider slides={popularMovies.length > 0 ? popularMovies : []} />
          </div>

          {/* TOP RATED MOVIES */}
          <div className="flex items-center justify-between pt-10 pb-3 px-10 md:px-16">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Top Rated Movies</h2>
            <span className="text-red-500 text-sm font-semibold cursor-pointer hover:underline">See All &rsaquo;</span>
          </div>

          <div className="px-10 md:px-16">
            <CardSlider slides={topRatedMovies.length > 0 ? topRatedMovies : []} />
          </div>

          {/* TRENDING MOVIES */}
          <div className="flex items-center justify-between pt-10 pb-3 px-10 md:px-16">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Trending Movies</h2>
            <span className="text-red-500 text-sm font-semibold cursor-pointer hover:underline">See All &rsaquo;</span>
          </div>

          <div className="px-10 md:px-16 pb-12">
            <CardSlider slides={trendingMovies.length > 0 ? trendingMovies : []} />
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
