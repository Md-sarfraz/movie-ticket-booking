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
  { movie, show, theater, time, date, allSeats = [], ticketCount = 0, totalPrice = 0, bookingId, theaterCity },
  ref
) {
  const posterUrl = movie?.postUrl || movie?.imageUrl || null;
  const accent = "#c81e1e";
  const bookingCode = String(bookingId || "BOOKING").slice(-8).toUpperCase();

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

  const resolvedTicketCount = allSeats.length > 0 ? allSeats.length : ticketCount;
  const seatValue = allSeats.length > 0 ? allSeats.join(", ") : "General Admission";

  const details = [
    { label: "Cinema", value: theater?.name || "N/A" },
    { label: "Location", value: theater?.location || theaterCity || "N/A" },
    { label: "Screen", value: show?.screenNumber || "N/A" },
    { label: "Date", value: formatDate(date) },
    { label: "Show Time", value: time || "N/A" },
    { label: `Seats (${resolvedTicketCount})`, value: seatValue },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: "-9999px",
        width: `${TICKET_W}px`,
        height: `${TICKET_H}px`,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "230px 1fr 200px",
          borderRadius: "24px",
          border: "2px solid #e5e7eb",
          boxSizing: "border-box",
          background: "linear-gradient(145deg,#ffffff 0%,#fff8f8 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "228px",
            width: "2px",
            height: "100%",
            background: "repeating-linear-gradient(to bottom, #d1d5db 0 7px, transparent 7px 14px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "200px",
            width: "2px",
            height: "100%",
            background: "repeating-linear-gradient(to bottom, #d1d5db 0 7px, transparent 7px 14px)",
          }}
        />

        <div style={{ position: "relative", overflow: "hidden" }}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie?.title || "Movie"}
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(155deg,#f43f5e 0%,#b91c1c 100%)",
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 58%)",
            }}
          />
          <div style={{ position: "absolute", left: "12px", bottom: "12px", right: "12px", color: "#fff" }}>
            <div style={{ fontSize: "10px", opacity: 0.9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Admission Pass
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", lineHeight: 1.2, marginTop: "4px" }}>{movie?.title}</div>
          </div>
        </div>

        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div>
              <div
                style={{
                  color: accent,
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                }}
              >
                Booking Confirmed
              </div>
              <div style={{ color: "#111827", fontSize: "21px", fontWeight: "800", lineHeight: 1.2, marginTop: "4px" }}>
                {movie?.title}
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "7px", flexWrap: "wrap" }}>
                {[show?.category, movie?.language, show?.format].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#334155",
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "999px",
                      padding: "2px 8px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#111827",
                color: "#fff",
                borderRadius: "12px",
                padding: "8px 10px",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
              }}
            >
              Paid
            </div>
          </div>

          <div style={{ borderTop: "1px dashed #cbd5e1" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", flex: 1 }}>
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
                    color: "#0f172a",
                    fontSize: "12px",
                    fontWeight: "700",
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px dashed #cbd5e1" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
            <div>
              <div style={{ color: "#64748b", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Booking ID
              </div>
              <div style={{ color: accent, fontSize: "16px", fontWeight: "800", letterSpacing: "1.1px" }}>{bookingId}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#64748b", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Amount Paid
              </div>
              <div style={{ color: "#0f172a", fontSize: "22px", fontWeight: "800" }}>&#8377;{Number(totalPrice || 0).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "18px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg,#fff 0%,#f8fafc 100%)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#64748b", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Gate Scan</div>
            <div style={{ color: "#0f172a", fontSize: "12px", fontWeight: "700", marginTop: "4px" }}>Ticket ID</div>
            <div style={{ color: accent, fontSize: "13px", fontWeight: "800", letterSpacing: "0.08em", marginTop: "2px" }}>{bookingCode}</div>
          </div>

          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #d1d5db", padding: "10px", boxShadow: "0 8px 18px rgba(15,23,42,0.09)" }}>
            <QRCodeSVG value={qrValue} size={118} level="H" includeMargin={false} />
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#0f172a", fontSize: "10px", fontWeight: "700" }}>Show this at entry</div>
            <div style={{ color: "#64748b", fontSize: "9px", marginTop: "2px" }}>Valid for one-time use only</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export { TICKET_W, TICKET_H };
export default TicketDownload;
