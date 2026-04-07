import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

export const tmdbClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

tmdbClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: API_KEY,
    language: 'vi-VN',
  };
  return config;
});

tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[TMDB API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const TMDB_IMAGE = (path: string | null, size: 'w300' | 'w500' | 'original' = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
