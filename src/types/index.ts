export type SeatType = 'standard' | 'vip' | 'couple';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface Hall {
  id: string;
  name: string;
  rows: number;
  cols: number;
  seatLayout: Record<string, SeatType>;
}

export interface Showtime {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  date: string;
  time: string;
  hallId: string;
  prices: {
    standard: number;
    vip: number;
    couple: number;
  };
}

export interface Booking {
  id: string;
  bookingCode: string;
  showtimeId: string;
  movieId: number;
  movieTitle: string;
  moviePoster?: string;
  date: string;
  time: string;
  hallId: string;
  seats: string[];
  seatTypes: Record<string, SeatType>;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

// TMDB API types
export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
}

export interface TmdbMovieDetail extends Omit<TmdbMovie, 'genre_ids'> {
  genres: { id: number; name: string }[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
