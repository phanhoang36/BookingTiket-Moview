import type {
  TmdbCastMember,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbPaginatedResponse,
  TmdbVideo,
} from '../types';
import { tmdbClient } from './tmdb';

export const getNowPlaying = (page = 1) =>
  tmdbClient
    .get<TmdbPaginatedResponse<TmdbMovie>>('/movie/now_playing', { params: { page } })
    .then((r) => r.data);

export const getPopular = (page = 1) =>
  tmdbClient
    .get<TmdbPaginatedResponse<TmdbMovie>>('/movie/popular', { params: { page } })
    .then((r) => r.data);

export const getUpcoming = (page = 1) =>
  tmdbClient
    .get<TmdbPaginatedResponse<TmdbMovie>>('/movie/upcoming', { params: { page } })
    .then((r) => r.data);

export const getMovieDetail = (id: number) =>
  tmdbClient.get<TmdbMovieDetail>(`/movie/${id}`).then((r) => r.data);

export const getMovieVideos = (id: number) =>
  tmdbClient
    .get<{ id: number; results: TmdbVideo[] }>(`/movie/${id}/videos`, {
      params: { language: 'en-US' },
    })
    .then((r) => r.data.results);

export const getMovieCredits = (id: number) =>
  tmdbClient
    .get<{ id: number; cast: TmdbCastMember[] }>(`/movie/${id}/credits`)
    .then((r) => r.data.cast.slice(0, 10));

export const searchMovies = (query: string, page = 1) =>
  tmdbClient
    .get<TmdbPaginatedResponse<TmdbMovie>>('/search/movie', { params: { query, page } })
    .then((r) => r.data);
