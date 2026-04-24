import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CalendarDays, Clock3, MapPin, Ticket, Loader2, IndianRupee, CircleX, Armchair } from "lucide-react";
import { cancelUserBooking, getCancellationPreview, getUserBookings, getUserRefundHistory } from "@/services/booking-service";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const statusStyle = {
  CONFIRMED: "bg-green-100 text-green-700 border border-green-200",
  PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  COMPLETED: "bg-slate-100 text-slate-700 border border-slate-200",
};

const parseBackendDateTime = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const parsedFromNumber = new Date(value);
    return Number.isNaN(parsedFromNumber.getTime()) ? null : parsedFromNumber;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Backend LocalDateTime often arrives as "yyyy-MM-dd HH:mm:ss".
  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getBookingCreatedAtDate = (booking) => parseBackendDateTime(booking?.createdAt || booking?.bookingDate);

const formatDate = (date) => {
  const parsed = parseBackendDateTime(date);
  if (!parsed) return "-";
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatDateTime = (date) => {
  const parsed = parseBackendDateTime(date);
  if (!parsed) return "-";
  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatTime = (time) => {
  if (!time) return "-";
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const formatRefundStatus = (status) => {
  if (!status || status === "PENDING") return "REFUND_INITIATED";
  return status;
};

const CANCELLATION_WINDOW_HOURS = Number(import.meta.env.VITE_CANCELLATION_WINDOW_HOURS || 2);

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
        list.sort((a, b) => {
          const aTime = getBookingCreatedAtDate(a)?.getTime() || 0;
          const bTime = getBookingCreatedAtDate(b)?.getTime() || 0;
          return bTime - aTime;
        });
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

  const getCancellationState = (booking) => {
    const hours = Number.isFinite(CANCELLATION_WINDOW_HOURS) && CANCELLATION_WINDOW_HOURS >= 0
      ? CANCELLATION_WINDOW_HOURS
      : 2;

    if (!booking || booking.paymentStatus !== "CONFIRMED") {
      return { canCancel: false, expired: false, message: "" };
    }

    if (!booking?.createdAt) {
      return {
        canCancel: false,
        expired: true,
        message: `Cancellation not allowed after ${hours} hours`,
      };
    }

    const bookingTime = parseBackendDateTime(booking.createdAt);
    if (!bookingTime) {
      return {
        canCancel: false,
        expired: true,
        message: `Cancellation not allowed after ${hours} hours`,
      };
    }

    const elapsedMs = Date.now() - bookingTime.getTime();
    const cutoffMs = hours * 60 * 60 * 1000;
    const expired = elapsedMs > cutoffMs;

    return {
      canCancel: !expired,
      expired,
      message: expired ? `Cancellation not allowed after ${hours} hours` : "",
    };
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelPreview(null);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (booking) => {
    if (!user?.id) return;

    const cancellationState = getCancellationState(booking);
    if (!cancellationState.canCancel) {
      toast.info(cancellationState.message || "Cancellation window expired");
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
              const cancellationState = getCancellationState(booking);
              const canCancel = cancellationState.canCancel;
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
                      <p className="text-xs text-gray-500 mt-1">Booked on: {formatDateTime(booking?.createdAt || booking?.bookingDate)}</p>
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

                    {booking.paymentStatus === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        disabled={!canCancel || cancelLoadingId === booking.bookingId}
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
                            {canCancel ? "Cancel Ticket" : "Cancel Window Expired"}
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {booking.paymentStatus === "CONFIRMED" && !canCancel && cancellationState.message && (
                    <p className="mt-2 text-xs font-medium text-amber-700">
                      {cancellationState.message}
                    </p>
                  )}

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
          className="fixed inset-0 z-[1105] bg-white/70 backdrop-blur-sm flex items-center justify-center px-3 py-3 sm:px-4 sm:py-6"
          onClick={closeCancelModal}
        >
          <div
            className="w-full max-w-xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-4 border-b border-gray-200 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-red-500 font-semibold">Refund preview</p>
                  <h3 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    Cancel {selectedBooking?.show?.movie?.title || "this booking"}?
                  </h3>
                </div>
                <button
                  onClick={closeCancelModal}
                  className="shrink-0 h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition flex items-center justify-center"
                  aria-label="Close cancellation preview"
                >
                  <CircleX size={18} />
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-600 leading-6">
                {cancelPreview?.message || "Review the refund details before confirming cancellation."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 font-semibold">
                  Seats released instantly
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 font-semibold">
                  Convenience fee not refunded
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Refund Summary</p>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between gap-3 mt-2">
                    <span className="text-gray-600">Refundable amount</span>
                    <span className="font-semibold text-gray-900">Rs {Number(cancelPreview?.refundableAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Convenience fee deducted</span>
                    <span className="font-semibold text-gray-900">Rs {Number(cancelPreview?.convenienceFeeDeducted || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Applicable refund</span>
                    <span className="font-semibold text-emerald-700">{Number(cancelPreview?.refundPercentage || 0).toFixed(0)}% = Rs {Number(cancelPreview?.refundAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Current refund status</span>
                    <span className="font-semibold uppercase tracking-wide text-amber-700">{formatRefundStatus(cancelPreview?.refundStatus)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">Ticket Info</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                    <p className="text-[11px] text-gray-500">Movie</p>
                    <p className="mt-1 font-semibold text-gray-900 truncate">{selectedBooking?.show?.movie?.title || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                    <p className="text-[11px] text-gray-500">Seats</p>
                    <p className="mt-1 font-semibold text-gray-900 truncate">{selectedBooking?.seatLabels || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 col-span-2">
                    <p className="text-[11px] text-gray-500">Theater</p>
                    <p className="mt-1 font-semibold text-gray-900 truncate">{selectedBooking?.show?.theater?.name || "-"}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-5">
                Refund status will update in real time after cancellation. If refund initiation fails, the booking remains cancelled and the status will show the failure reason.
              </p>
            </div>

            <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-3 px-5 py-4 border-t border-gray-200 bg-white">
              <Button
                onClick={closeCancelModal}
                disabled={confirmingCancellation}
                variant="outline"
                className="h-11 rounded-xl text-gray-700"
              >
                Go Back
              </Button>
              <Button
                onClick={confirmCancellation}
                disabled={confirmingCancellation}
                variant="destructive"
                className="h-11 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                {confirmingCancellation ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
