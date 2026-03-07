import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/style.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay } from 'swiper/modules';

const GRADIENTS = [
  'from-slate-900 via-slate-800 to-slate-900',
  'from-red-950 via-slate-900 to-slate-900',
  'from-blue-950 via-slate-900 to-slate-900',
  'from-purple-950 via-slate-900 to-slate-900',
  'from-emerald-950 via-slate-900 to-slate-900',
  'from-amber-950 via-slate-900 to-slate-900',
];

// Loading skeleton shown while API is fetching
function SliderSkeleton() {
  return (
    <div className="slider rounded-2xl overflow-hidden bg-slate-800 h-80 flex items-center px-6 md:px-16 animate-pulse">
      {/* Left text skeleton */}
      <div className="w-[55%] space-y-3">
        <div className="h-3 w-24 bg-slate-600 rounded" />
        <div className="h-8 w-56 bg-slate-600 rounded" />
        <div className="h-3 w-48 bg-slate-700 rounded" />
        <div className="h-3 w-40 bg-slate-700 rounded" />
        <div className="h-8 w-28 bg-red-800/50 rounded-md mt-4" />
      </div>
      {/* Right poster skeleton */}
      <div className="absolute right-12 md:right-24 top-8 w-36 h-48 bg-slate-600 rounded-lg" />
    </div>
  );
}

export default function Slider({ movies = [], loading = false }) {
  const [activeTrailer, setActiveTrailer] = useState(null);
  const navigate = useNavigate();

  // Show skeleton while data is loading
  if (loading) return <SliderSkeleton />;

  // Fallback when no movies are returned from API
  if (!movies.length) {
    return (
      <div className="slider rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 h-80 flex flex-col items-center justify-center gap-2">
        <span className="text-4xl">🎬</span>
        <p className="text-white/60 text-sm font-medium">No featured movies available right now</p>
        <p className="text-white/30 text-xs">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className='slider rounded-2xl overflow-hidden'>
      <Swiper
        spaceBetween={30}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {movies.map((movie, index) => {
          const grad = GRADIENTS[index % GRADIENTS.length];
          const posterSrc  = movie.posterUrl  || null;
          const bannerSrc  = movie.bannerUrl   || null;
          const releaseLabel = movie.releaseDate
            ? new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Now Showing';

          return (
            <SwiperSlide
              key={movie.id || movie.movieId || index}
              className="relative w-full h-80 flex justify-center items-center overflow-hidden"
            >
              {/* ── Background: banner image or gradient fallback ── */}
              {bannerSrc ? (
                <>
                  <img
                    src={bannerSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  {/* Dark overlay so text stays readable */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-r ${grad}`} />
              )}

              {/* ── Poster on the right ── */}
              <div className='absolute w-36 h-48 top-8 right-12 md:right-24 z-20 shadow-2xl rounded-lg overflow-hidden'>
                {posterSrc ? (
                  <img
                    src={posterSrc}
                    alt={movie.movieName || movie.title}
                    className="w-full h-full object-cover"
                    onError={e => e.target.style.display = 'none'}
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-4xl">🎬</span>
                  </div>
                )}
                {movie.trailer && (
                  <button
                    onClick={() => setActiveTrailer(movie.trailer)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <i className="bi bi-play-circle text-white text-4xl hover:text-red-400" />
                  </button>
                )}
              </div>

              {/* ── Text on the left ── */}
              <div className='absolute bottom-6 left-6 md:left-16 text-white w-[55%] md:w-[45%] z-10'>
                <p className='inline-block text-yellow-400 text-sm font-medium mb-1'>{releaseLabel}</p>
                <h1 className='font-bold text-3xl md:text-4xl leading-tight mb-2'>
                  {movie.movieName || movie.title}
                </h1>
                <p className='text-gray-300 text-xs md:text-sm line-clamp-2 mb-4'>
                  {movie.description || ''}
                </p>
                <button
                  onClick={() => navigate('/movieDetails', { state: { data: movie } })}
                  className='bg-red-500 hover:bg-white hover:text-red-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors'
                >
                  Get Ticket
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ── Trailer modal ── */}
      {activeTrailer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setActiveTrailer(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <iframe
              src={`${activeTrailer}?autoplay=1`}
              title="Movie Trailer"
              className="w-full h-full rounded-xl"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setActiveTrailer(null)}
              className="absolute -top-8 right-0 text-white text-2xl hover:text-red-400"
            >✖</button>
          </div>
        </div>
      )}
    </div>
  );
}
