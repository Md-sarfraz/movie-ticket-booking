import React from 'react';

const Searchbar = () => {
    return (
        <div className="w-[980px]">
            <label htmlFor="movie-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search movie
            </label>
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>

                {/* Input Field */}
                <input
                    type="search"
                    id="movie-search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg 
                    bg-gray-50 focus:ring-red-500 focus:border-red-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-red-500 dark:focus:border-red-500"
                    placeholder="Search movies"
                    required
                />

                {/* Search Button */}
                <button
                    type="submit"
                    className="text-white absolute right-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 
                    focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 
                    dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Searchbar;
