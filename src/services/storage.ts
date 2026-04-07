import type { Booking, Hall, Showtime, SeatType, TmdbMovie } from '../types';

const KEYS = {
  HALLS: 'cv_halls',
  SHOWTIMES: 'cv_showtimes',
  BOOKINGS: 'cv_bookings',
  FEATURED: 'cv_featured',
} as const;

// ── Halls ────────────────────────────────────────────────
export const getHalls = (): Hall[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.HALLS) || '[]');
  } catch {
    return [];
  }
};

export const saveHall = (hall: Hall): void => {
  const halls = getHalls();
  const idx = halls.findIndex((h) => h.id === hall.id);
  if (idx >= 0) halls[idx] = hall;
  else halls.push(hall);
  localStorage.setItem(KEYS.HALLS, JSON.stringify(halls));
};

export const deleteHall = (id: string): void => {
  localStorage.setItem(KEYS.HALLS, JSON.stringify(getHalls().filter((h) => h.id !== id)));
};

// ── Showtimes ────────────────────────────────────────────
export const getShowtimes = (): Showtime[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SHOWTIMES) || '[]');
  } catch {
    return [];
  }
};

export const saveShowtime = (showtime: Showtime): void => {
  const list = getShowtimes();
  const idx = list.findIndex((s) => s.id === showtime.id);
  if (idx >= 0) list[idx] = showtime;
  else list.push(showtime);
  localStorage.setItem(KEYS.SHOWTIMES, JSON.stringify(list));
};

export const deleteShowtime = (id: string): void => {
  localStorage.setItem(KEYS.SHOWTIMES, JSON.stringify(getShowtimes().filter((s) => s.id !== id)));
};

// ── Bookings ─────────────────────────────────────────────
export const getBookings = (): Booking[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
  } catch {
    return [];
  }
};

export const saveBooking = (booking: Booking): void => {
  const list = getBookings();
  list.unshift(booking);
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(list));
};

export const cancelBooking = (id: string): void => {
  const list = getBookings().map((b) =>
    b.id === id ? { ...b, status: 'cancelled' as const } : b
  );
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(list));
};

export const getBookingByCode = (code: string): Booking | undefined =>
  getBookings().find((b) => b.bookingCode === code);

// ── Seat helpers ──────────────────────────────────────────
export const getBookedSeats = (showtimeId: string): string[] =>
  getBookings()
    .filter((b) => b.showtimeId === showtimeId && b.status === 'confirmed')
    .flatMap((b) => b.seats ?? []);

export const getSeatType = (hall: Hall, seatId: string): SeatType =>
  (hall?.seatLayout?.[seatId]) ?? 'standard';

// ── Seed check ────────────────────────────────────────────
export const isSeeded = (): boolean =>
  localStorage.getItem(KEYS.HALLS) !== null;

// ── Featured Movie (Hero Banner) ──────────────────────────
export const getFeaturedMovie = (): TmdbMovie | null => {
  try {
    const data = localStorage.getItem(KEYS.FEATURED);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setFeaturedMovie = (movie: TmdbMovie): void => {
  localStorage.setItem(KEYS.FEATURED, JSON.stringify(movie));
};

export const clearFeaturedMovie = (): void => {
  localStorage.removeItem(KEYS.FEATURED);
};
