import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TMDB_IMAGE } from '../api/tmdb';
import { SeatMap } from '../components/SeatMap/SeatMap';
import { getBookedSeats, getHalls, getShowtimes } from '../services/storage';
import { toggleSeat, setShowtime, selectTotalAmount } from '../store/slices/bookingSlice';
import type { RootState } from '../store';
import type { SeatType } from '../types';
import { formatVND, formatDate } from '../utils/formatters';
import { toast } from 'sonner';

export function SeatSelection() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showtime = useMemo(
    () => getShowtimes().find((s) => s.id === showtimeId),
    [showtimeId]
  );
  const hall = useMemo(
    () => (showtime ? getHalls().find((h) => h.id === showtime.hallId) : undefined),
    [showtime]
  );
  const bookedSeats = useMemo(
    () => (showtimeId ? getBookedSeats(showtimeId) : []),
    [showtimeId]
  );

  const reduxShowtimeId = useSelector((s: RootState) => s.booking.showtimeId);
  const selectedSeats = useSelector((s: RootState) => s.booking.selectedSeats);
  const totalAmount = useSelector(selectTotalAmount);

  // Sync Redux when navigating to a new showtime (must be in useEffect, NOT render body)
  useEffect(() => {
    if (showtime && reduxShowtimeId !== showtimeId) {
      dispatch(setShowtime({ showtimeId: showtime.id, priceMap: showtime.prices }));
    }
  }, [showtime, showtimeId, reduxShowtimeId, dispatch]);

  const poster = TMDB_IMAGE(showtime?.moviePoster ?? null, 'w500');

  const handleToggle = (seatId: string, seatType: SeatType) => {
    dispatch(toggleSeat({ seatId, seatType }));
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ghế!');
      return;
    }
    navigate(`/booking/${showtimeId}/info`);
  };

  if (!showtime || !hall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-on-surface-variant font-body text-lg">Không tìm thấy suất chiếu.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline font-bold"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-12 px-8 max-w-screen-2xl mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left: Seat Map */}
      <div className="lg:col-span-8 flex flex-col items-center">
        <SeatMap
          hall={hall}
          bookedSeats={bookedSeats}
          selectedSeats={selectedSeats}
          onToggle={handleToggle}
        />
      </div>

      {/* Right: Summary */}
      <aside className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl shadow-2xl sticky top-24">
          {/* Movie poster */}
          <div className="aspect-[2/3] w-full mb-6 overflow-hidden rounded-lg">
            {poster ? (
              <img src={poster} alt={showtime.movieTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface/20 text-sm">
                No Poster
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-primary font-headline text-[10px] uppercase tracking-[0.3em] font-bold">
                Đang đặt
              </span>
              <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight mt-1 leading-tight">
                {showtime.movieTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-high p-3 rounded">
                <span className="text-[10px] uppercase tracking-widest text-on-surface/40 block mb-1">Ngày</span>
                <span className="font-headline font-bold text-sm">{formatDate(showtime.date)}</span>
              </div>
              <div className="bg-surface-container-high p-3 rounded">
                <span className="text-[10px] uppercase tracking-widest text-on-surface/40 block mb-1">Giờ</span>
                <span className="font-headline font-bold text-sm">{showtime.time}</span>
              </div>
              <div className="bg-surface-container-high p-3 rounded col-span-2">
                <span className="text-[10px] uppercase tracking-widest text-on-surface/40 block mb-1">Phòng</span>
                <span className="font-headline font-bold text-sm">{hall.name}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex justify-between items-start">
                <span className="text-on-surface/60 font-label text-sm">Ghế đã chọn</span>
                <span className="text-tertiary font-headline font-bold text-right max-w-[60%] break-words">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface/60 font-label text-sm">Số lượng</span>
                <span className="font-headline font-bold">{selectedSeats.length} vé</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <span className="text-on-surface font-label font-bold">Tổng tiền</span>
                <span className="text-2xl font-headline font-bold text-primary">
                  {formatVND(totalAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="w-full py-4 bg-primary-container text-on-primary-container font-headline font-bold text-lg rounded-lg shadow-[0_10px_40px_rgba(255,84,73,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Tiếp tục →
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
