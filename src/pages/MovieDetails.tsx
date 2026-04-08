import { ArrowRight, Clock, Film, Globe, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TMDB_IMAGE } from "../api/tmdb";
import {
  useMovieCredits,
  useMovieDetail,
  useMovieVideos,
} from "../hooks/useTmdbMovies";
import { getShowtimes, getHalls } from "../services/storage";
import { setShowtime } from "../store/slices/bookingSlice";
import { cn } from "../lib/utils";
import { runtime, formatVND } from "../utils/formatters";
import type { Showtime } from "../types";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movieId =
    id && !Number.isNaN(parseInt(id, 10)) ? parseInt(id, 10) : null;

  const { data: movie, isLoading } = useMovieDetail(movieId);
  const { data: videos } = useMovieVideos(movieId);
  const { data: credits } = useMovieCredits(movieId);

  // Showtimes for this movie from localStorage
  const allShowtimes = useMemo(
    () => getShowtimes().filter((s) => s.movieId === movieId),
    [movieId],
  );
  const halls = useMemo(() => getHalls(), []);

  // Group showtimes by date
  const dateGroups = useMemo(() => {
    const groups: Record<string, Showtime[]> = {};
    allShowtimes.forEach((s) => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });
    return groups;
  }, [allShowtimes]);

  const dates = Object.keys(dateGroups).sort();
  const [selectedDate, setSelectedDate] = useState<string>(dates[0] ?? "");

  const trailer = videos?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );
  const backdrop = TMDB_IMAGE(movie?.backdrop_path ?? null, "original");
  const poster = TMDB_IMAGE(movie?.poster_path ?? null, "w500");

  const handleSelectShowtime = (showtime: Showtime) => {
    dispatch(
      setShowtime({
        showtimeId: showtime.id,
        priceMap: showtime.prices,
      }),
    );
    navigate(`/booking/${showtime.id}/seats`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-on-surface-variant font-body">
            Đang tải thông tin phim...
          </p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant font-body">
          Không tìm thấy phim.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[870px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backdrop || poster}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />

        <div className="relative h-full flex items-end px-8 md:px-16 pb-24 max-w-screen-2xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
              <span className="bg-primary text-on-primary px-3 py-1 font-bold tracking-widest text-xs uppercase rounded-sm">
                {movie.status === "Released" ? "Đang chiếu" : "Sắp chiếu"}
              </span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-tertiary fill-current" />
                <span className="font-headline font-bold text-xl">
                  {(movie.vote_average ?? 0).toFixed(1)}
                </span>
                <span className="text-on-surface-variant/70 text-sm font-medium">
                  TMDB
                </span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter text-on-surface text-balance leading-none">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-medium text-on-surface-variant">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {runtime(movie.runtime)}
              </span>
              <span className="flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                {(movie.genres ?? []).map((g) => g.name).join(" / ") || "N/A"}
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                {movie.spoken_languages?.[0]?.name ?? movie.original_language}
              </span>
            </div>

            <p className="text-lg md:text-xl text-on-surface-variant/90 leading-relaxed max-w-2xl font-light">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Showtimes + Booking Section */}
      <section className="relative -mt-20 px-8 md:px-16 pb-16 max-w-screen-2xl mx-auto z-10 w-full">
        <div className="bg-surface-container-low/60 backdrop-blur-2xl rounded-xl border border-outline-variant/10 p-8">
          <h3 className="font-headline text-tertiary text-sm uppercase tracking-widest font-bold mb-6">
            Chọn Suất Chiếu
          </h3>

          {dates.length === 0 ? (
            <div className="text-on-surface-variant text-sm py-8 text-center">
              Hiện chưa có suất chiếu nào cho phim này.
              <br />
              <span className="text-xs opacity-60">
                Vui lòng quay lại sau hoặc liên hệ admin.
              </span>
            </div>
          ) : (
            <>
              {/* Date tabs */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[80px] h-20 rounded-lg transition-all px-4",
                      selectedDate === date
                        ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(255,180,171,0.3)]"
                        : "bg-surface-container-high text-on-surface hover:bg-surface-bright",
                    )}
                  >
                    <span className="text-xs font-bold uppercase tracking-tight opacity-80 capitalize">
                      {dayjs(date).format("ddd")}
                    </span>
                    <span className="text-2xl font-headline font-bold">
                      {dayjs(date).format("DD")}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-tight opacity-80">
                      {dayjs(date).format("MMM")}
                    </span>
                  </button>
                ))}
              </div>

              {/* Showtimes for selected date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(dateGroups[selectedDate] ?? []).map((showtime) => {
                  const hall = halls.find((h) => h.id === showtime.hallId);
                  return (
                    <button
                      key={showtime.id}
                      onClick={() => handleSelectShowtime(showtime)}
                      className="group p-5 rounded-xl border border-outline-variant/20 bg-surface-container-high hover:border-primary hover:bg-surface-bright transition-all text-left"
                    >
                      <div className="text-2xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                        {showtime.time}
                      </div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        {hall?.name ?? showtime.hallId}
                      </div>
                      <div className="mt-3 pt-3 border-t border-outline-variant/10 text-xs text-on-surface-variant space-y-0.5">
                        <div className="flex justify-between">
                          <span>Thường</span>
                          <span className="font-bold text-on-surface">
                            {formatVND(showtime.prices.standard)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>VIP</span>
                          <span className="font-bold text-on-surface">
                            {formatVND(showtime.prices.vip)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Chọn ghế <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trailer + Credits */}
      <section className="px-8 md:px-16 pb-32 max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trailer */}
        {trailer && (
          <div className="bg-surface-container-low p-6 rounded-xl">
            <h4 className="text-tertiary text-xs uppercase tracking-widest font-bold mb-4">
              Trailer
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Cast */}
        <div className="bg-surface-container-low p-6 rounded-xl">
          <h4 className="text-tertiary text-xs uppercase tracking-widest font-bold mb-4">
            Diễn Viên
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {credits?.slice(0, 8).map((member) => {
              const avatar = TMDB_IMAGE(member.profile_path, "w300");
              return (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-highest">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface/30 text-xs">
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {member.character}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
