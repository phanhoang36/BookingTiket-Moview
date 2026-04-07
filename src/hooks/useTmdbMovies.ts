import { useQuery } from '@tanstack/react-query';
import {
  getMovieCredits,
  getMovieDetail,
  getMovieVideos,
  getNowPlaying,
  getPopular,
  getUpcoming,
  searchMovies,
} from '../api/movies';

export const useNowPlaying = (page = 1) =>
  useQuery({
    queryKey: ['nowPlaying', page],
    queryFn: () => getNowPlaying(page),
    staleTime: 5 * 60 * 1000,
  });

export const usePopular = (page = 1) =>
  useQuery({
    queryKey: ['popular', page],
    queryFn: () => getPopular(page),
    staleTime: 5 * 60 * 1000,
  });

export const useUpcoming = (page = 1) =>
  useQuery({
    queryKey: ['upcoming', page],
    queryFn: () => getUpcoming(page),
    staleTime: 5 * 60 * 1000,
  });

export const useMovieDetail = (id: number | null) =>
  useQuery({
    queryKey: ['movieDetail', id],
    queryFn: () => getMovieDetail(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useMovieVideos = (id: number | null) =>
  useQuery({
    queryKey: ['movieVideos', id],
    queryFn: () => getMovieVideos(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useMovieCredits = (id: number | null) =>
  useQuery({
    queryKey: ['movieCredits', id],
    queryFn: () => getMovieCredits(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useSearchMovies = (query: string, page = 1) =>
  useQuery({
    queryKey: ['searchMovies', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.trim().length >= 2,
    staleTime: 2 * 60 * 1000,
  });
