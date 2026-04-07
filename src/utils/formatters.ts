import dayjs from 'dayjs';

export const formatVND = (amount: number): string => {
  if (!Number.isFinite(amount)) return '0 ₫';
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const generateBookingCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CV-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export const formatDate = (date: string): string =>
  dayjs(date).format('DD/MM/YYYY');

export const formatDateLong = (date: string): string =>
  dayjs(date).format('dddd, DD MMMM YYYY');

export const getRowLabel = (rowIndex: number): string =>
  String.fromCharCode(65 + rowIndex); // 0→A, 1→B, ...

export const getSeatLabel = (rowIndex: number, col: number): string =>
  `${getRowLabel(rowIndex)}${col}`;

export const runtime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}g ${m}p` : `${m}p`;
};
