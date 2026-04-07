import { ArrowLeft, QrCode, Download } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TMDB_IMAGE } from '../api/tmdb';
import { getBookingByCode } from '../services/storage';
import { formatDate, formatVND } from '../utils/formatters';

export function BookingSuccess() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const booking = useMemo(() => (code ? getBookingByCode(code) : undefined), [code]);
  const poster = TMDB_IMAGE(booking?.moviePoster ?? null, 'w500');

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-on-surface-variant">Không tìm thấy thông tin vé.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline font-bold"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute inset-0 bg-surface/80" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight text-primary uppercase">
            Đặt vé thành công!
          </h1>
          <p className="text-on-surface-variant font-body">Vé của bạn đã được xác nhận.</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,42,42,0.1)] border border-outline-variant/10">
          {/* Top: Movie Info */}
          <div className="p-8 pb-6 border-b border-dashed border-outline-variant/30 relative">
            <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-surface" />
            <div className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-surface" />

            <div className="flex flex-col gap-2">
              <span className="inline-block px-2 py-1 bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest rounded w-fit text-primary">
                CineVerse Cinema
              </span>
              <h2 className="text-2xl font-headline font-bold leading-tight">{booking.movieTitle}</h2>
            </div>
          </div>

          {/* Middle: Details */}
          <div className="p-8 py-6 grid grid-cols-2 gap-y-5 gap-x-4 border-b border-dashed border-outline-variant/30 relative">
            <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-surface" />
            <div className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-surface" />

            <div>
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold block mb-1">Ngày</span>
              <span className="font-headline font-bold">{formatDate(booking.date)}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold block mb-1">Giờ</span>
              <span className="font-headline font-bold">{booking.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold block mb-1">Khách hàng</span>
              <span className="font-headline font-bold text-sm">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold block mb-1">SĐT</span>
              <span className="font-headline font-bold text-sm">{booking.customerPhone}</span>
            </div>

            <div className="col-span-2 bg-surface-container-high p-4 rounded-lg flex justify-between items-center">
              <div>
                <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold block mb-1">Ghế</span>
                <span className="font-headline font-bold text-xl text-tertiary">
                  {booking.seats.join(', ')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold block mb-1">Tổng tiền</span>
                <span className="font-headline font-bold text-primary">{formatVND(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Bottom: QR + Code */}
          <div className="p-8 pt-6 flex flex-col items-center justify-center bg-white gap-3">
            <QrCode className="w-28 h-28 text-black" />
            <p className="text-black font-mono font-bold text-lg tracking-widest">{booking.bookingCode}</p>
            <p className="text-black/50 text-[10px] uppercase tracking-widest font-bold">
              Quét mã tại cổng vào
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="w-full py-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Tải vé về
          </button>
          <Link
            to="/"
            className="w-full py-4 text-on-surface-variant hover:text-on-surface font-headline font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
