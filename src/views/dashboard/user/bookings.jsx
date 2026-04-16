import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CalendarDays, Clock3, MapPin, Ticket, Loader2, IndianRupee, CircleX, Armchair } from "lucide-react";
import { cancelUserBooking, getCancellationPreview, getUserBookings, getUserRefundHistory } from "@/services/booking-service";
import { toast } from "react-toastify";

const statusStyle = {
  CONFIRMED: "bg-green-100 text-green-700 border border-green-200",
  PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  COMPLETED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (time) => {
  if (!time) return "-";
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const formatRefundStatus = (status) => {
  if (!status || status === "PENDING") return "REFUND_INITIATED";
  return status;
};

const Bookings = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelPreview, setCancelPreview] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmingCancellation, setConfirmingCancellation] = useState(false);
  const [refundByBookingId, setRefundByBookingId] = useState({});
  const [refundHistory, setRefundHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!user?.id) {
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [bookingData, refundData] = await Promise.all([
          getUserBookings(user.id),
          getUserRefundHistory(user.id),
        ]);

        if (!mounted) return;
        const list = Array.isArray(bookingData) ? bookingData : [];
        list.sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate));
        setBookings(list);

        const refunds = Array.isArray(refundData) ? refundData : [];
        setRefundHistory(refunds);
        setRefundByBookingId(
          refunds.reduce((acc, item) => {
            if (item?.bookingId != null) {
              acc[item.bookingId] = {
                refundStatus: item.refundStatus,
                refundAmount: item.refundAmount,
                refundReference: item.refundReference,
                failureReason: item.failureReason,
              };
            }
            return acc;
          }, {})
        );
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to fetch user bookings", err);
        setError("Unable to load bookings right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return bookings.filter((booking) => {
      const showDate = booking?.show?.showDate ? new Date(booking.show.showDate) : null;
      return showDate && showDate >= now && booking.paymentStatus !== "CANCELLED";
    }).length;
  }, [bookings]);

  const totalRefunded = useMemo(() => {
    return refundHistory
      .filter((item) => item?.refundStatus === "SUCCESS")
      .reduce((sum, item) => sum + Number(item?.refundAmount || 0), 0);
  }, [refundHistory]);

  const isUpcomingBooking = (booking) => {
    if (!booking?.show?.showDate || !booking?.show?.showTime) return false;
    const showDateTime = new Date(`${booking.show.showDate}T${booking.show.showTime}`);
    return showDateTime >= new Date();
  };

  const isCancellationAllowed = (booking) => {
    if (!booking || booking.paymentStatus !== "CONFIRMED") return false;
    if (!booking?.show?.showDate || !booking?.show?.showTime) return false;
    const showDateTime = new Date(`${booking.show.showDate}T${booking.show.showTime}`);
    const cutoffMillis = 2 * 60 * 60 * 1000;
    return showDateTime.getTime() - Date.now() >= cutoffMillis;
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelPreview(null);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (booking) => {
    if (!user?.id) return;

    const allowCancel = isCancellationAllowed(booking);
    if (!allowCancel) {
      toast.info("Only upcoming confirmed bookings can be cancelled.");
      return;
    }

    try {
      setCancelLoadingId(booking.bookingId);
      setSelectedBooking(booking);

      const preview = await getCancellationPreview(booking.bookingId);
      if (!preview?.cancellationAllowed) {
        toast.info(preview?.message || "Cancellation is not allowed for this booking.");
        return;
      }

      setCancelPreview(preview);
      setShowCancelModal(true);
      return;
    } catch (err) {
      console.error("Cancel booking preview failed", err);
      toast.error(err?.response?.data?.message || "Unable to load cancellation preview.");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const confirmCancellation = async () => {
    if (!selectedBooking?.bookingId || !user?.id) return;

    try {
      setConfirmingCancellation(true);
      const updated = await cancelUserBooking(selectedBooking.bookingId, user.id);

      setBookings((prev) => prev.map((item) => {
        if (item.bookingId !== selectedBooking.bookingId) return item;
        return {
          ...item,
          paymentStatus: updated?.bookingStatus || "CANCELLED",
        };
      }));

      setRefundByBookingId((prev) => ({
        ...prev,
        [selectedBooking.bookingId]: {
          refundStatus: updated?.refundStatus,
          refundAmount: updated?.refundAmount,
          refundableAmount: updated?.refundableAmount,
          convenienceFeeDeducted: updated?.convenienceFeeDeducted,
          refundPercentage: updated?.refundPercentage,
          refundReference: updated?.refundReference,
          failureReason: updated?.failureReason,
        },
      }));

      setRefundHistory((prev) => {
        const existingIndex = prev.findIndex((item) => item?.bookingId === selectedBooking.bookingId);
        const nextItem = {
          refundId: Date.now(),
          bookingId: selectedBooking.bookingId,
          bookingReference: selectedBooking.bookingReference,
          movieTitle: selectedBooking?.show?.movie?.title,
          theaterName: selectedBooking?.show?.theater?.name,
          showDate: selectedBooking?.show?.showDate,
          showTime: selectedBooking?.show?.showTime,
          refundAmount: updated?.refundAmount || 0,
          refundPercentage: updated?.refundPercentage || 0,
          refundStatus: updated?.refundStatus || "PENDING",
          refundReference: updated?.refundReference,
          failureReason: updated?.failureReason,
          createdAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const copy = [...prev];
          copy[existingIndex] = nextItem;
          return copy;
        }
        return [nextItem, ...prev];
      });

      closeCancelModal();

      if (updated?.refundStatus === "FAILED") {
        toast.warning(updated?.message || "Booking cancelled but refund initiation failed.");
      } else {
        toast.success(updated?.message || "Booking cancelled successfully.");
      }
    } catch (err) {
      console.error("Cancel booking failed", err);
      toast.error(err?.response?.data?.message || "Unable to cancel booking.");
    } finally {
      setConfirmingCancellation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-5 pt-28 pb-24 md:pt-24 md:pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-4">
          <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Track all your movie and event tickets.</p>
          <p className="text-sm text-red-600 mt-3 font-semibold">{bookings.length} total · {upcomingCount} upcoming</p>
        </div>

        {!loading && !error && refundHistory.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900">Refund History</h2>
              <p className="text-sm text-gray-600">Total Refunded: <span className="font-semibold">Rs {totalRefunded.toFixed(2)}</span></p>
            </div>

            <div className="mt-3 space-y-2">
              {refundHistory.slice(0, 6).map((item) => (
                <div key={`${item.refundId}-${item.bookingId}`} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800">{item.movieTitle || "Movie"} · {item.bookingReference || "-"}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.refundStatus === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : item.refundStatus === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>{formatRefundStatus(item.refundStatus)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Refund: Rs {Number(item.refundAmount || 0).toFixed(2)} ({Number(item.refundPercentage || 0).toFixed(0)}%)</p>
                  {item.refundReference && <p className="text-xs text-gray-600">Reference: {item.refundReference}</p>}
                  {item.failureReason && <p className="text-xs text-red-600">Reason: {item.failureReason}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 flex items-center justify-center gap-3 text-gray-600">
            <Loader2 className="animate-spin text-red-500" size={18} />
            <span>Loading bookings...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">{error}</div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <Ticket className="mx-auto text-gray-300 mb-3" size={34} />
            <p className="text-gray-700 font-semibold">No bookings yet</p>
            <button
              onClick={() => navigate("/movies")}
              className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-white text-sm font-medium hover:bg-red-600"
            >
              Browse Movies
            </button>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {bookings.map((booking) => {
              const canCancel = isCancellationAllowed(booking);
              const refundInfo = refundByBookingId[booking.bookingId];
              return (
                <article
                  key={booking.bookingId || booking.bookingReference}
                  className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">{booking?.show?.movie?.title || "Untitled"}</h2>
                      <p className="text-xs text-gray-500 mt-1">Ref: {booking?.bookingReference || "-"}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle[booking.paymentStatus] || statusStyle.PENDING}`}>
                      {booking.paymentStatus || "PENDING"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-4">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[11px] text-gray-500">Date</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-gray-400" />
                        {formatDate(booking?.show?.showDate)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[11px] text-gray-500">Time</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
                        <Clock3 size={13} className="text-gray-400" />
                        {formatTime(booking?.show?.showTime)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 col-span-2 lg:col-span-1">
                      <p className="text-[11px] text-gray-500">Seats</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5 truncate">
                        <Armchair size={13} className="text-gray-400" />
                        {booking?.seatLabels || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 col-span-2 lg:col-span-1">
                      <p className="text-[11px] text-gray-500">Amount</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
                        <IndianRupee size={13} className="text-gray-400" />
                        {Number(booking?.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 mt-3">
                    <p className="text-[11px] text-gray-500">Theater</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5 truncate">
                      <MapPin size={13} className="text-gray-400" />
                      {booking?.show?.theater?.name || "-"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate("/ticketPage", {
                        state: {
                          movie: booking?.show?.movie,
                          show: booking?.show,
                          theater: booking?.show?.theater,
                          date: booking?.show?.showDate,
                          time: booking?.show?.showTime,
                          seatLabels: booking?.seatLabels ? booking.seatLabels.split(",").map((s) => s.trim()) : [],
                          bookingId: booking?.bookingReference,
                          totalPrice: booking?.totalAmount,
                          paymentStatus: booking?.paymentStatus,
                        },
                      })}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100"
                    >
                      View Ticket
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        disabled={cancelLoadingId === booking.bookingId}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {cancelLoadingId === booking.bookingId ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <CircleX size={14} />
                            Cancel Ticket
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {booking.paymentStatus === "CANCELLED" && refundInfo && (
                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                      <p className="font-semibold text-gray-800">Cancellation Status: Cancelled</p>
                      <p className="text-gray-700 mt-1">Refund Status: {formatRefundStatus(refundInfo.refundStatus)}</p>
                      <p className="text-gray-700">Refund Amount: Rs {Number(refundInfo.refundAmount || 0).toFixed(2)}</p>
                      {refundInfo.refundReference && (
                        <p className="text-gray-600">Refund Reference: {refundInfo.refundReference}</p>
                      )}
                      {refundInfo.failureReason && (
                        <p className="text-red-600">Reason: {refundInfo.failureReason}</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {showCancelModal && cancelPreview && selectedBooking && (
        <div
          className="fixed inset-0 z-[1105] bg-black/75 backdrop-blur-md flex items-center justify-center px-3 py-3 sm:px-4 sm:py-6"
          onClick={closeCancelModal}
        >
          <div
            className="w-full max-w-lg max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] rounded-[28px] bg-[#1a120d] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] border border-white/10 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-4 border-b border-white/10 bg-gradient-to-r from-[#23160f] via-[#1a120d] to-[#271913]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300 font-semibold">Refund preview</p>
                  <h3 className="mt-1 text-xl sm:text-2xl font-bold leading-tight">
                    Cancel {selectedBooking?.show?.movie?.title || "this booking"}?
                  </h3>
                </div>
                <button
                  onClick={closeCancelModal}
                  className="shrink-0 h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white transition flex items-center justify-center"
                  aria-label="Close cancellation preview"
                >
                  <CircleX size={18} />
                </button>
              </div>

              <p className="mt-3 text-sm text-white/72 leading-6">
                {cancelPreview?.message || "Review the refund details before confirming cancellation."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-semibold">
                  Seats released instantly
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 font-semibold">
                  Convenience fee not refunded
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-4 shadow-inner shadow-black/10">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/65">Refundable amount</span>
                    <span className="font-semibold text-white">Rs {Number(cancelPreview?.refundableAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/65">Convenience fee deducted</span>
                    <span className="font-semibold text-white">Rs {Number(cancelPreview?.convenienceFeeDeducted || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/65">Applicable refund</span>
                    <span className="font-semibold text-white">{Number(cancelPreview?.refundPercentage || 0).toFixed(0)}% = Rs {Number(cancelPreview?.refundAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/65">Current refund status</span>
                    <span className="font-semibold uppercase tracking-wide text-amber-200">{formatRefundStatus(cancelPreview?.refundStatus)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Booking summary</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-black/10 px-3 py-2">
                    <p className="text-[11px] text-white/50">Movie</p>
                    <p className="mt-1 font-medium truncate">{selectedBooking?.show?.movie?.title || "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-black/10 px-3 py-2">
                    <p className="text-[11px] text-white/50">Seats</p>
                    <p className="mt-1 font-medium truncate">{selectedBooking?.seatLabels || "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-black/10 px-3 py-2 col-span-2">
                    <p className="text-[11px] text-white/50">Theater</p>
                    <p className="mt-1 font-medium truncate">{selectedBooking?.show?.theater?.name || "-"}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/55 leading-5">
                Refund status will update in real time after cancellation. If refund initiation fails, the booking remains cancelled and the status will show the failure reason.
              </p>
            </div>

            <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-3 px-5 py-4 border-t border-white/10 bg-[#18110d]/95 backdrop-blur">
              <button
                onClick={closeCancelModal}
                disabled={confirmingCancellation}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                disabled={confirmingCancellation}
                className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-bold text-[#2d1a00] hover:from-amber-300 hover:to-orange-400 disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
              >
                {confirmingCancellation ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
