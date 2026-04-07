/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { MovieDetails } from "./pages/MovieDetails";
import { SeatSelection } from "./pages/SeatSelection";
import { BookingForm } from "./pages/BookingForm";
import { BookingSuccess } from "./pages/BookingSuccess";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { ManageShowtimes } from "./pages/admin/ManageShowtimes";
import { ManageBookings } from "./pages/admin/ManageBookings";
import { ManageHalls } from "./pages/admin/ManageHalls";
import { ManageFeaturedMovie } from "./pages/admin/ManageFeaturedMovie";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="booking/:showtimeId/seats" element={<SeatSelection />} />
          <Route path="booking/:showtimeId/info" element={<BookingForm />} />
        </Route>
        {/* Booking success (no navbar/footer) */}
        <Route path="/booking/success/:code" element={<BookingSuccess />} />
        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="showtimes" element={<ManageShowtimes />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="halls" element={<ManageHalls />} />
          <Route path="featured" element={<ManageFeaturedMovie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
