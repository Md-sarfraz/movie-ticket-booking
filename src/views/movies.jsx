import Banner from '@/components/banner'
import FilterBox from '@/components/filterBox'
import React, { useEffect, useState } from 'react'
import { FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { myAxios } from '@/services/helper'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setSearchInput } from '@/store/slices/searchSlice';
import PaginationDesign from '@/components/paginationDesign';

const Movies = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [selectedFormat, setSelectedFormat] = useState("All");
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Show 12 movies per page
    
    // --------------searching------------

    // const dispatch = useDispatch();
    const searchInput = useSelector((state) => state.search.searchInput);
    const selectedCity = useSelector((state) => state.city.selectedCity);

    const searchMovie = async () => {
        try {
            const response = await myAxios.get(
                `/movie/searchByTitle?title=${searchInput?.toString()}`
            );
            setMovies(response.data.data);
        } catch (error) {
            console.error("Error searching movies:", error);
        }
    };

    // for filter
    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();

            if (selectedLanguage !== "All") params.append("language", selectedLanguage);
            if (selectedGenre !== "All") params.append("genre", selectedGenre);
            if (selectedFormat !== "All") params.append("format", selectedFormat);

            const response = await myAxios.get(
                `/movie/filter?${params.toString()}`
            );
            setMovies(response.data.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setError("Failed to load movies. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const query = searchInput?.toString().trim();
        if (query) {
            searchMovie();
        } else {
            fetchMovies();
        }

        setCurrentPage(1); // Reset to first page when filters/search change
        console.log("Selected Filters:", { selectedLanguage, selectedGenre, selectedFormat });
    }, [selectedLanguage, selectedGenre, selectedFormat, searchInput]);
    
    const navigate = useNavigate();
    const handleClick = (movie) => {
        navigate("/movieDetails", {
            state: {
                data: movie
            }
        })
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovies = movies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(movies.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of movies section
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    return (
        <div className='bg-[#f5f5f5]'>
            <Banner heading="Movies" paragraph="Find & Book Your Favorite Movies – Anytime, Anywhere!" />
            <div className='flex flex-row'>
                {/* Sidebar Filters */}
                <div className='w-[23%] flex flex-col pt-14'>
                    <h1 className='text-xl font-bold pl-4'>Filter By</h1>
                    <div className='flex flex-col gap-3 justify-center items-center pt-4'>
                        <FilterBox
                            title="Languages"
                            options={["All", "Telugu", "English", "Hindi", "Malayalam", "Tamil", "Bengali", "Korean", "Persian"]}
                            selectedOption={selectedLanguage}
                            setSelectedOption={setSelectedLanguage}
                        />
                        <FilterBox
                            title="Genres"
                            options={["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Family", "Adventure", "Thriller"]}
                            selectedOption={selectedGenre}
                            setSelectedOption={setSelectedGenre}
                        />
                        <FilterBox
                            title="Format"
                            options={["All", "2D", "3D", "IMAX", "4DX"]}
                            selectedOption={selectedFormat}
                            setSelectedOption={setSelectedFormat}
                        />
                    </div>
                </div>

                {/* Movies List */}
                <div className='w-[77%] pt-14'>
                    <h1 className='text-xl font-bold pl-4 pb-4'>Movies In <span className='text-red-500'>{selectedCity?.name || 'Your City'}</span></h1>
                    <div className='flex flex-col  items-center'>

                        <img src="./images/coming-soon-banner.avif" className='w-[97%] h-[70px] ' alt="" />
                    </div>

                    <div className="flex flex-wrap justify-center items-center ml-3 gap-4 mt-14 pb-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 w-full gap-4">
                                <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                <p className="text-gray-500 font-medium">Loading movies...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-24 w-full gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <p className="text-red-500 font-semibold text-lg">{error}</p>
                                <button
                                    onClick={fetchMovies}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : currentMovies.length > 0 ? (
                            currentMovies.map((movie) => (
                                <div key={movie.id} className="w-56 h-[350px] bg-white rounded-xl overflow-hidden shadow-lg pb-3">
                                    {/* Movie Image */}
                                    <div className="relative w-full flex justify-center items-center pt-2">
                                        <div className="relative w-52 h-52 group">
                                            <img
                                                src={movie.postUrl}
                                                alt={movie.title}
                                                className="w-full h-full rounded-lg object-cover"
                                            />
                                            <div className="absolute rounded-lg inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                                <button className="mb-2 px-4 py-3 text-[10px] bg-[#d9871c] hover:bg-transparent hover:border hover:border-[#d9871c] text-white rounded-md 
                                                    transform -translate-x-5 group-hover:translate-x-0 transition-transform duration-500 ease-in-out"
                                                    onClick={() => setTrailerUrl(movie.trailer)}
                                                >
                                                    VIEW TRAILER
                                                </button>
                                                <button className="px-4 py-3 text-[10px] border border-[#d9871c] text-white rounded-md hover:bg-[#d9871c] hover:border-none 
                                                    transform translate-x-5 group-hover:translate-x-0 transition-transform duration-500 ease-in-out"
                                                    onClick={() => handleClick(movie)}
                                                >
                                                    VIEW DETAILS
                                                </button>

                                                {trailerUrl && (
                                                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                                                        <div className="relative w-full max-w-4xl h-96">
                                                            <iframe
                                                                src={trailerUrl}
                                                                title={`${movie.title} Trailer`}
                                                                className="w-full h-full"
                                                                frameBorder="0"
                                                                allow="autoplay; encrypted-media"
                                                                allowFullScreen
                                                            ></iframe>
                                                            <button
                                                                onClick={() => setTrailerUrl(null)}
                                                                className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
                                                            >
                                                                ✖
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>

                                    {/* Movie Details */}
                                    <div className="bg-white px-4 py-3 relative">
                                        <h2 className="text-lg font-semibold">{movie.title}</h2>
                                        <p className="text-sm text-gray-500">Genre: {movie.genre}</p>

                                        {/* Rating Section */}
                                        <div className="flex items-center mt-2 text-[#d9871c]">
                                            {[...Array(5)].map((_, index) => {
                                                if (movie.rating >= index + 1) {
                                                    return <FaStar key={index} />;
                                                } else if (movie.rating >= index + 0.5) {
                                                    return <FaStarHalfAlt key={index} />;
                                                } else {
                                                    return <FaRegStar key={index} />;
                                                }
                                            })}
                                        </div>

                                        {/* Shopping Cart Button */}
                                        <div className="flex mt-3 absolute top-14 right-6">
                                            <button className="p-3 border border-gray-200 rounded-lg text-[#d9871c] hover:bg-[#d9871c] hover:text-white transition"
                                                onClick={() => handleClick(movie)}
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    </div>


                                </div>
                                
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 w-full gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-3xl">🎬</span>
                                </div>
                                <p className="text-gray-600 font-semibold text-lg">No movies found</p>
                                <p className="text-gray-400 text-sm">Try changing the filters or check back later.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination - only show if there are movies and multiple pages */}
                    {movies.length > 0 && totalPages > 1 && (
                        <PaginationDesign 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Movies;