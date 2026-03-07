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

// Upload a single image to Cloudinary (for pre-upload before bulk create)
export const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await myAxios.post('/cloudinary/upload/simple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.secure_url || response.data.url || response.data.imageUrl;
};

// Create multiple movies in bulk (all images must be pre-uploaded URLs)
export const createBulkMovies = async (movies) => {
    const response = await myAxios.post('/movie/createBulk', movies);
    return response.data;
};
