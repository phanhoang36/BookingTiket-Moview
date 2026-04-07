# 🎬 CineVerse — Website Đặt Lịch Xem Phim

CineVerse là ứng dụng web đặt vé xem phim **frontend-only**, kết hợp dữ liệu phim thực từ **TMDB API** với hệ thống quản lý rạp chiếu, suất chiếu và đặt chỗ ngồi được lưu trữ hoàn toàn qua **localStorage**. Giao diện người dùng theo chủ đề rạp chiếu tối (dark cinema theme); trang quản trị dùng Ant Design.

---

## ✨ Tính năng chính

### Trang công khai
| Tính năng | Mô tả |
|---|---|
| **Trang chủ** | Banner phim nổi bật, danh sách Đang Chiếu / Phổ Biến / Sắp Chiếu từ TMDB |
| **Chi tiết phim** | Thông tin phim, trailer YouTube, dàn diễn viên, danh sách suất chiếu theo ngày |
| **Chọn ghế** | Sơ đồ ghế ngồi tương tác (Standard / VIP / Couple), ghế đã đặt bị khoá |
| **Thông tin đặt vé** | Form điền họ tên, số điện thoại, email với validation tiếng Việt |
| **Xác nhận vé** | Trang vé điện tử với mã QR và mã đặt chỗ định dạng `CV-XXXXXX` |

### Trang quản trị `/admin`
| Tính năng | Mô tả |
|---|---|
| **Dashboard** | Thống kê tổng quan: tổng đặt vé, doanh thu, suất chiếu hôm nay, đặt chỗ hôm nay |
| **Quản lý Suất chiếu** | Thêm / sửa / xoá suất chiếu — tìm kiếm phim trực tiếp từ TMDB |
| **Quản lý Đặt vé** | Xem danh sách đặt vé, lọc theo trạng thái, huỷ vé, xem chi tiết |
| **Quản lý Phòng chiếu** | Thêm / sửa / xoá phòng chiếu, tuỳ chỉnh sơ đồ ghế, xem preview |

---

## 🛠️ Công nghệ sử dụng

| Lớp | Công nghệ | Phiên bản |
|---|---|---|
| UI Framework | React | 19 |
| Build Tool | Vite | 6 |
| Ngôn ngữ | TypeScript | 5.8 |
| Routing | react-router-dom | v7 |
| Global State | Redux Toolkit + react-redux | 2.x / 9.x |
| Data Fetching | Axios + TanStack Query | 1.x / 5.x |
| UI Admin | Ant Design | v6 |
| UI Public | Tailwind CSS | v4 |
| Animation | Motion (Framer Motion) | 12 |
| Form & Validation | react-hook-form + Zod | 7.x / 4.x |
| Ngày tháng | dayjs (locale vi) | 1.x |
| Thông báo | Sonner | 2.x |
| Icon | lucide-react | 0.5x |
| ID ngẫu nhiên | uuid | 13 |
| Database | localStorage (browser) | — |

---

## 📁 Cấu trúc thư mục

```
CineVerse/
├── .env                        # Biến môi trường (API key TMDB)
├── .env.example                # Mẫu biến môi trường
├── index.html                  # HTML gốc
├── vite.config.ts              # Cấu hình Vite
├── tsconfig.json               # Cấu hình TypeScript
├── package.json
└── src/
    ├── main.tsx                # Entry point — khai báo Providers
    ├── App.tsx                 # Định nghĩa toàn bộ Routes
    ├── index.css               # CSS global + Tailwind + theme variables
    ├── vite-env.d.ts           # Khai báo kiểu cho import.meta.env
    │
    ├── types/
    │   └── index.ts            # Tất cả TypeScript interfaces (Hall, Showtime, Booking…)
    │
    ├── api/
    │   ├── tmdb.ts             # Axios instance + helper TMDB_IMAGE()
    │   └── movies.ts           # Các hàm gọi TMDB API
    │
    ├── hooks/
    │   └── useTmdbMovies.ts    # TanStack Query hooks (useNowPlaying, useMovieDetail…)
    │
    ├── services/
    │   └── storage.ts          # CRUD localStorage: halls / showtimes / bookings
    │
    ├── store/
    │   ├── index.ts            # Cấu hình Redux store
    │   └── slices/
    │       └── bookingSlice.ts # Slice quản lý luồng đặt vé
    │
    ├── utils/
    │   ├── seedData.ts         # Dữ liệu mẫu ban đầu (2 phòng + 5 suất chiếu)
    │   └── formatters.ts       # formatVND, generateBookingCode, formatDate…
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.tsx      # Wrapper Navbar + Outlet + Footer
    │   │   ├── Navbar.tsx      # Thanh điều hướng
    │   │   └── Footer.tsx      # Chân trang
    │   └── SeatMap/
    │       └── SeatMap.tsx     # Component sơ đồ ghế ngồi
    │
    └── pages/
        ├── Home.tsx            # Trang chủ
        ├── MovieDetails.tsx    # Trang chi tiết phim
        ├── SeatSelection.tsx   # Trang chọn ghế
        ├── BookingForm.tsx     # Form thông tin đặt vé
        ├── BookingSuccess.tsx  # Trang xác nhận / vé điện tử
        └── admin/
            ├── AdminLayout.tsx     # Layout Ant Design cho admin
            ├── Dashboard.tsx       # Trang thống kê
            ├── ManageShowtimes.tsx # Quản lý suất chiếu
            ├── ManageBookings.tsx  # Quản lý đặt vé
            └── ManageHalls.tsx     # Quản lý phòng chiếu
```

---

## 🚀 Hướng dẫn cài đặt & chạy

### Yêu cầu hệ thống
- **Node.js** ≥ 18 — tải tại [nodejs.org](https://nodejs.org)
- **npm** ≥ 9 (đi kèm với Node.js)

---

### Bước 1 — Mở thư mục dự án

```powershell
cd "C:\Users\<tên-của-bạn>\Downloads\CineVerse"
```

---

### Bước 2 — Cài đặt dependencies

```bash
npm install
```

> Lần đầu chạy mất khoảng 1–2 phút, sẽ tải xuống ~300 packages vào thư mục `node_modules/`.

---

### Bước 3 — Lấy TMDB API Key (miễn phí)

1. Truy cập **[https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)** và tạo tài khoản miễn phí
2. Vào **Settings → API → Create → Developer**
3. Điền thông tin (mục đích: "Personal project / learning"), nhận **API Key (v3 auth)**
4. Mở file **`.env`** ở thư mục gốc dự án, điền key vào:

```env
VITE_TMDB_API_KEY=abc123xyz_api_key_thực_của_bạn
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
VITE_TMDB_BACKDROP_BASE=https://image.tmdb.org/t/p/original
```

> ⚠️ **Lưu ý:** Không để dấu ngoặc kép quanh API key. Không commit file `.env` lên Git.

---

### Bước 4 — Chạy môi trường phát triển

```bash
npm run dev
```

Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---

### Bước 5 — Truy cập trang quản trị

Truy cập thẳng đường dẫn: **[http://localhost:3000/admin](http://localhost:3000/admin)**

> Trang admin không có màn hình đăng nhập — truy cập trực tiếp bằng URL.

---

### Build production (tuỳ chọn)

```bash
npm run build       # Tạo bản build tối ưu vào thư mục dist/
npm run preview     # Xem preview bản build tại localhost:4173
```

### Kiểm tra TypeScript

```bash
npm run lint        # Chạy tsc --noEmit, báo lỗi kiểu dữ liệu
```

---

## 🗺️ Bản đồ trang (Routes)

| Đường dẫn | Trang | Mô tả |
|---|---|---|
| `/` | Home | Trang chủ — danh sách phim từ TMDB |
| `/movie/:id` | MovieDetails | Chi tiết phim, trailer, diễn viên, suất chiếu |
| `/booking/:showtimeId/seats` | SeatSelection | Chọn ghế ngồi |
| `/booking/:showtimeId/info` | BookingForm | Điền thông tin đặt vé |
| `/booking/success/:code` | BookingSuccess | Vé điện tử xác nhận |
| `/admin` | Dashboard | Tổng quan thống kê |
| `/admin/showtimes` | ManageShowtimes | Quản lý suất chiếu |
| `/admin/bookings` | ManageBookings | Quản lý đặt vé |
| `/admin/halls` | ManageHalls | Quản lý phòng chiếu |

---

## 💾 Lưu trữ dữ liệu (localStorage)

Toàn bộ dữ liệu được lưu trong `localStorage` của trình duyệt — **không cần backend hay database**.

| Key | Kiểu | Mô tả |
|---|---|---|
| `cv_halls` | `Hall[]` | Danh sách phòng chiếu |
| `cv_showtimes` | `Showtime[]` | Danh sách suất chiếu |
| `cv_bookings` | `Booking[]` | Danh sách đặt vé |

Khi khởi động **lần đầu tiên**, ứng dụng tự động seed **2 phòng chiếu** và **5 suất chiếu mẫu** (xem [src/utils/seedData.ts](src/utils/seedData.ts)).

### Cấu trúc dữ liệu chính

```typescript
// Phòng chiếu
interface Hall {
  id: string;
  name: string;
  rows: number;                         // Số hàng ghế
  cols: number;                         // Số cột ghế
  seatLayout: Record<string, SeatType>; // Ghế đặc biệt: 'vip' | 'couple'
                                        // Ghế không khai báo mặc định là 'standard'
}

// Suất chiếu
interface Showtime {
  id: string;
  movieId: number;      // TMDB movie ID
  movieTitle: string;
  moviePoster: string;  // TMDB poster_path (VD: '/abc123.jpg')
  date: string;         // Định dạng 'YYYY-MM-DD'
  time: string;         // Định dạng 'HH:mm'
  hallId: string;
  prices: { standard: number; vip: number; couple: number };
}

// Vé đặt chỗ
interface Booking {
  id: string;
  bookingCode: string;   // Ví dụ: 'CV-A3F9K2'
  showtimeId: string;
  movieId: number;
  movieTitle: string;
  moviePoster?: string;
  date: string;
  time: string;
  hallId: string;
  seats: string[];                       // Ví dụ: ['A1', 'A2', 'G3']
  seatTypes: Record<string, SeatType>;   // { 'A1': 'standard', 'G3': 'vip' }
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;                     // ISO 8601
}
```

---

## ⚙️ Luồng đặt vé (Redux Toolkit)

Redux chỉ quản lý **trạng thái tạm thời** trong phiên đặt vé. Sau khi hoàn tất, dữ liệu được lưu vào localStorage và Redux bị reset sạch.

```
[MovieDetails]
  → Chọn suất chiếu
  → dispatch setShowtime({ showtimeId, priceMap })
        ↓
[SeatSelection]
  → Chọn / bỏ chọn ghế
  → dispatch toggleSeat({ seatId, seatType })
        ↓
[BookingForm]
  → Điền thông tin khách hàng (react-hook-form + Zod)
  → Tính tổng tiền từ selector selectTotalAmount
  → saveBooking() → lưu vào localStorage
  → dispatch clearBooking()
  → navigate('/booking/success/CV-XXXXXX')
        ↓
[BookingSuccess]
  → Đọc booking từ localStorage theo bookingCode
  → Hiển thị vé điện tử + mã QR
```

---

## 📡 TMDB API — Các endpoint sử dụng

| Hook | Endpoint | Mô tả |
|---|---|---|
| `useNowPlaying()` | `GET /movie/now_playing` | Phim đang chiếu |
| `usePopularMovies()` | `GET /movie/popular` | Phim phổ biến |
| `useUpcomingMovies()` | `GET /movie/upcoming` | Phim sắp chiếu |
| `useMovieDetail(id)` | `GET /movie/{id}` | Chi tiết phim |
| `useMovieVideos(id)` | `GET /movie/{id}/videos` | Trailer |
| `useMovieCredits(id)` | `GET /movie/{id}/credits` | Dàn diễn viên |
| `useSearchMovies(query)` | `GET /search/movie` | Tìm kiếm phim (dùng trong admin) |

Tất cả request đều gắn `language=vi-VN`. Cache qua TanStack Query với stale time 5–10 phút, `retry: 1`, `refetchOnWindowFocus: false`.

---

## 🎨 Hệ thống màu & theme

Giao diện công khai dùng **dark cinema theme** định nghĩa qua CSS custom properties trong [src/index.css](src/index.css):

| Biến CSS | Giá trị | Dùng cho |
|---|---|---|
| `--color-surface` | `#131313` | Nền tổng thể |
| `--color-surface-container-low` | `#1c1c1c` | Card, panel |
| `--color-surface-container-high` | `#2b2b2b` | Input, tag |
| `--color-primary` | `#ffb4ab` (đỏ hồng) | Nút chính, accent |
| `--color-tertiary` | `#e9c400` (vàng) | Ghế VIP, highlight giá |
| `--color-on-surface` | `#e6e1e5` | Văn bản chính |
| `--color-on-surface-variant` | `#cac4d0` | Văn bản thứ cấp |

Font chữ: `font-headline` dùng cho tiêu đề / tên phim; `font-body` cho nội dung thường.

Trang admin dùng `ConfigProvider` của Ant Design với preset `dark` hoàn toàn tách biệt.

---

## 🐛 Xử lý lỗi thường gặp

**Phim không hiển thị, trang trắng hoặc lỗi mạng:**
```
→ Kiểm tra VITE_TMDB_API_KEY trong file .env đã điền đúng chưa
→ Sau khi sửa .env → bắt buộc restart: Ctrl+C rồi chạy lại npm run dev
```

**Lỗi PowerShell "cannot be loaded because running scripts is disabled":**
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Dữ liệu cũ / muốn reset toàn bộ:**
```
→ Mở DevTools (F12) → Application → Local Storage
→ Xoá các key: cv_halls, cv_showtimes, cv_bookings
→ Reload trang — dữ liệu seed sẽ được tạo lại tự động
```

**Lỗi port 3000 đã bị chiếm:**
```bash
npm run dev -- --port 3001
```

---

## 📝 Ghi chú kỹ thuật

- **Không có backend** — toàn bộ logic chạy trên trình duyệt
- **Không có auth** — trang `/admin` truy cập trực tiếp qua URL, không cần đăng nhập
- Tất cả admin files dùng `// @ts-nocheck` để bypass type incompatibility giữa Ant Design v6 và React 19
- Dữ liệu chỉ tồn tại trong trình duyệt hiện tại; dùng trình duyệt ẩn danh (Incognito) sẽ tạo mock data mới
- TMDB API Key hoàn toàn **miễn phí** cho dùng cá nhân

---

*Built with ❤️ — React 19 · Vite 6 · TypeScript 5.8 · TMDB API*

