import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../../../auth";
import { getUserBookings } from "../../../services/booking-service";
import { getPopularMovies } from "../../../services/movie-service";
import { BASE_URL } from "../../../services/helper";
import {
  FaFilm, FaTicketAlt, FaCalendarCheck, FaArrowRight,
  FaStar, FaMapMarkerAlt, FaChair, FaClock, FaRupeeSign, FaSpinner
} from "react-icons/fa";
import { MdLocalMovies } from "react-icons/md";

const STATUS_STYLES = {
  CONFIRMED: "bg-green-100 text-green-700 border border-green-200",
  PENDING:   "bg-amber-100 text-amber-700 border border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  COMPLETED: "bg-gray-100 text-gray-600 border border-gray-200",
};


/* ─── Sub-Components ─────────────────────────── */
const StatsCard = ({ label, value, icon: Icon, color, sub }) => {
  const colors = {
    red:   { bg: "bg-red-50",   icon: "text-red-500",   border: "border-red-100",   num: "text-red-600" },
    amber: { bg: "bg-amber-50", icon: "text-amber-500", border: "border-amber-100", num: "text-amber-600" },
    green: { bg: "bg-green-50", icon: "text-green-500", border: "border-green-100", num: "text-green-600" },
  };
  const c = colors[color] || colors.red;
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
      <p className={`text-3xl font-bold ${c.num} mb-0.5`}>{value}</p>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
};

const MovieCard = ({ movie, navigate }) => {
  const posterSrc = movie.posterUrl
    ? `${BASE_URL}/uploads/${movie.posterUrl}`
    : null;
  const gradients = ["from-gray-800 to-gray-900", "from-red-800 to-red-950", "from-amber-800 to-amber-950", "from-slate-700 to-slate-900"];
  const grad = gradients[Math.floor(Math.random() * gradients.length)];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      <div className={`h-36 bg-gradient-to-br ${grad} flex items-center justify-center relative overflow-hidden`}>
        {posterSrc ? (
          <img src={posterSrc} alt={movie.movieName} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
        ) : (
          <MdLocalMovies className="text-white/30 text-6xl" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm truncate">{movie.movieName || movie.title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genre || 'Movie')}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <FaStar className="text-amber-400" size={12} />
            <span className="text-xs font-medium text-gray-700">{movie.rating || 'N/A'}</span>
          </div>
          <button
            onClick={() => navigate("/movies")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Dashboard ─────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, moviesRes] = await Promise.allSettled([
          getUserBookings(user.id),
          getPopularMovies(),
        ]);
        if (bookingsRes.status === 'fulfilled' && bookingsRes.value) {
          const sorted = [...bookingsRes.value].sort(
            (a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate)
          );
          setBookings(sorted);
        }
        if (moviesRes.status === 'fulfilled' && moviesRes.value?.data) {
          setMovies(moviesRes.value.data.slice(0, 4));
        }
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (!isLoggedIn()) return <Navigate to="/LoginPage" />;

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.username || "User";

  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    const showDate = b.show?.showDate ? new Date(b.show.showDate) : null;
    return showDate && showDate >= now && b.paymentStatus !== 'CANCELLED';
  });
  const nextBooking = upcomingBookings[0] || null;
  const recentBookings = bookings.slice(0, 5);

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const stats = [
    { label: "Total Bookings", value: String(bookings.length), icon: FaCalendarCheck, color: "red", sub: "All time" },
    { label: "Upcoming Shows", value: String(upcomingBookings.length), icon: FaTicketAlt, color: "green", sub: "Confirmed" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: FaRupeeSign, color: "amber", sub: "All bookings" },
  ];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const formatTime = (t) => t ? new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Welcome Banner ── */}
        <div className="rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-rose-600 p-6 md:p-8 text-white shadow-lg shadow-red-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-red-100 text-sm font-medium mb-1">👋 Welcome back</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{displayName}</h1>
            <p className="text-red-100 text-sm max-w-sm">
              {upcomingBookings.length > 0
                ? <>You have <span className="font-semibold text-white">{upcomingBookings.length} upcoming show{upcomingBookings.length > 1 ? 's' : ''}</span> booked!</>
                : "Ready for your next cinema experience?"}
            </p>
          </div>
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-2 bg-white text-red-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm shadow-sm flex-shrink-0"
          >
            <FaFilm size={14} />
            Browse Movies
            <FaArrowRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-red-500 text-3xl" />
          </div>
        ) : (
          <>
            {/* ── Stats Cards ── */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s) => <StatsCard key={s.label} {...s} />)}
              </div>
            </div>

            {/* ── Upcoming Booking ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Next Upcoming Booking</h2>
              </div>
              {nextBooking ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-red-500 to-rose-500 h-1.5" />
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-18 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 p-3">
                          <FaFilm className="text-red-500 text-2xl" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">{nextBooking.show?.movie?.title || '—'}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[nextBooking.paymentStatus] || STATUS_STYLES.PENDING}`}>
                              {nextBooking.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">Booking #{nextBooking.bookingReference}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                            {[
                              { icon: FaCalendarCheck, label: "Date", val: formatDate(nextBooking.show?.showDate) },
                              { icon: FaClock, label: "Time", val: formatTime(nextBooking.show?.showTime) },
                              { icon: FaMapMarkerAlt, label: "Theater", val: nextBooking.show?.theater?.name || '—' },
                              { icon: FaChair, label: "Seats", val: nextBooking.seatLabels || '—' },
                            ].map(({ icon: Icon, label, val }) => (
                              <div key={label}>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Icon size={11} className="text-gray-400" />
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 truncate">{val}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/userDashboard/myTickets")}
                        className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <FaTicketAlt size={13} />
                        View Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                  <FaTicketAlt className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No upcoming bookings</p>
                  <p className="text-gray-400 text-sm mt-1">Book a show and it'll appear here</p>
                  <button onClick={() => navigate("/movies")} className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                    Browse Movies
                  </button>
                </div>
              )}
            </div>

            {/* ── Recommended Movies + Recent Bookings ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

              {/* Recommended movies */}
              <div className="xl:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Popular Movies</h2>
                  <button onClick={() => navigate("/movies")} className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 transition-colors">
                    See all <FaArrowRight size={11} />
                  </button>
                </div>
                {movies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-4">
                    {movies.map((m) => <MovieCard key={m.movieId || m.id} movie={m} navigate={navigate} />)}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <MdLocalMovies className="text-gray-300 text-4xl mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No movies available</p>
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Recent Bookings</h2>
                </div>
                {recentBookings.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-100">
                      {recentBookings.map((b) => (
                        <div key={b.bookingId || b.bookingReference} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">{b.show?.movie?.title || '—'}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(b.show?.showDate)} · {formatTime(b.show?.showTime)}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500 truncate">Seats: {b.seatLabels || '—'}</p>
                                <p className="text-xs font-bold text-gray-800">₹{b.totalAmount?.toLocaleString('en-IN') || '—'}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[b.paymentStatus] || STATUS_STYLES.PENDING}`}>
                              {b.paymentStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                    <FaCalendarCheck className="text-gray-300 text-3xl mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No bookings yet</p>
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
