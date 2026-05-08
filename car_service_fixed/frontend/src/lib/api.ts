import axios from 'axios';

const BASE =
    process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
        : '/api/v1'; // uses next.config.ts rewrite in dev

export const api = axios.create({
    baseURL: BASE,
    headers: {'Content-Type': 'application/json'},
    timeout: 12_000,
    withCredentials: true, // FIX: send cookies for CORS with credentials
});

// Attach JWT from localStorage on every request
api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally — clear token and redirect
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            document.cookie = 'access_token=; path=/; max-age=0';
            // Only redirect if not already on auth page
            if (!window.location.pathname.startsWith('/auth')) {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(err);
    },
);
