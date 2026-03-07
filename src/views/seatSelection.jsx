import React, { useState, useEffect } from "react";
import { Check, X, Ticket, CreditCard, Film, Calendar, Clock, MapPin, Monitor, ChevronLeft, Users, IndianRupee } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { myAxios } from "@/services/helper";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Get booking data from location state
  const location = useLocation();
  const { movie, show, theater, time, date } = location.state || {};
  
  // Redirect if no booking data
  useEffect(() => {
    if (!movie || !show || !theater) {
      navigate('/movies');
    }
  }, [movie, show, theater, navigate]);

  // Seat price from show data
  const seatPrice = show?.price || 0;

  // Creating a dynamic theater layout with rows labeled A-L
  const rowLabels = "ABCDEFGHIJKL".split("");
  const seatsPerRow = 14; // 6 left + aisle + 7 right
  
  // Fetch booked seats from backend
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!show?.showId) {
        setLoading(false);
        return;
      }

      try {
        const response = await myAxios.get(
          `/bookings/show/${show.showId}/booked-seats`
        );
        
        // Expected format: ["A1", "A2", "B5", etc.]
        setBookedSeats(response.data || []);
      } catch (error) {
        console.error("Error fetching booked seats:", error);
        // Generate sample booked seats for demo
        const sampleBooked = [];
        for (let i = 0; i < rowLabels.length; i++) {
          const randomSeats = Math.floor(Math.random() * 5) + 2;
          for (let j = 0; j < randomSeats; j++) {
            const seatNum = Math.floor(Math.random() * seatsPerRow) + 1;
            sampleBooked.push(`${rowLabels[i]}${seatNum}`);
          }
        }
        setBookedSeats(sampleBooked);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [show?.showId]);

  // Get seat label for a given position
  const getSeatLabel = (rowIndex, seatIndex) => {
    // Account for aisle at column 6
    const seatNum = seatIndex >= 7 ? seatIndex : seatIndex + 1;
    return `${rowLabels[rowIndex]}${seatNum}`;
  };

  // Check if a seat is booked
  const isSeatBooked = (rowIndex, seatIndex) => {
    const label = getSeatLabel(rowIndex, seatIndex);
    return bookedSeats.includes(label);
  };

  // Check if a seat is selected
  const isSeatSelected = (rowIndex, seatIndex) => {
    return selectedSeats.some(
      (seat) => seat.row === rowIndex && seat.index === seatIndex
    );
  };

  // Handle seat selection
  const handleSeatClick = (rowIndex, seatIndex) => {
    if (isSeatBooked(rowIndex, seatIndex)) return;

    const isSelected = isSeatSelected(rowIndex, seatIndex);
    const seatLabel = getSeatLabel(rowIndex, seatIndex);

    setSelectedSeats((prevSeats) =>
      isSelected
        ? prevSeats.filter(
            (seat) => seat.row !== rowIndex || seat.index !== seatIndex
          )
        : [...prevSeats, { row: rowIndex, index: seatIndex, label: seatLabel, price: seatPrice }]
    );
  };

  /**
   * Industry-standard Razorpay payment flow:
   * 1. Backend creates order (amount computed server-side, tamper-proof)
   * 2. Frontend opens Razorpay modal with server's order_id
   * 3. On success, backend verifies HMAC-SHA256 signature (secret key never leaves server)
   * 4. Backend confirms booking in DB and returns booking details
   */
  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;
    setPaymentLoading(true);

    try {
      // ── STEP 1: Create order on backend (amount calculated server-side) ──
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : null;
      const orderRes = await myAxios.post('/payment/create-order', {
        showId: show?.showId,
        seatLabels: selectedSeats.map(s => s.label),
        userId: userId
      });

      const { razorpayOrderId, amountInPaise, currency, keyId, bookingId, bookingReference } = orderRes.data?.data || orderRes.data;

      // ── STEP 2: Open Razorpay modal with server's order_id ──
      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: keyId,                        // public key returned by backend
        amount: amountInPaise,             // in paise, from server
        currency: currency,
        order_id: razorpayOrderId,         // server-side order id (crucial)
        name: 'BookShow',
        description: `Booking for ${movie?.title}`,
        image: movie?.postUrl || '',
        handler: async function (response) {
          // ── STEP 3: Send payment details to backend for signature verification ──
          try {
            const verifyRes = await myAxios.post('/payment/verify', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            // ── STEP 4: Signature valid → booking confirmed in DB → navigate ──
            const confirmed = verifyRes.data?.data || verifyRes.data;
            navigate('/ticketPage', {
              state: {
                movie,
                show,
                theater,
                time,
                date,
                seats:           confirmed.seatLabels?.split(',') || [],
                seatLabels:      confirmed.seatLabels?.split(',') || [],
                totalPrice:      confirmed.totalAmount,
                basePrice:       confirmed.baseAmount,
                convenienceFee:  confirmed.convenienceFee,
                discount:        confirmed.discount || 0,
                bookingId:       confirmed.bookingReference,
                paymentId:       confirmed.razorpayPaymentId,
              }
            });
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            alert('Payment verification failed. Please contact support with your payment ID: '
              + response.razorpay_payment_id);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: { name: '', email: '', contact: '' },
        notes: {
          movie:    movie?.title,
          theater:  theater?.name,
          seats:    selectedSeats.map(s => s.label).join(', '),
          showDate: date,
          showTime: time
        },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setPaymentLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async function (response) {
        console.error('Payment failed:', response.error);
        // Mark booking as FAILED in DB so it doesn't stay PENDING indefinitely
        try {
          await myAxios.post(`/payment/failed?razorpayOrderId=${options.order_id}`);
        } catch (failErr) {
          console.warn('Could not mark booking as failed on backend:', failErr);
        }
        alert(`Payment Failed: ${response.error.description || 'Something went wrong'}`);
        setPaymentLoading(false);
      });
      razorpay.open();

    } catch (err) {
      console.error('Error initiating payment:', err);
      const msg = err?.response?.data?.error || err.message || 'Failed to initiate payment';
      alert(`Error: ${msg}`);
      setPaymentLoading(false);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedSeats.length * seatPrice;
  };

  // Get availability stats
  const getAvailabilityStats = () => {
    const total = rowLabels.length * (seatsPerRow - 1); // -1 for aisle
    const booked = bookedSeats.length;
    const available = total - booked - selectedSeats.length;
    return { total, booked, available, selected: selectedSeats.length };
  };

  const stats = getAvailabilityStats();

  // Debug: Log movie data to check image URLs
  useEffect(() => {
    if (movie) {
      console.log("Movie data in seatSelection:", movie);
      console.log("postUrl:", movie.postUrl);
      console.log("backgroundImageUrl:", movie.backgroundImageUrl);
    }
  }, [movie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (!movie || !show) {
    return null;
  }

  // Construct proper image URLs
  const posterUrl = movie.postUrl || movie.imageUrl || 'https://via.placeholder.com/400x600?text=No+Poster';
  const backgroundUrl = movie.backgroundImageUrl || movie.bannerUrl || movie.postUrl || 'https://via.placeholder.com/1920x1080?text=Background';

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-6">
      {/* Movie Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 mt-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <img
            src={posterUrl}
            alt={movie.title}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster'; }}
            className="w-10 h-14 object-cover rounded-md shadow-sm shrink-0"
          />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
            <span className="font-bold text-gray-900 text-base">{movie.title}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={13} className="text-red-400" />
              {theater?.name}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar size={13} className="text-red-400" />
              {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={13} className="text-red-400" />
              {time}
            </span>
            {show?.screenNumber && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Monitor size={13} className="text-red-400" />
                {show.screenNumber}
              </span>
            )}
            {show?.language && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {show.language}{show?.format ? ` • ${show.format}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Seat Selection Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-3 md:p-4">
              {/* All eyes this way please! */}
              <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-3">
                  All eyes this way please!
                </h2>
                
                {/* Screen */}
                <div className="mb-4">
                  <div className="relative">
                    <div className="w-full max-w-4xl mx-auto h-1.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent rounded-full mb-2"></div>
                    <p className="text-center text-gray-500 text-xs font-medium uppercase tracking-wide">Screen</p>
                  </div>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-max mx-auto">
                  {rowLabels.map((row, rowIndex) => (
                    <div key={row} className="flex items-center justify-center gap-0.5 md:gap-1 mb-1">
                      {/* Row Label - Left */}
                      <div className="w-4 md:w-6 text-center font-bold text-gray-500 text-[10px] md:text-xs">
                        {row}
                      </div>

                      {/* Seats */}
                      {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                        // Aisle at index 6
                        if (seatIndex === 6) {
                          return (
                            <div 
                              key={`aisle-${rowIndex}-${seatIndex}`} 
                              className="w-3 md:w-6 flex items-center justify-center"
                            >
                              <div className="text-gray-300 text-xs">••</div>
                            </div>
                          );
                        }

                        const isBooked = isSeatBooked(rowIndex, seatIndex);
                        const isSelected = isSeatSelected(rowIndex, seatIndex);
                        const seatLabel = getSeatLabel(rowIndex, seatIndex);

                        const seatColor = isBooked
                          ? '#d1d5db'
                          : isSelected
                          ? '#f97316'
                          : '#10b981';

                        return (
                          <button
                            key={`${rowIndex}-${seatIndex}`}
                            onClick={() => handleSeatClick(rowIndex, seatIndex)}
                            onMouseEnter={() => setHoveredSeat({ row: rowIndex, index: seatIndex })}
                            onMouseLeave={() => setHoveredSeat(null)}
                            disabled={isBooked}
                            title={seatLabel}
                            className={`transition-transform duration-150 ${
                              !isBooked ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed'
                            }`}
                            style={{ background: 'none', border: 'none', padding: 0 }}
                          >
                            {/* Cinema seat SVG icon */}
                            <svg width="22" height="20" viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg">
                              {/* seat back */}
                              <rect x="2" y="0" width="18" height="12" rx="3" fill={seatColor} />
                              {/* seat cushion */}
                              <rect x="1" y="12" width="20" height="5" rx="2" fill={seatColor} />
                              {/* left leg */}
                              <rect x="3" y="17" width="3" height="3" rx="1" fill={seatColor} />
                              {/* right leg */}
                              <rect x="16" y="17" width="3" height="3" rx="1" fill={seatColor} />
                              {/* shine on back */}
                              {!isBooked && <rect x="5" y="2" width="6" height="2" rx="1" fill="white" opacity="0.25" />}
                            </svg>
                          </button>
                        );
                      })}

                      {/* Row Label - Right */}
                      <div className="w-4 md:w-6 text-center font-bold text-gray-500 text-[10px] md:text-xs">
                        {row}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
                {[{ color: '#10b981', label: 'Available' }, { color: '#d1d5db', label: 'Booked' }, { color: '#f97316', label: 'Selected' }].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <svg width="18" height="16" viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="0" width="18" height="12" rx="3" fill={color} />
                      <rect x="1" y="12" width="20" height="5" rx="2" fill={color} />
                      <rect x="3" y="17" width="3" height="3" rx="1" fill={color} />
                      <rect x="16" y="17" width="3" height="3" rx="1" fill={color} />
                    </svg>
                    <span className="text-xs text-gray-700 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Hover info */}
              <div className="text-center mt-3 h-10 flex items-center justify-center">
                {hoveredSeat && !isSeatBooked(hoveredSeat.row, hoveredSeat.index) && (
                  <div className="px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-sm font-medium text-gray-700">
                      Seat {getSeatLabel(hoveredSeat.row, hoveredSeat.index)} - ₹{seatPrice}
                      {isSeatSelected(hoveredSeat.row, hoveredSeat.index) ? " (Selected)" : " (Available)"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-5 sticky top-24">
              <h2 className="text-base font-bold text-gray-800 mb-3">
                Your selected seats
              </h2>

              {/* Selected Seats Badges */}
              <div className="mb-4">
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedSeats.map((seat) => (
                      <span
                        key={`badge-${seat.row}-${seat.index}`}
                        className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                      >
                        {seat.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs mb-3">No seats selected</p>
                )}
              </div>

              {/* Price Breakdown */}
              {selectedSeats.length > 0 && (
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {show?.category || 'First Class'} ({selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold text-gray-800">
                      {calculateTotal()}.00
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Convenience Fess</span>
                    <span className="font-semibold text-gray-800">
                      {(calculateTotal() * 0.1).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-emerald-600">
                    <span>Get 18%</span>
                    <span className="font-semibold">
                      {(calculateTotal() * 0.18).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">Grant Total</span>
                      <span className="text-base font-bold text-gray-800">
                        Rs. {(calculateTotal() + calculateTotal() * 0.1 - calculateTotal() * 0.18).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handlePayment}
                  disabled={selectedSeats.length === 0 || paymentLoading}
                  className={`
                    w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 flex items-center justify-center gap-2
                    ${selectedSeats.length > 0 && !paymentLoading
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {paymentLoading
                    ? ( <><svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing...</> )
                    : selectedSeats.length > 0
                      ? `Pay Rs.${(calculateTotal() + calculateTotal() * 0.1 - calculateTotal() * 0.18).toFixed(2)}`
                      : 'Select Seats to Continue'
                  }
                </button>

                {selectedSeats.length > 0 && (
                  <button
                    onClick={() => setSelectedSeats([])}
                    className="w-full py-2 rounded-xl font-medium text-gray-600 text-sm border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {/* Availability Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{stats.available} available</span>
                  <span>{stats.booked} booked</span>
                  <span>{stats.selected} selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;