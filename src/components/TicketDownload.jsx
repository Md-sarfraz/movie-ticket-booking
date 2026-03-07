import React from "react";
import { QRCodeSVG } from "qrcode.react";

// Fixed pixel dimensions used for both the DOM element and the PDF export.
// html2canvas captures this div; jsPDF writes at these exact sizes.
const TICKET_W = 820;
const TICKET_H = 370;

/**
 * Hidden off-screen ticket layout.
 * Pass a ref from the parent; html2canvas will capture this element when
 * the user clicks "Download Ticket".
 *
 * Props (all from location.state / ticketPage):
 *   movie, show, theater, time, date, allSeats[], totalPrice, bookingId, theaterCity
 */
const TicketDownload = React.forwardRef(function TicketDownload(
  { movie, show, theater, time, date, allSeats = [], totalPrice = 0, bookingId, theaterCity },
  ref
) {
  const posterUrl = movie?.postUrl || movie?.imageUrl || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const qrValue = JSON.stringify({
    bookingId,
    movie: movie?.title,
    theater: theater?.name,
    date: formatDate(date),
    time,
    seats: allSeats,
  });

  const details = [
    { label: "Cinema", value: theater?.name || "N/A" },
    { label: "Location", value: theater?.location || theaterCity || "N/A" },
    { label: "Screen", value: show?.screenNumber || "N/A" },
    { label: "Date", value: formatDate(date) },
    { label: "Show Time", value: time || "N/A" },
    { label: `Seats (${allSeats.length})`, value: allSeats.join(", ") || "N/A" },
  ];

  return (
    /* Positioned far off-screen so it is in the render tree (required by
       html2canvas) but never visible to the user. */
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: "-9999px",
        width: `${TICKET_W}px`,
        height: `${TICKET_H}px`,
        display: "flex",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* ── Left column: Movie Poster ── */}
      <div style={{ width: "215px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie?.title || "Movie"}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          /* Fallback gradient when no poster is available */
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(160deg,#e51937 0%,#7c0e1f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: "800", textAlign: "center", lineHeight: 1.3 }}>
              {movie?.title}
            </span>
          </div>
        )}
        {/* Right-edge gradient so poster blends into the light background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, transparent 60%, #ffffff 100%)",
          }}
        />
      </div>

      {/* ── Right column: Ticket Details ── */}
      <div
        style={{
          flex: 1,
          padding: "22px 26px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        {/* Row 1 — brand / title / QR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: "#e51937",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              TicketFlix &nbsp;&bull;&nbsp; Booking Confirmed
            </div>
            <div
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: "800",
                lineHeight: 1.25,
                wordBreak: "break-word",
              }}
            >
              {movie?.title}
            </div>
            {/* Format / Language / Category tags */}
            <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
              {[show?.category, movie?.language, show?.format]
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#f3f4f6",
                      color: "#374151",
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* QR Code */}
          <div style={{ background: "#ffffff", padding: "8px", borderRadius: "8px", flexShrink: 0 }}>
            <QRCodeSVG value={qrValue} size={86} level="H" includeMargin={false} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1.5px dashed #d1d5db" }} />

        {/* Row 2 — 3-column details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 18px" }}>
          {details.map(({ label, value }) => (
            <div key={label} style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "2px",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  color: "#111827",
                  fontSize: "12px",
                  fontWeight: "600",
                  wordBreak: "break-word",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1.5px dashed #d1d5db", marginTop: "auto" }} />

        {/* Row 3 — Booking ID + Amount */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Booking ID
            </div>
            <div style={{ color: "#e51937", fontSize: "16px", fontWeight: "800", letterSpacing: "1.5px" }}>
              {bookingId}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#64748b", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Amount Paid
            </div>
            <div style={{ color: "#111827", fontSize: "20px", fontWeight: "800" }}>
              &#8377;{Number(totalPrice || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export { TICKET_W, TICKET_H };
export default TicketDownload;
