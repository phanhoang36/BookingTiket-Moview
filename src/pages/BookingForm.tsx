import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { TMDB_IMAGE } from '../api/tmdb';
import { saveBooking, getShowtimes, getHalls } from '../services/storage';
import { clearBooking, selectTotalAmount } from '../store/slices/bookingSlice';
import type { RootState } from '../store';
import type { Booking } from '../types';
import { formatVND, formatDate, generateBookingCode } from '../utils/formatters';

const schema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập họ tên (ít nhất 2 ký tự)'),
  customerPhone: z
    .string()
    .regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ (VD: 0901234567)'),
  customerEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function BookingForm() {
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

  const selectedSeats = useSelector((s: RootState) => s.booking.selectedSeats);
  const seatTypes = useSelector((s: RootState) => s.booking.seatTypes);
  const totalAmount = useSelector(selectTotalAmount);
  const poster = TMDB_IMAGE(showtime?.moviePoster ?? null, 'w500');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    if (!showtime || selectedSeats.length === 0) {
      toast.error('Không có thông tin đặt vé. Vui lòng thử lại.');
      navigate('/');
      return;
    }

    const bookingCode = generateBookingCode();
    const booking: Booking = {
      id: uuidv4(),
      bookingCode,
      showtimeId: showtime.id,
      movieId: showtime.movieId,
      movieTitle: showtime.movieTitle,
      moviePoster: showtime.moviePoster,
      date: showtime.date,
      time: showtime.time,
      hallId: showtime.hallId,
      seats: [...selectedSeats],
      seatTypes: { ...seatTypes },
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);
    dispatch(clearBooking());
    toast.success('Đặt vé thành công! 🎉');
    navigate(`/booking/success/${bookingCode}`);
  };

  if (!showtime || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-on-surface-variant">Không có thông tin đặt vé.</p>
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
    <main className="pt-24 pb-16 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-8 uppercase tracking-wide">
        Thông Tin Đặt Vé
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-surface-container-low/60 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10 space-y-6">
              <h2 className="font-headline text-tertiary text-sm uppercase tracking-widest font-bold">
                Thông tin khách hàng
              </h2>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface-variant">
                  Họ và tên <span className="text-primary">*</span>
                </label>
                <input
                  {...register('customerName')}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-high border border-outline-variant/20 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.customerName && (
                  <p className="text-xs text-primary">{errors.customerName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface-variant">
                  Số điện thoại <span className="text-primary">*</span>
                </label>
                <input
                  {...register('customerPhone')}
                  placeholder="0901234567"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-high border border-outline-variant/20 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.customerPhone && (
                  <p className="text-xs text-primary">{errors.customerPhone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface-variant">Email (tuỳ chọn)</label>
                <input
                  {...register('customerEmail')}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-high border border-outline-variant/20 text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.customerEmail && (
                  <p className="text-xs text-primary">{errors.customerEmail.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-primary text-on-primary font-headline font-bold text-lg uppercase tracking-wider rounded-xl shadow-[0_10px_40px_rgba(255,84,73,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-60"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-5">
          <div className="bg-surface-container-low p-8 rounded-xl sticky top-24 space-y-6">
            <h2 className="font-headline text-tertiary text-sm uppercase tracking-widest font-bold">
              Tóm tắt đơn hàng
            </h2>

            <div className="flex gap-4">
              {poster && (
                <img
                  src={poster}
                  alt={showtime.movieTitle}
                  className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex flex-col justify-center gap-1.5">
                <h3 className="font-headline font-bold text-lg text-on-surface leading-snug">
                  {showtime.movieTitle}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {formatDate(showtime.date)} • {showtime.time}
                </p>
                <p className="text-sm text-on-surface-variant">{hall?.name}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-white/5 pt-4">
              <div className="flex justify-between">
                <span className="text-on-surface/60 text-sm">Ghế</span>
                <span className="text-tertiary font-bold text-sm text-right max-w-[60%] break-words">
                  {selectedSeats.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface/60 text-sm">Số vé</span>
                <span className="font-bold text-sm">{selectedSeats.length}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3">
                <span className="text-on-surface font-bold">Tổng tiền</span>
                <span className="text-2xl font-headline font-bold text-primary">
                  {formatVND(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
