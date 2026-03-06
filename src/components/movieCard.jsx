import React from 'react'
import { useNavigate } from 'react-router-dom'

const MovieCard = (props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/movieDetails', { state: { data: props.movieItem } });
  };

  const rating  = props.movieItem?.rating ?? null;
  const genres  = props.movieItem?.genres;
  const genreText = Array.isArray(genres) && genres.length
    ? genres.slice(0, 3).join(' / ')
    : (props.movieItem?.language || '');

  const imgSrc = props.image && props.image.startsWith('http')
    ? props.image
    : `./images/${props.image || 'card-slider-img1.avif'}`;

  return (
    <div className='cursor-pointer group w-full' onClick={handleNavigate}>

      {/* ── Poster card ── */}
      <div className='relative w-full rounded-lg overflow-hidden shadow-md'
           style={{ aspectRatio: '2/3' }}>

        <img
          src={imgSrc}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          alt={props.movieName}
          onError={e => { e.target.src = './images/card-slider-img1.avif'; }}
        />

        {/* Rating bar */}
        {rating !== null && (
          <div className='absolute bottom-0 left-0 right-0 bg-black/85 flex items-center gap-2 px-3 py-2.5'>
            <i className='bi bi-star-fill text-yellow-400 text-[13px]'></i>
            <span className='text-white text-[13px] font-semibold tracking-wide'>
              {Number(rating).toFixed(1)}/10
            </span>
          </div>
        )}
      </div>

      {/* ── Info below card ── */}
      <div className='mt-2.5 px-0.5'>
        <h3 className='text-lg font-bold text-gray-900 leading-snug line-clamp-2'>
          {props.movieName}
        </h3>
        {genreText && (
          <p className='text-sm text-gray-500 mt-1 line-clamp-1'>{genreText}</p>
        )}
      </div>

    </div>
  );
};

export default MovieCard