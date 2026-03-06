import React, { useEffect, useState } from 'react'
import SearchBar from '@/components/searchbar';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";
import ConfirmationCard from '@/components/confirmationCard';
import { myAxios } from '../../../services/helper';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"







const MovieList = () => {
  const navigate = useNavigate();
  const [date, setDate] = React.useState();
  const [dateOpen, setDateOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const moviesPerPage = 8;


  const fetchMovies = async () => {
    try {
      const response = await myAxios.get("/movie/findAllMovie");
      console.log("response is-", response);
      setMovies(response.data.data); // Extract movies from ApiResponse wrapper
    } catch (error) {
      console.error("Error fetching movies:", error.response ? error.response.data : error.message);
    }
  };



  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    console.log("date:", date);
    setDateOpen(!dateOpen)
  }, [date])


  // Filter movies based on search term
  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  // Handle delete confirmation
  const confirmDelete = (movie) => {
    setSelectedMovie(movie);
    setShowConfirm(true);
  };

  // Handle theater deletion
  const handleDelete = async () => {
    if (!selectedMovie) return;

    try {
      const response = await myAxios.delete(`/movie/deleteMovie/${selectedMovie.movieId}`);

      if (response.status === 200) {
        setShowConfirm(false);
        setSelectedMovie(null);
        fetchMovies(); // Refresh list
      } else {
        alert("Failed to delete movie.");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 p-6'>
      {/* Header Section */}
      <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>
              Movie<span className='text-red-500'>List</span>
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Manage and view all movies ({filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'})
            </p>
          </div>
          <button 
            onClick={() => navigate('/adminDashboard/addMovie')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg w-fit"
          >
            <Plus size={18} />
            Add New Movie
          </button>
        </div>

        {/* Search Bar */}
        <div className='w-full'>
          <SearchBar 
            className='w-full' 
            placeholder="Search by title, genre, or language..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      {/* Movie Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div key={movie.movieId} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              {/* Movie Image */}
              <div className="relative w-full h-52 overflow-hidden group">
                <img 
                  src={movie.postUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-3">
                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      onClick={() => confirmDelete(movie)}
                      title="Delete Movie"
                    >
                      <RiDeleteBin6Line className="text-lg" />
                    </button>

                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      title="Edit Movie"
                    >
                      <RiEdit2Line className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Confirmation Card */}
              {showConfirm && selectedMovie?.movieId === movie.movieId && (
                <ConfirmationCard
                  title="Delete Movie"
                  message={`Are you sure you want to delete "${selectedMovie?.title}"?`}
                  onConfirm={handleDelete}
                  onCancel={() => setShowConfirm(false)}
                />
              )}

              {/* Movie Details */}
              <div className="p-3">
                <h2 className="text-sm font-bold text-gray-800 mb-1.5 truncate" title={movie.title}>
                  {movie.title}
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Genre:</span>
                    <span className="font-medium text-gray-700">{movie.genre}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Language:</span>
                    <span className="font-medium text-gray-700">{movie.language}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-700">{movie.duration} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Release:</span>
                    <span className="font-medium text-gray-700">{movie.releaseDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Plus size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              {movies.length === 0 ? 'No movies available' : 'No movies found matching your search'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {movies.length === 0 ? 'Add your first movie to get started' : 'Try adjusting your search criteria'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {filteredMovies.length > moviesPerPage && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all font-medium"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-11 h-11 rounded-lg transition-all font-medium ${
                    currentPage === page
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieList