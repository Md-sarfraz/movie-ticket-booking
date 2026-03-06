import { myAxios } from "./helper";

// Fetch top-rated movies
export const getTopRatedMovies = async () => {
    try {
        const response = await myAxios.get('/movie/top-rated');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching top-rated movies:', error);
        throw error;
    }
};

// Fetch trending movies
export const getTrendingMovies = async () => {
    try {
        const response = await myAxios.get('/movie/trending');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        throw error;
    }
};

// Fetch popular movies
export const getPopularMovies = async () => {
    try {
        const response = await myAxios.get('/movie/popular');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};
