import { ArrowLeft, ArrowRight, PlayCircle, Star } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TMDB_IMAGE } from '../api/tmdb';
import { useNowPlaying, usePopular, useUpcoming } from '../hooks/useTmdbMovies';
import { getFeaturedMovie } from '../services/storage';
import type { TmdbMovie } from '../types';

function MovieCard({ movie, onClick }: { movie: TmdbMovie; onClick: () => void; key?: React.Key | null }) {
  const poster = TMDB_IMAGE(movie.poster_path, 'w500');
  return (
    <div
      onClick={onClick}
      className="flex-none w-[220px] snap-start cursor-pointer group relative rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_0_2px_#ffb4ab,0_0_20px_rgba(255,180,171,0.4)]"
    >
      <div className="aspect-[2/3] bg-surface-container-highest overflow-hidden rounded-lg relative">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface/30 text-xs text-center p-2">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-on-surface drop-shadow-[0_0_10px_rgba(255,180,171,0.8)]" />
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-headline font-bold text-base text-on-surface truncate">{movie.title}</h3>
        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 fill-tertiary text-tertiary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-none w-[220px] animate-pulse">
      <div className="aspect-[2/3] bg-surface-container-highest rounded-lg" />
      <div className="mt-3 px-1 space-y-2">
        <div className="h-3.5 bg-surface-container-high rounded w-3/4" />
        <div className="h-2.5 bg-surface-container-high rounded w-1/3" />
      </div>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { data: nowPlaying, isLoading: loadingNow } = useNowPlaying();
  const { data: popular, isLoading: loadingPop } = usePopular();
  const { data: upcoming, isLoading: loadingUp } = useUpcoming();

  const heroMovie = getFeaturedMovie() ?? nowPlaying?.results[0];
  const backdrop = TMDB_IMAGE(heroMovie?.backdrop_path ?? null, 'original');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[819px] min-h-[600px] max-h-[900px] overflow-hidden group">
        {loadingNow ? (
          <div className="absolute inset-0 bg-surface-container animate-pulse" />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: backdrop ? `url('${backdrop}')` : undefined }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-screen-2xl mx-auto w-full px-8 md:px-16 pb-24 md:pb-32">
            {heroMovie ? (
              <div className="max-w-3xl flex flex-col gap-6">
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-surface-container-low/80 backdrop-blur-sm border border-tertiary/30 text-tertiary text-xs font-bold font-body uppercase tracking-widest rounded-sm shadow-[0_0_24px_rgba(233,196,0,0.2)]">
                    Đang chiếu
                  </span>
                  <span className="px-3 py-1 bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/30 text-on-surface text-xs font-bold font-body uppercase tracking-widest rounded-sm">
                    {(heroMovie.original_language ?? '').toUpperCase()}
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-on-surface font-headline leading-none tracking-tight">
                  {heroMovie.title}
                </h1>

                <div className="flex items-center gap-4 text-sm font-body text-on-surface-variant uppercase font-medium">
                  <span className="flex items-center gap-1 text-tertiary">
                    <Star className="w-4 h-4 fill-current" />
                    {(heroMovie.vote_average ?? 0).toFixed(1)}/10
                  </span>
                  <span>•</span>
                  <span>{heroMovie.release_date?.slice(0, 4)}</span>
                </div>

                <p className="text-on-surface-variant/90 text-lg md:text-xl font-body max-w-2xl line-clamp-3 font-light">
                  {heroMovie.overview}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => navigate(`/movie/${heroMovie.id}`)}
                    className="w-[180px] h-[56px] bg-primary text-on-primary font-headline font-bold text-base uppercase tracking-widest rounded-md shadow-[0_0_24px_rgba(255,180,171,0.3)] hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                  >
                    Đặt vé ngay
                  </button>
                  <button className="w-[180px] h-[56px] bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/20 text-on-surface font-headline font-bold text-base uppercase tracking-widest rounded-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Trailer
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl flex flex-col gap-4">
                <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse" />
                <div className="h-16 w-2/3 bg-surface-container-high rounded animate-pulse" />
                <div className="h-12 w-full bg-surface-container-high rounded animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-8 md:px-16 py-16 flex flex-col gap-16 relative z-10 w-full">
        {/* Popular / Đang Chiếu */}
        <section className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold font-headline text-on-surface tracking-wide uppercase">
              Đang Chiếu
            </h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-on-surface hover:border-outline-variant transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x">
            {loadingPop
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : popular?.results.map((m) => (
                  <MovieCard key={m.id} movie={m} onClick={() => { navigate(`/movie/${m.id}`) }} />
                ))}
          </div>
        </section>

        {/* Sắp Chiếu */}
        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-wide uppercase">
            Sắp Chiếu
          </h2>
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x opacity-70 hover:opacity-100 transition-opacity">
            {loadingUp
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : upcoming?.results.map((m) => (
                  <div key={m.id}>
                    <MovieCard movie={m} onClick={() => { navigate(`/movie/${m.id}`) }} />
                    <p className="mt-1 px-1 text-xs text-primary font-bold">
                      {m.release_date
                        ? new Date(m.release_date).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'Sắp ra mắt'}
                    </p>
                  </div>
                ))}
          </div>
        </section>

        {/* Phim Mới Nhất (grid) */}
        <section className="flex flex-col gap-8 pb-20">
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-wide uppercase">
            Phim Mới Nhất
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {loadingNow
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              : nowPlaying?.results.map((m) => (
                  <MovieCard key={m.id} movie={m} onClick={() => { navigate(`/movie/${m.id}`) }} />
                ))}
          </div>
        </section>
      </main>
    </div>
  );
}
