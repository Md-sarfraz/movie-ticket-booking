import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Download, Home, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import BookTheShowLogo from "@/components/bookTheShowLogo";

export default function TicketConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking data from location state
  const {
    movie,
    show,
    theater,
    time,
    date,
    seats = [],
    seatLabels = [],
    totalPrice = 0,
    basePrice = 0,
    convenienceFee = 0,
    discount = 0,
    bookingId = "BTS" + Date.now().toString().slice(-8),
    paymentId = "PAY" + Date.now().toString().slice(-8)
  } = location.state || {};
  
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "12:00 PM";
    return timeStr;
  };

  const currentDateTime = new Date().toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Prepare booking details for QR code
  const bookingDetails = {
    bookingId: bookingId,
    movieName: movie?.title || "Movie Title",
    theaterName: theater?.name || "Theater Name",
    screen: show?.screenNumber || "Screen 3",
    date: formatDate(date),
    time: formatTime(time),
    seats: seatLabels.length > 0 ? seatLabels : seats,
    totalPrice: totalPrice
  };

  // Redirect to home if no booking data
  if (!movie || !theater) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No booking information found</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Thank you for your purchase!</h2>
            <p className="text-sm text-gray-600 mt-0.5">Your booking has been confirmed</p>
          </div>
        </div>

        {/* Main Ticket Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Ticket Content */}
          <div className="grid md:grid-cols-3 gap-6 p-6">
            
            {/* Left Section - Movie Details */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Movie Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {movie?.title || "Movie Title"}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded">{show?.category || "First Class"}</span>
                  <span>|</span>
                  <span>{movie?.language || "Hindi"}</span>
                  <span>|</span>
                  <span>2D</span>
                </div>
              </div>

              {/* Theater & Show Details */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{theater?.name || "Theater Name"}</p>
                    <p className="text-sm text-gray-500">{theater?.location || theater?.city || "Location"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-20">SCREEN</span>
                  <span className="text-sm font-semibold text-gray-900">{show?.screenNumber || "SCREEN 3"}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">{formatDate(date)}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">{formatTime(time)}</span>
                </div>

                <div className="flex items-start">
                  <Ticket className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {seatLabels.length || seats.length} Ticket{(seatLabels.length || seats.length) > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(seatLabels.length > 0 ? seatLabels : seats).join(', ') || 'Seats'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashed Divider */}
              <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Booking ID</p>
                  <p className="font-bold text-gray-900">{bookingId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Paid</p>
                  <p className="font-bold text-lg text-gray-900">Rs.{totalPrice?.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">BOOKING DATE & TIME</span>
                  <span className="text-gray-700 font-medium">{currentDateTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PAYMENT METHOD</span>
                  <span className="text-gray-700 font-medium">MobiKwik Wallet</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">CONFIRMATION NO.</span>
                  <span className="text-gray-700 font-medium">{paymentId?.slice(-6) || bookingId?.slice(-6)}</span>
                </div>
              </div>

            </div>

            {/* Right Section - QR Code */}
            <div className="md:col-span-1 flex flex-col items-center justify-start border-l-0 md:border-l-2 md:border-dashed md:border-gray-300 md:pl-6">
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                  YOUR TICKET QR CODE
                </p>
                <div className="bg-white p-3 border-2 border-gray-200 rounded-lg inline-block">
                  <QRCodeSVG 
                    value={JSON.stringify(bookingDetails)}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 px-4">
                  Show this QR code at cinema entry
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="font-bold text-lg text-gray-900">{bookingId}</p>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              PRINT BOOKING INFO
            </button>
            <button 
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              📧 RESEND CONFIRMATION
            </button>
          </div>

        </div>

        {/* Promotional Banner */}
        <div className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 text-white flex flex-col sm:flex-row items-center justify-between shadow-md gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎬</span>
            </div>
            <div>
              <p className="font-bold text-sm">Get 2 Free Movie tickets every month with BookMyShow RBL Bank Fun+ Credit Card</p>
            </div>
          </div>
          <button className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
            INSTANT APPROVAL
          </button>
        </div>

        {/* Back to Home Button */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}