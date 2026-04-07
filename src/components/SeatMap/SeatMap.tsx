import { cn } from '../../lib/utils';
import type { Hall, SeatType } from '../../types';
import { getSeatType } from '../../services/storage';
import { getRowLabel } from '../../utils/formatters';

interface SeatMapProps {
  hall: Hall;
  bookedSeats: string[];
  selectedSeats: string[];
  onToggle: (seatId: string, seatType: SeatType) => void;
}

const SEAT_COLORS: Record<string, string> = {
  available_standard: 'bg-surface-container-highest hover:bg-on-surface/20 cursor-pointer hover:scale-110',
  available_vip: 'bg-tertiary/70 hover:bg-tertiary cursor-pointer hover:scale-110',
  available_couple: 'bg-primary/60 hover:bg-primary cursor-pointer hover:scale-110',
  selected: 'bg-primary-container shadow-[0_0_15px_rgba(255,84,73,0.5)] ring-1 ring-primary/60 cursor-pointer scale-105',
  booked: 'bg-surface-container-lowest border border-white/10 cursor-not-allowed opacity-40',
};

export function SeatMap({ hall, bookedSeats, selectedSeats, onToggle }: SeatMapProps) {
  const { rows, cols } = hall;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Screen */}
      <div className="w-full max-w-2xl mb-8 relative" style={{ perspective: '1000px' }}>
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-80 shadow-[0_-20px_80px_-10px_rgba(255,255,255,0.2)]" />
        <p className="text-center text-on-surface/30 font-headline text-[10px] uppercase tracking-[0.4em] mt-3">
          Màn hình chiếu
        </p>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto w-full pb-4 no-scrollbar">
        <div className="flex flex-col gap-2.5 min-w-max mx-auto w-fit">
          {Array.from({ length: rows }, (_, rowIdx) => {
            const rowLabel = getRowLabel(rowIdx);
            const opacity = `opacity-${100 - rowIdx * 8}`;
            return (
              <div key={rowLabel} className={cn('flex items-center gap-2', rowIdx >= 5 && 'opacity-70')}>
                {/* Row label */}
                <span className="w-6 text-on-surface/30 font-headline text-xs text-right select-none">
                  {rowLabel}
                </span>

                {/* Seats */}
                <div className="flex gap-1.5">
                  {Array.from({ length: cols }, (_, colIdx) => {
                    const col = colIdx + 1;
                    const seatId = `${rowLabel}${col}`;
                    const seatType = getSeatType(hall, seatId);
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    let colorClass: string;
                    let title: string;
                    if (isBooked) {
                      colorClass = SEAT_COLORS.booked;
                      title = 'Đã đặt';
                    } else if (isSelected) {
                      colorClass = SEAT_COLORS.selected;
                      title = `${seatId} – Đã chọn`;
                    } else {
                      colorClass = SEAT_COLORS[`available_${seatType}`];
                      title = `${seatId} – ${seatType === 'vip' ? 'VIP' : seatType === 'couple' ? 'Đôi' : 'Thường'}`;
                    }

                    return (
                      <div
                        key={seatId}
                        title={title}
                        onClick={() => !isBooked && onToggle(seatId, seatType)}
                        className={cn(
                          'w-8 h-8 rounded-sm transition-all duration-150 flex items-center justify-center',
                          colorClass
                        )}
                      />
                    );
                  })}
                </div>

                {/* Col numbers (only for first row) */}
                {rowIdx === 0 && null}
              </div>
            );
          })}

          {/* Column numbers */}
          <div className="flex items-center gap-2 mt-1">
            <span className="w-6" />
            <div className="flex gap-1.5">
              {Array.from({ length: cols }, (_, i) => (
                <span
                  key={i}
                  className="w-8 text-center text-on-surface/20 font-headline text-[9px] select-none"
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 px-6 py-3 bg-surface-container-low rounded-full">
        {[
          { color: 'bg-surface-container-highest', label: 'Thường' },
          { color: 'bg-tertiary/70', label: 'VIP' },
          { color: 'bg-primary/60', label: 'Đôi' },
          { color: 'bg-primary-container ring-1 ring-primary/60', label: 'Đã chọn' },
          { color: 'bg-surface-container-lowest border border-white/10 opacity-40', label: 'Đã đặt' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('w-3.5 h-3.5 rounded-sm', color)} />
            <span className="text-xs font-label uppercase tracking-wider text-on-surface/60">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
