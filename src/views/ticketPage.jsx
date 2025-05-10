import React from "react";
import BookTheShowLogo from "@/components/bookTheShowLogo";

export default function BookingConfirmation() {
  // Sample booking data (in a real app, this would come from API/props)
  const bookingData = {
    bookingId: "SRCM0000076256",
    movie: {
      title: "Avengers: Endgame",
      image: "/api/placeholder/100/150"
    },
    showtime: "11:00am | Sat, 10 May, 2025",
    venue: "PVR Cinemas - Inorbit Mall",
    location: "Hyderabad",
    screen: "SCREEN 3",
    seats: "LOWER A8 - F12, G15",
    ticketCount: 2,
    ticketAmount: 300.00,
    bookingFees: 27.30,
    gst: 5.02,
    internetHandlingFees: 32.32,
    totalAmount: 332.32,
    paymentType: "Credit Card",
    confirmationId: "76256",
    bookingDate: "Sat, 10 May, 2025 | 8:44am"
  };

  // Simple QR Code component
  const SimpleQRCode = () => {
    return (
      <svg viewBox="0 0 29 29" width="120" height="120">
        {/* Outer positioning squares */}
        <rect x="2" y="2" width="5" height="5" fill="black" />
        <rect x="3" y="3" width="3" height="3" fill="white" />
        <rect x="4" y="4" width="1" height="1" fill="black" />
        
        <rect x="22" y="2" width="5" height="5" fill="black" />
        <rect x="23" y="3" width="3" height="3" fill="white" />
        <rect x="24" y="4" width="1" height="1" fill="black" />
        
        <rect x="2" y="22" width="5" height="5" fill="black" />
        <rect x="3" y="23" width="3" height="3" fill="white" />
        <rect x="4" y="24" width="1" height="1" fill="black" />
        
        {/* QR Code content - simplified pattern */}
        <rect x="10" y="2" width="1" height="1" fill="black" />
        <rect x="12" y="2" width="2" height="1" fill="black" />
        <rect x="15" y="2" width="2" height="1" fill="black" />
        <rect x="18" y="2" width="1" height="1" fill="black" />
        
        <rect x="2" y="9" width="1" height="1" fill="black" />
        <rect x="4" y="9" width="1" height="1" fill="black" />
        <rect x="6" y="9" width="2" height="1" fill="black" />
        <rect x="10" y="9" width="1" height="1" fill="black" />
        <rect x="14" y="9" width="1" height="1" fill="black" />
        <rect x="16" y="9" width="2" height="1" fill="black" />
        <rect x="20" y="9" width="3" height="1" fill="black" />
        <rect x="24" y="9" width="2" height="1" fill="black" />
        
        <rect x="3" y="11" width="2" height="1" fill="black" />
        <rect x="7" y="11" width="1" height="1" fill="black" />
        <rect x="10" y="11" width="3" height="1" fill="black" />
        <rect x="14" y="11" width="1" height="1" fill="black" />
        <rect x="17" y="11" width="1" height="1" fill="black" />
        <rect x="19" y="11" width="2" height="1" fill="black" />
        <rect x="22" y="11" width="1" height="1" fill="black" />
        <rect x="24" y="11" width="3" height="1" fill="black" />
        
        <rect x="6" y="13" width="1" height="1" fill="black" />
        <rect x="8" y="13" width="2" height="1" fill="black" />
        <rect x="12" y="13" width="1" height="1" fill="black" />
        <rect x="14" y="13" width="3" height="1" fill="black" />
        <rect x="19" y="13" width="1" height="1" fill="black" />
        <rect x="21" y="13" width="1" height="1" fill="black" />
        <rect x="23" y="13" width="1" height="1" fill="black" />
        <rect x="25" y="13" width="2" height="1" fill="black" />
        
        <rect x="3" y="15" width="2" height="1" fill="black" />
        <rect x="7" y="15" width="2" height="1" fill="black" />
        <rect x="12" y="15" width="3" height="1" fill="black" />
        <rect x="17" y="15" width="1" height="1" fill="black" />
        <rect x="20" y="15" width="2" height="1" fill="black" />
        <rect x="25" y="15" width="1" height="1" fill="black" />
        
        <rect x="2" y="17" width="1" height="1" fill="black" />
        <rect x="6" y="17" width="1" height="1" fill="black" />
        <rect x="8" y="17" width="2" height="1" fill="black" />
        <rect x="11" y="17" width="1" height="1" fill="black" />
        <rect x="13" y="17" width="1" height="1" fill="black" />
        <rect x="16" y="17" width="3" height="1" fill="black" />
        <rect x="20" y="17" width="1" height="1" fill="black" />
        <rect x="23" y="17" width="1" height="1" fill="black" />
        <rect x="26" y="17" width="1" height="1" fill="black" />
        
        <rect x="5" y="19" width="1" height="1" fill="black" />
        <rect x="7" y="19" width="3" height="1" fill="black" />
        <rect x="12" y="19" width="1" height="1" fill="black" />
        <rect x="15" y="19" width="1" height="1" fill="black" />
        <rect x="17" y="19" width="1" height="1" fill="black" />
        <rect x="19" y="19" width="3" height="1" fill="black" />
        <rect x="25" y="19" width="2" height="1" fill="black" />
        
        <rect x="8" y="21" width="1" height="1" fill="black" />
        <rect x="10" y="21" width="1" height="1" fill="black" />
        <rect x="13" y="21" width="2" height="1" fill="black" />
        <rect x="17" y="21" width="1" height="1" fill="black" />
        <rect x="20" y="21" width="2" height="1" fill="black" />
        <rect x="24" y="21" width="1" height="1" fill="black" />
        
        <rect x="10" y="24" width="1" height="1" fill="black" />
        <rect x="13" y="24" width="1" height="1" fill="black" />
        <rect x="16" y="24" width="2" height="1" fill="black" />
        <rect x="19" y="24" width="1" height="1" fill="black" />
        <rect x="21" y="24" width="3" height="1" fill="black" />
        <rect x="26" y="24" width="1" height="1" fill="black" />
        
        <rect x="9" y="26" width="2" height="1" fill="black" />
        <rect x="12" y="26" width="1" height="1" fill="black" />
        <rect x="14" y="26" width="4" height="1" fill="black" />
        <rect x="22" y="26" width="1" height="1" fill="black" />
        <rect x="25" y="26" width="2" height="1" fill="black" />
      </svg>
    );
  };

  return (
    <div className="max-w-4xl mx-auto font-sans bg-gray-100 pb-8 pt-20" >
      {/* Header */}
      <div className="bg-white py-6 px-8 text-center border-b border-gray-200">
        <div className="flex items-center justify-center mb-3">
          <BookTheShowLogo/>
        </div>
        <p className="text-green-500 font-medium text-lg">Your booking is confirmed!</p>
        <p className="text-gray-500 mt-1">Booking ID: {bookingData.bookingId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 px-8">
        {/* Movie Info & QR - Left Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <img 
                  src={bookingData.movie.image} 
                  alt={bookingData.movie.title} 
                  className="w-32 h-48 object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h2 className="font-bold text-2xl">{bookingData.movie.title}</h2>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 text-gray-500">Date & Time:</span>
                    <span className="font-medium">{bookingData.showtime}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 text-gray-500">Venue:</span>
                    <span className="font-medium">{bookingData.venue}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 text-gray-500">Location:</span>
                    <span className="font-medium">{bookingData.location}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 text-gray-500">Screen:</span>
                    <span className="font-medium">{bookingData.screen}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="w-24 text-gray-500">Seats:</span>
                    <span className="font-medium">{bookingData.seats}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Count */}
            <div className="flex items-center mt-6 pt-6 border-t border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">{bookingData.ticketCount}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tickets</p>
                <p className="text-lg font-bold mt-1">{bookingData.ticketCount} x Standard</p>
              </div>
              <div className="ml-auto">
                <div className="border-2 border-green-500 rounded-lg p-3 transform rotate-12">
                  <span className="text-green-500 font-bold">BOOKING CONFIRMED</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-700 font-medium text-lg mb-4">ORDER SUMMARY</h3>
            
            <div className="flex justify-between mb-3">
              <div>
                <p className="font-medium">TICKET AMOUNT</p>
                <p className="text-sm text-gray-500">Quantity</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Rs.{bookingData.ticketAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{bookingData.ticketCount} tickets</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 mb-3">
              <div>
                <p className="font-medium">INTERNET HANDLING FEES</p>
                <p className="text-sm text-gray-500">Booking Fees</p>
                <p className="text-sm text-gray-500">Integrated GST (IGST) @ 18.00%</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Rs.{bookingData.internetHandlingFees.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Rs.{bookingData.bookingFees.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Rs.{bookingData.gst.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-between mt-6 py-4 font-bold text-lg border-t border-gray-200">
              <p>AMOUNT PAID</p>
              <p>Rs.{bookingData.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Right Column - QR and Payment Info */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-medium mb-4">Scan QR Code</h3>
            <div className="bg-white p-2 border border-gray-200 inline-block mx-auto">
              <SimpleQRCode />
            </div>
            <p className="text-sm text-gray-500 mt-2">Show this QR code at the entrance</p>
          </div>

          {/* Payment Info */}
          <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">
            <h3 className="font-medium mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Booking Date & Time</p>
                <p className="font-medium">{bookingData.bookingDate}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Payment Type</p>
                <p className="font-medium">{bookingData.paymentType}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Confirmation#</p>
                <p className="font-medium">{bookingData.confirmationId}</p>
              </div>
            </div>
          </div>
          
          {/* Coupons */}
          <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Congrats! Coupons Unlocked.</h3>
            <p className="text-sm text-gray-500">Grab discounts from restaurants nearby</p>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              SELECT COUPONS
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white mt-6 p-6 mx-8 rounded-lg shadow-sm">
        <h3 className="text-gray-700 font-medium text-lg mb-4">IMPORTANT INSTRUCTIONS</h3>
        <ol className="text-gray-600 list-decimal pl-6 space-y-2">
          <li>Please collect physical tickets from the box office.</li>
          <li>Please carry your GSTIN card which was used for booking tickets.</li>
          <li>Exchange of tickets and forwarding messages are not allowed.</li>
          <li>Children of ages 3 and above will require a separate ticket.</li>
        </ol>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>© 2025 Book The Show. All rights reserved.</p>
      </div>
    </div>
  );
}