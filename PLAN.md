# PLAN.md — CineVerse Movie Booking Website

## Tổng Quan

Nâng cấp project shell đang có (React 19 + Vite + Tailwind dark theme) thành ứng dụng đặt vé phim đầy đủ.
**Giữ nguyên toàn bộ UI/design hiện tại** (theme cinema tối với primary=đỏ/tertiary=vàng rất đẹp).
Thêm TMDB API + localStorage + Redux + Admin panel.
**Ant Design chỉ dùng cho Admin panel** để tránh conflict với Tailwind v4 custom theme ở public pages.

---

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 19 | UI framework |
| Vite | 6 | Build tool |
| TypeScript | 5.8 | Type safety |
| react-router-dom | v7 | Routing |
| @reduxjs/toolkit | latest | Global state (booking flow) |
| axios + @tanstack/react-query | latest | TMDB API calls & caching |
| Ant Design v5 | latest | Admin panel UI |
| Tailwind CSS v4 | latest | Public pages styling |
| dayjs | latest | Date formatting |
| react-hook-form + zod | latest | Form validation |
| sonner | latest | Toast notifications |
| uuid | latest | Generate unique IDs |
| localStorage | — | Thay database |

---

## Phase 0 — Cài Dependencies & Cấu Hình

```bash
npm install @reduxjs/toolkit react-redux axios @tanstack/react-query antd @ant-design/icons dayjs react-hook-form zod @hookform/resolvers sonner uuid
npm install -D @types/uuid
```

`.env`:
```
VITE_TMDB_API_KEY=your_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
```

---

## Phase 1 — Cấu Trúc Thư Mục

```
src/
├── api/
│   ├── tmdb.ts              # axios instance + interceptor
│   └── movies.ts            # TMDB API functions
├── services/
│   └── storage.ts           # CRUD localStorage
├── store/
│   ├── index.ts
│   └── slices/bookingSlice.ts
├── hooks/
│   └── useTmdbMovies.ts     # TanStack Query hooks
├── utils/
│   ├── seedData.ts          # seed halls + showtimes mẫu  
│   └── formatters.ts        # format VNĐ, mã booking
├── types/
│   └── index.ts             # TypeScript interfaces
├── components/
│   ├── layout/              # Navbar, Footer, Layout (updated)
│   └── SeatMap/SeatMap.tsx  # Sơ đồ ghế ngồi (mới)
├── pages/
│   ├── Home.tsx             # TMDB data
│   ├── MovieDetails.tsx     # TMDB + localStorage showtimes
│   ├── SeatSelection.tsx    # localStorage + Redux
│   ├── BookingForm.tsx      # form nhập thông tin (mới)
│   ├── BookingSuccess.tsx   # vé thành công (mới)
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── Dashboard.tsx
│       ├── ManageShowtimes.tsx
│       ├── ManageBookings.tsx
│       └── ManageHalls.tsx
```

---

## Phase 2 — TypeScript Data Models

```ts
// localStorage keys: "cv_halls" | "cv_showtimes" | "cv_bookings"

interface Hall {
  id: string;
  name: string;
  rows: number;
  cols: number;
  seatLayout: Record<string, 'standard' | 'vip' | 'couple'>;
}

interface Showtime {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  date: string;             // "2026-04-10"
  time: string;             // "19:30"
  hallId: string;
  prices: { standard: number; vip: number; couple: number; };
}

interface Booking {
  id: string;
  bookingCode: string;      // "CV-XXXXXX"
  showtimeId: string;
  movieId: number;
  movieTitle: string;
  date: string; time: string; hallId: string;
  seats: string[];
  seatTypes: Record<string, 'standard' | 'vip' | 'couple'>;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
```

---

## Phase 3 — Luồng Đặt Vé (User Flow)

```
Home (TMDB movies)
  → click poster/nút
  → MovieDetails (TMDB detail + trailer + showtimes từ localStorage)
  → click suất chiếu
  → SeatSelection (sơ đồ ghế động, Redux state)
  → click "Tiếp tục"
  → BookingForm (react-hook-form + zod)
  → submit
  → BookingSuccess (vé điện tử với mã booking)
```

---

## Phase 4 — Admin Panel Routes

```
/admin              → Dashboard (stats + bảng booking gần đây)
/admin/showtimes    → CRUD suất chiếu (tìm phim TMDB + chọn hall + giá)
/admin/bookings     → Xem + huỷ booking
/admin/halls        → CRUD phòng chiếu
```

---

## Routes Tổng Hợp

| Route | Page | Ghi chú |
|---|---|---|
| `/` | Home | TMDB now_playing + popular + upcoming |
| `/movie/:tmdbId` | MovieDetails | TMDB detail + trailer + showtimes |
| `/booking/:showtimeId/seats` | SeatSelection | Redux + localStorage |
| `/booking/:showtimeId/info` | BookingForm | react-hook-form + zod |
| `/booking/success/:code` | BookingSuccess | vé điện tử từ localStorage |
| `/admin` | Dashboard | Ant Design stats |
| `/admin/showtimes` | ManageShowtimes | CRUD + TMDB search |
| `/admin/bookings` | ManageBookings | Table + cancel |
| `/admin/halls` | ManageHalls | CRUD hall config |

---

## Decisions

- React 19 + router-dom v7: Giữ nguyên (không downgrade)
- Ant Design chỉ cho Admin: Tránh conflict với Tailwind v4
- Giữ nguyên dark cinema theme: Đẹp, không redesign
- Tiền VNĐ thay USD
- UI tiếng Việt
- Không cần auth: Admin truy cập `/admin` trực tiếp
- TMDB poster: `w500`, backdrop: `original`
