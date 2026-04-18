import axios from "axios";
import { clearAuthStorage, getStoredAuth } from '../auth/storage';
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
export const myAxios=axios.create({
    baseURL:BASE_URL
});

// Add request interceptor to automatically add auth token
myAxios.interceptors.request.use(
    (config) => {
        const { token } = getStoredAuth();
        if (token) {
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
            // Clear expired/invalid token but let UI decide how to recover.
            clearAuthStorage();
            error.isAuthExpired = true;
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('bookshow:auth-expired', {
                    detail: { url: error.config?.url || '' }
                }));
            }
        }
        return Promise.reject(error);
    }
);