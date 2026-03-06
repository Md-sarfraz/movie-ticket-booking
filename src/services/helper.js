import axios from "axios";
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
export const myAxios=axios.create({
    baseURL:BASE_URL
});

// Add request interceptor to automatically add auth token
myAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
myAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
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