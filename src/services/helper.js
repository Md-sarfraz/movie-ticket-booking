import axios from "axios";
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
export const myAxios=axios.create({
    baseURL:BASE_URL
});

// Add request interceptor to automatically add auth token
myAxios.interceptors.request.use(
    (config) => {
        // Debug localStorage contents
        console.log('🔍 ALL localStorage keys:', Object.keys(localStorage));
        console.log('🔍 ALL localStorage values:', Object.entries(localStorage));
        
        const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
        console.log('🔑 Token from localStorage:', token);
        console.log('🔑 Token type:', typeof token);
        console.log('📤 Request URL:', config.url);
        console.log('📤 Request Headers Before:', config.headers);
        
        if (token && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Added Authorization header');
        } else {
            console.warn('⚠️ No valid token found in localStorage');
            console.warn('⚠️ Token value:', token);
        }
        
        console.log('📤 Final Request Headers:', config.headers);
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
myAxios.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.status, response.statusText);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error.response?.status, error.response?.statusText);
        console.error('❌ Error data:', error.response?.data);
        
        if (error.response?.status === 401) {
            console.warn('🔐 Unauthorized - token might be invalid');
            // Only auto-redirect for auth endpoints, let components handle their own 401s
            const isAuthEndpoint = error.config?.url?.includes('/auth/');
            if (isAuthEndpoint) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');
                window.location.href = '/loginPage';
            }
        }
        return Promise.reject(error);
    }
);