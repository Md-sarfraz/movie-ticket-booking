import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AboutMovieSlider from '../components/aboutMovieSlider';
import { FaPlay } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const MovieDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(null);

  console.log("LOCATION STATE 👉", location.state);

useEffect(() => {
  if (location?.state?.data) {
    const m = location.state.data;

    setMovie({
      movieId: m.movieId,
      title: m.movieName || m.title,
      postUrl: m.posterUrl || m.postUrl,
      backgroundImageUrl: m.backgroundImageUrl,
      genre: Array.isArray(m.genres) ? m.genres.join(', ') : m.genre,
      language: m.language,
      releaseDate: m.releaseDate || "Coming Soon",
      duration: m.duration || "2h 30m",
      description: m.description || "No description available.",
      rating: m.rating || "N/A",
      director: m.director,
      format: m.format,
      price: m.price,
      trailer: m.trailer,
      castMember: m.castMember || [],
      crewMember: m.crewMember || [],
    });
  }
}, [location.state]);


  const handleBookTickets = () => {
    if (!movie) {
      console.warn("No movie data found!");
      return;
    }

    navigate("/bookTickets", {
      state: {
        data: movie   // ✅ same key BookTickets should read
      }
    });
  };

  if (!movie) {
    return <div className="p-10 text-center text-xl">Loading movie details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-20 pb-12">
      <div className="mb-4">
        <BackButton />
      </div>
      <div
        className="relative w-full min-h-[72vh] md:min-h-[78vh] flex flex-col md:flex-row md:items-center text-white rounded-xl mx-auto overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backgroundImageUrl || movie.postUrl})`,
        }}
      >

        <div className='bg-black/70 w-full h-full absolute inset-0'></div>

        {/* Poster */}
        <div className="relative w-44 sm:w-56 md:w-64 h-64 sm:h-80 z-10 mx-auto md:mx-0 md:ml-10 lg:ml-12 mt-6 md:mt-0 shrink-0">
          <img
            src={movie.postUrl}
            alt={`${movie.title} Poster`}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FaPlay className="text-white text-4xl sm:text-5xl md:text-6xl bg-black bg-opacity-50 p-3 sm:p-4 rounded-full" />
          </div>
        </div>

        {/* Details */}
        <div className="md:ml-8 lg:ml-10 mt-5 md:mt-0 flex flex-col justify-between z-10 px-4 sm:px-6 md:px-0 pb-6 md:pb-0 w-full max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{movie.title}</h2>
          
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            <span className="bg-purple-600 px-2.5 py-1 rounded-full text-xs font-semibold break-words">
              {movie.genre}
            </span>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm mb-2">
            {movie.language} • {movie.releaseDate || "Coming Soon"} • {movie.duration || "2h 30m"}
          </p>

          <p className="text-gray-200 text-sm sm:text-base mb-4 leading-relaxed">
            {movie.description || "No description available for this movie."}
          </p>

          <div className="flex items-center mb-4">
            <span className="text-gray-300 text-base sm:text-lg">Rating:</span>
            <span className="text-yellow-400 text-lg sm:text-xl ml-2">{movie.rating}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded w-full sm:w-auto">
              Watch Trailer
            </button>

            <button
              onClick={handleBookTickets}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded w-full sm:w-auto"
            >
              Book Tickets
            </button>
          </div>
        </div>
      </div>

      {/* About / Cast / Crew */}
      <div className='w-full pt-8 px-1 sm:px-2 md:px-4 lg:px-6 py-8 sm:py-10'>
        <div className='border-b-[1px] pb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold'>About the movie</h1>
          <p className='pt-3 text-sm sm:text-base leading-relaxed'>
            {movie.description || "No additional details available."}
          </p>
        </div>

        <div className='border-b-[1px] pt-6 pb-4'>
          <h1 className='text-xl sm:text-2xl font-bold mb-4'>Cast</h1>
          <AboutMovieSlider people={movie.castMember} type="cast" />
        </div>

        <div className='pt-5 pb-4'>
          <h1 className='text-xl sm:text-2xl font-bold mb-4'>Crew</h1>
          <AboutMovieSlider people={movie.crewMember} type="crew" />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
