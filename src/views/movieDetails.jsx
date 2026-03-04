import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AboutMovieSlider from '../components/aboutMovieSlider';
import { FaPlay } from 'react-icons/fa';

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
    <div className="container mx-auto p-4">
      <div
  className="relative w-full h-[90vh] flex flex-col md:flex-row items-center text-white rounded-lg mx-auto pt-20 bg-cover bg-center"
  style={{
    backgroundImage: `url(${movie.postUrl})`, // ✅ dynamic background
  }}
>

        <div className='bg-black w-full h-[90vh] opacity-60 absolute bottom-0'></div>

        {/* Poster */}
        <div className="relative w-64 h-80 z-10 ml-12">
          <img
            src={movie.postUrl}   // ✅ FIXED FIELD
            alt={`${movie.title} Poster`}  // ✅ FIXED FIELD
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FaPlay className="text-white text-6xl bg-black bg-opacity-50 p-4 rounded-full" />
          </div>
        </div>

        {/* Details */}
        <div className="md:ml-8 mt-4 md:mt-0 flex flex-col justify-between z-10">
          <h2 className="text-3xl font-bold mb-2">{movie.title}</h2> {/* ✅ FIXED */}
          
          <div className="flex space-x-2 mb-4">
            <span className="bg-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
              {movie.genre}
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-2">
            {movie.language} • {movie.releaseDate || "Coming Soon"} • {movie.duration || "2h 30m"}
          </p>

          <p className="text-gray-300 mb-4">
            {movie.description || "No description available for this movie."}
          </p>

          <div className="flex items-center mb-4">
            <span className="text-gray-400 text-lg">Rating:</span>
            <span className="text-yellow-400 text-xl ml-2">{movie.rating}</span>
          </div>

          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
              Watch Trailer
            </button>

            <button
              onClick={handleBookTickets}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
            >
              Book Tickets
            </button>
          </div>
        </div>
      </div>

      {/* About / Cast / Crew */}
      <div className='w-[85%] pt-8 px-10 py-10'>
        <div className='border-b-[1px] pb-8'>
          <h1 className='text-3xl font-bold'>About the movie</h1>
          <p className='pt-3'>
            {movie.description || "No additional details available."}
          </p>
        </div>

        <div className='border-b-[1px] pt-6 pb-4'>
          <h1 className='text-2xl font-bold mb-4'>Cast</h1>
          <AboutMovieSlider people={movie.castMember} type="cast" />
        </div>

        <div className='pt-5 pb-4'>
          <h1 className='text-2xl font-bold mb-4'>Crew</h1>
          <AboutMovieSlider people={movie.crewMember} type="crew" />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
