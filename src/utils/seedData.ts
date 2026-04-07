import type { Hall, Showtime } from '../types';
import { isSeeded, saveHall, saveShowtime } from '../services/storage';

const HALLS: Hall[] = [
  {
    id: 'hall-1',
    name: 'Phòng 1 – Standard',
    rows: 8,
    cols: 10,
    seatLayout: {
      // Row H (front) – couple seats
      H5: 'couple',
      H6: 'couple',
      H7: 'couple',
      H8: 'couple',
      // Row G – VIP
      G3: 'vip', G4: 'vip', G5: 'vip', G6: 'vip', G7: 'vip', G8: 'vip',
    },
  },
  {
    id: 'hall-2',
    name: 'Phòng 2 – IMAX',
    rows: 10,
    cols: 14,
    seatLayout: {
      // Row J (front) – couple
      J7: 'couple', J8: 'couple', J9: 'couple', J10: 'couple',
      // Row I & H – VIP
      I3: 'vip', I4: 'vip', I5: 'vip', I6: 'vip', I7: 'vip',
      I8: 'vip', I9: 'vip', I10: 'vip', I11: 'vip', I12: 'vip',
      H3: 'vip', H4: 'vip', H5: 'vip', H6: 'vip', H7: 'vip',
      H8: 'vip', H9: 'vip', H10: 'vip', H11: 'vip', H12: 'vip',
    },
  },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

// Placeholder TMDB IDs — phimmoi nhất (will be replaced by real TMDB search in admin)
const SEED_SHOWTIMES: Omit<Showtime, 'id'>[] = [
  {
    movieId: 550,
    movieTitle: 'Fight Club',
    moviePoster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    date: fmt(today),
    time: '14:00',
    hallId: 'hall-1',
    prices: { standard: 90000, vip: 130000, couple: 220000 },
  },
  {
    movieId: 550,
    movieTitle: 'Fight Club',
    moviePoster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    date: fmt(today),
    time: '19:30',
    hallId: 'hall-2',
    prices: { standard: 110000, vip: 160000, couple: 280000 },
  },
  {
    movieId: 550,
    movieTitle: 'Fight Club',
    moviePoster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    date: fmt(addDays(today, 1)),
    time: '20:00',
    hallId: 'hall-1',
    prices: { standard: 90000, vip: 130000, couple: 220000 },
  },
  {
    movieId: 27205,
    movieTitle: 'Inception',
    moviePoster: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    date: fmt(today),
    time: '17:00',
    hallId: 'hall-1',
    prices: { standard: 90000, vip: 130000, couple: 220000 },
  },
  {
    movieId: 27205,
    movieTitle: 'Inception',
    moviePoster: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    date: fmt(addDays(today, 2)),
    time: '21:00',
    hallId: 'hall-2',
    prices: { standard: 110000, vip: 160000, couple: 280000 },
  },
];

export const initSeedData = () => {
  if (isSeeded()) return;
  HALLS.forEach(saveHall);
  SEED_SHOWTIMES.forEach((s, i) =>
    saveShowtime({ ...s, id: `st-seed-${i + 1}` })
  );
};
