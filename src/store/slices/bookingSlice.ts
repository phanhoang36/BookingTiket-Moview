import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SeatType } from '../../types';

interface BookingState {
  showtimeId: string | null;
  selectedSeats: string[];
  seatTypes: Record<string, SeatType>;
  priceMap: Record<SeatType, number>;
}

const initialState: BookingState = {
  showtimeId: null,
  selectedSeats: [],
  seatTypes: {},
  priceMap: { standard: 0, vip: 0, couple: 0 },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setShowtime(
      state,
      action: PayloadAction<{
        showtimeId: string;
        priceMap: Record<SeatType, number>;
      }>
    ) {
      // Reset seats when switching showtime
      state.showtimeId = action.payload.showtimeId;
      state.priceMap = action.payload.priceMap;
      state.selectedSeats = [];
      state.seatTypes = {};
    },
    toggleSeat(
      state,
      action: PayloadAction<{ seatId: string; seatType: SeatType }>
    ) {
      const { seatId, seatType } = action.payload;
      if (state.selectedSeats.includes(seatId)) {
        state.selectedSeats = state.selectedSeats.filter((s) => s !== seatId);
        delete state.seatTypes[seatId];
      } else {
        state.selectedSeats.push(seatId);
        state.seatTypes[seatId] = seatType;
      }
    },
    clearBooking(state) {
      state.showtimeId = null;
      state.selectedSeats = [];
      state.seatTypes = {};
      state.priceMap = { standard: 0, vip: 0, couple: 0 };
    },
  },
});

export const { setShowtime, toggleSeat, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

// Selectors
export const selectTotalAmount = (state: { booking: BookingState }): number =>
  state.booking.selectedSeats.reduce((total, seatId) => {
    const type = state.booking.seatTypes[seatId] ?? 'standard';
    return total + (state.booking.priceMap[type] ?? 0);
  }, 0);
