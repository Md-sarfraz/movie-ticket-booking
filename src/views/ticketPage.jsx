import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Download, Home, Calendar, Clock, MapPin, Ticket, User, BadgeCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import TicketDownload, { TICKET_W, TICKET_H } from "../components/TicketDownload";
import { getEventTicketByBookingReference } from "@/services/event-booking-service";
import PostPaymentProgress from "@/components/PostPaymentProgress";

export default function TicketConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef(null);
  const [remoteEventTicket, setRemoteEventTicket] = useState(null);
  const [ticketReady, setTicketReady] = useState(!location.state?.showPostPaymentFlow);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingReference = params.get("eventBookingRef");

    if (!bookingReference || location.state?.movie) {
      return;
    }

    const loadEventTicket = async () => {
      try {
        const data = await getEventTicketByBookingReference(bookingReference);
        setRemoteEventTicket(data);
      } catch (error) {
        console.error("Failed to fetch event ticket", error);
      }
    };

    loadEventTicket();
  }, [location.search, location.state]);

  const localState = location.state || {};
  const mappedRemoteState = remoteEventTicket
    ? {
        bookingId: remoteEventTicket.bookingReference,
        ticketId: remoteEventTicket.ticketId,
        qrCode: remoteEventTicket.qrCode,
        totalPrice: remoteEventTicket.totalAmount,
        customerName: remoteEventTicket.customerName,
        paymentStatus: remoteEventTicket.paymentStatus,
        ticketCount: remoteEventTicket.ticketCount,
        date: remoteEventTicket.eventDate,
        time: remoteEventTicket.eventTime,
        movie: {
          title: remoteEventTicket.eventName,
          language: "Event",
        },
        show: {
          category: "Event",
          format: "Live",
        },
        theater: {
          name: remoteEventTicket.eventLocation,
          location: remoteEventTicket.eventLocation,
        },
        seatLabels: [],
      }
    : {};

  const viewState = {
    ...mappedRemoteState,
    ...localState,
  };

  const {
    movie,
    show,
    theater,
    time,
    date,
    seats = [],
    seatLabels = [],
    ticketCount = 0,
    customerName = "",
    paymentStatus = "PAID",
    totalPrice = 0,
    convenienceFee = 0,
    discount = 0,
    bookingId = "BTS" + Date.now().toString().slice(-8),
    paymentId = "PAY" + Date.now().toString().slice(-8),
    ticketId = "EVTKT" + Date.now().toString().slice(-8),
    qrCode,
  } = viewState;

  const userName = (() => {
    if (customerName) return customerName;
    try {
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      return localUser?.name || localUser?.fullName || "Guest";
    } catch {
      return "Guest";
    }
  })();

  const allSeats = seatLabels.length > 0 ? seatLabels : seats;
  const seatsCount = allSeats.length > 0 ? allSeats.length : ticketCount;
  const seatInfoText = allSeats.length > 0 ? allSeats.join(", ") : "General Admission";
  const theaterCity =
    typeof theater?.city === "object" ? theater?.city?.name : theater?.city;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const currentDateTime = new Date().toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrValue = qrCode || JSON.stringify({
    bookingId,
    movie: movie?.title,
    theater: theater?.name,
    date: formatDate(date),
    time,
    seats: allSeats,
    amount: totalPrice,
  });

  const bannerImage = movie?.bannerUrl || movie?.backgroundImageUrl || movie?.imageUrl || movie?.postUrl;

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgW = TICKET_W;
      const imgH = TICKET_H;
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [imgW, imgH],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgW, imgH);
      pdf.save(`ticket-${bookingId || "booking"}.pdf`);
    } catch (err) {
      console.error("Ticket download failed:", err);
      alert("Could not generate ticket PDF. Please try again.");
    }
  };

  if (!movie || !theater) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No booking information found</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!ticketReady) {
    return (
      <PostPaymentProgress
        eventName={movie?.title}
        onComplete={() => setTicketReady(true)}
        durationMs={2200}
      />
    );
  }

  return (
    <>
      <TicketDownload
        ref={ticketRef}
        movie={movie}
        show={show}
        theater={theater}
        time={time}
        date={date}
        allSeats={allSeats}
        ticketCount={ticketCount}
        totalPrice={totalPrice}
        bookingId={bookingId}
        theaterCity={theaterCity}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-orange-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-4 md:p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Booking Confirmed ✅</h2>
              <p className="text-sm text-slate-600">Your ticket is ready to use at entry.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            {bannerImage && (
              <div className="relative h-40 md:h-56 overflow-hidden">
                <img src={bannerImage} alt={movie?.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">E-Ticket</p>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{movie?.title}</h1>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-[1.3fr_0.9fr]">
              <div className="p-5 md:p-7 space-y-5">
                {!bannerImage && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-700">E-Ticket</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{movie?.title}</h1>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">User Name</p>
                    <p className="text-base font-semibold text-slate-900 mt-1 flex items-center gap-2">
                      <User size={16} className="text-slate-500" />
                      {userName}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Payment Status</p>
                    <p className="text-base font-semibold text-emerald-700 mt-1 flex items-center gap-2">
                      <BadgeCheck size={16} />
                      {String(paymentStatus || "PAID").toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">Date</p>
                      <p className="text-sm font-medium text-slate-900">{formatDate(date) || "TBD"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">Time</p>
                      <p className="text-sm font-medium text-slate-900">{time || "TBD"}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">Venue</p>
                      <p className="text-sm font-semibold text-slate-900">{theater?.name}</p>
                      <p className="text-sm text-slate-600">{theater?.location || theaterCity || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-slate-300 p-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 uppercase text-xs tracking-wide">Ticket ID</p>
                      <p className="font-bold text-slate-900 break-all">{ticketId}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase text-xs tracking-wide">Booking ID</p>
                      <p className="font-bold text-slate-900 break-all">{bookingId}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase text-xs tracking-wide">Tickets</p>
                      <p className="font-semibold text-slate-900">
                        {seatsCount} Ticket{seatsCount !== 1 ? "s" : ""}
                      </p>
                      <p className="text-slate-600 mt-1">{seatInfoText}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase text-xs tracking-wide">Amount Paid</p>
                      <p className="font-bold text-xl text-slate-900">₹{Number(totalPrice || 0).toFixed(2)}</p>
                      <p className="text-xs text-slate-500 mt-1">Booked on {currentDateTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-dashed border-slate-300 p-5 md:p-7 bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-3">Scan At Entry</p>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
                  <QRCodeSVG value={qrValue} size={180} level="H" includeMargin={false} />
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">Present this QR code at the event gate for quick verification.</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">Ref: {paymentId?.slice(-8) || bookingId?.slice(-8)}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 md:px-7 py-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Ticket
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 border border-slate-300 hover:bg-white text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                Back To Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
