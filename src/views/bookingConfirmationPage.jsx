import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Ticket, Loader2 } from "lucide-react";

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const seatText = useMemo(() => {
    const seats = booking.seatLabels || booking.seats || [];
    if (!Array.isArray(seats) || seats.length === 0) return "General Admission";
    return seats.join(", ");
  }, [booking.seatLabels, booking.seats]);

  if (!booking?.movie || !booking?.theater) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-36 sm:pb-28">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center max-w-md w-full">
          <p className="text-gray-700 font-semibold">No booking data found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 text-sm font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-24 pb-36 sm:pb-28 md:pb-10">
      <div className="max-w-2xl mx-auto space-y-4">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
            <Loader2 className="animate-spin text-red-500 mb-3" />
            <p className="font-semibold text-gray-900">Confirming your booking...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your ticket.</p>
          </div>  
        ) : (
          <>
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Booking Confirmed</h1>
                <p className="text-sm text-gray-500">Your ticket details are ready.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{booking.movie.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Booking ID: {booking.bookingId || "-"}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-500">Date</p>
                  <p className="mt-1 font-semibold text-gray-900 flex items-center gap-1.5"><CalendarDays size={13} /> {booking.date || "-"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-500">Time</p>
                  <p className="mt-1 font-semibold text-gray-900 flex items-center gap-1.5"><Clock3 size={13} /> {booking.time || "-"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                  <p className="text-[11px] text-gray-500">Theater</p>
                  <p className="mt-1 font-semibold text-gray-900 flex items-center gap-1.5"><MapPin size={13} /> {booking.theater?.name || "-"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                  <p className="text-[11px] text-gray-500">Seats</p>
                  <p className="mt-1 font-semibold text-gray-900 flex items-center gap-1.5"><Ticket size={13} /> {seatText}</p>
                </div>
              </div>

              <div className="mt-4 text-right">
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="text-xl font-bold text-gray-900">Rs {Number(booking.totalPrice || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-[env(safe-area-inset-bottom)]">
              <button
                onClick={() => navigate("/userDashboard/bookings")}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-sm font-semibold shadow-sm"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate("/ticketPage", { state: booking })}
                className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl py-3 text-sm font-semibold shadow-sm"
              >
                Open E-Ticket
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
