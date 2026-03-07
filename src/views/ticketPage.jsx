import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Download, Home, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const printStyles = `
  @media print {
    body > *:not(#ptroot) { display: none !important; }
    #ptroot { display: block !important; position: fixed; inset: 0; background: #fff; }
    @page { margin: 12mm; size: A4 portrait; }
  }
  #ptroot { display: none; }
`;

export default function TicketConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    movie,
    show,
    theater,
    time,
    date,
    seats = [],
    seatLabels = [],
    totalPrice = 0,
    convenienceFee = 0,
    discount = 0,
    bookingId = "BTS" + Date.now().toString().slice(-8),
    paymentId = "PAY" + Date.now().toString().slice(-8),
  } = location.state || {};

  const allSeats = seatLabels.length > 0 ? seatLabels : seats;
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

  const qrValue = JSON.stringify({
    bookingId,
    movie: movie?.title,
    theater: theater?.name,
    date: formatDate(date),
    time,
    seats: allSeats,
    amount: totalPrice,
  });

  const handleDownload = () => {
    window.print();
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

  return (
    <>
      <style>{printStyles}</style>

      {/* === Print-only BookMyShow-style ticket === */}
      <div id="ptroot">
        <div style={{
          maxWidth: "620px", margin: "0 auto", fontFamily: "Arial, sans-serif",
          border: "1px solid #d1d5db", borderRadius: "12px", overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)"
        }}>
          {/* Red header */}
          <div style={{ background: "#e51937", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>TicketFlix</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: "600" }}>Booking Confirmed </span>
          </div>

          {/* Movie name + tags */}
          <div style={{ padding: "22px 24px 0" }}>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#111", marginBottom: "8px" }}>{movie?.title}</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {[show?.category, movie?.language, show?.format].filter(Boolean).map((tag) => (
                <span key={tag} style={{ background: "#f3f4f6", color: "#374151", fontSize: "11px", padding: "3px 10px", borderRadius: "4px" }}>{tag}</span>
              ))}
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", marginBottom: "20px" }}>
              {[
                { label: "Cinema", value: theater?.name, sub: theater?.location || theaterCity },
                { label: "Screen", value: show?.screenNumber || "N/A" },
                { label: "Date", value: formatDate(date) },
                { label: "Show Time", value: time },
                { label: `Seats (${allSeats.length})`, value: allSeats.join(", ") || "N/A" },
                { label: "Amount Paid", value: `?${Number(totalPrice || 0).toFixed(2)}` },
              ].map(({ label, value, sub }) => (
                <div key={label}>
                  <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>{label}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#111" }}>{value}</div>
                  {sub && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "1px" }}>{sub}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Tear line */}
          <div style={{ display: "flex", alignItems: "center", padding: "0 0" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f3f4f6", border: "1px solid #e5e7eb", marginLeft: "-10px", flexShrink: 0 }} />
            <div style={{ flex: 1, borderTop: "2px dashed #d1d5db" }} />
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f3f4f6", border: "1px solid #e5e7eb", marginRight: "-10px", flexShrink: 0 }} />
          </div>

          {/* QR + booking ID */}
          <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "24px", background: "#fafafa" }}>
            <div style={{ flexShrink: 0 }}>
              <QRCodeSVG value={qrValue} size={110} level="H" includeMargin={false} />
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Booking ID</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#111", letterSpacing: "1.5px", marginBottom: "8px" }}>{bookingId}</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>Show this QR code at the cinema entry</div>
            </div>
          </div>
        </div>
      </div>

      {/* === Screen view === */}
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 shrink-0">
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Thank you for your purchase!</h2>
              <p className="text-sm text-gray-600 mt-0.5">Your booking has been confirmed</p>
            </div>
          </div>

          {/* Main Ticket Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6 p-6">

              {/* Left – Movie Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{movie?.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                    {show?.category && <span className="px-2 py-1 bg-gray-100 rounded">{show.category}</span>}
                    {movie?.language && <><span>|</span><span>{movie.language}</span></>}
                    {show?.format && <><span>|</span><span>{show.format}</span></>}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{theater?.name}</p>
                      <p className="text-sm text-gray-500">{theater?.location || theaterCity}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 w-20">SCREEN</span>
                    <span className="text-sm font-semibold text-gray-900">{show?.screenNumber || "N/A"}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">{formatDate(date)}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">{time}</span>
                  </div>

                  <div className="flex items-start">
                    <Ticket className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {allSeats.length} Ticket{allSeats.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{allSeats.join(", ") || "Seats"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-300 my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Booking ID</p>
                    <p className="font-bold text-gray-900">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Paid</p>
                    <p className="font-bold text-lg text-gray-900">?{Number(totalPrice || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">BOOKING DATE & TIME</span>
                    <span className="text-gray-700 font-medium">{currentDateTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">CONFIRMATION NO.</span>
                    <span className="text-gray-700 font-medium">{paymentId?.slice(-6) || bookingId?.slice(-6)}</span>
                  </div>
                </div>
              </div>

              {/* Right – QR Code */}
              <div className="md:col-span-1 flex flex-col items-center justify-start md:border-l-2 md:border-dashed md:border-gray-300 md:pl-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">YOUR TICKET QR CODE</p>
                <div className="bg-white p-3 border-2 border-gray-200 rounded-lg inline-block">
                  <QRCodeSVG value={qrValue} size={160} level="H" includeMargin={false} />
                </div>
                <p className="text-xs text-gray-500 mt-3 px-4 text-center">Show this QR code at cinema entry</p>
                <p className="font-bold text-lg text-gray-900 mt-4">{bookingId}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD TICKET
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                BACK TO HOME
              </button>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 text-white flex flex-col sm:flex-row items-center justify-between shadow-md gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                <span className="text-2xl"></span>
              </div>
              <p className="font-bold text-sm">Get 2 Free Movie tickets every month with TicketFlix RBL Bank Fun+ Credit Card</p>
            </div>
            <button className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              INSTANT APPROVAL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
