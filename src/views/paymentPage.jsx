import React, { useState, useEffect, useRef } from "react";
import { CreditCard, Wallet, Smartphone, Calendar, Clock, Star, Building, Info, User, Building2, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const paymentDetailsRef = useRef(null);

  // Get data from location state passed from SeatSelection page
  const { 
    seats = [], 
    movie = {}, 
    show = {},
    theater = {},
    time = '',
    date = '',
    totalPrice = 0, 
    seatLabels = [],
    basePrice = 0,
    convenienceFee = 0,
    discount = 0
  } = location.state || {};

  // Redirect if no booking data
  useEffect(() => {
    console.log('Payment Page - Received data:', { movie, show, theater, seats, seatLabels, totalPrice });
    
    if (!movie?.title || seats.length === 0) {
      console.log('Missing required data, redirecting to movies');
      navigate('/movies');
    }
  }, [movie, show, seats, navigate]);



  // Format price for display
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  // Handle payment method change with scroll
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Smooth scroll to payment details after state update
    setTimeout(() => {
      if (paymentDetailsRef.current) {
        paymentDetailsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Handle Payment
  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const bookingId = `BTS${Date.now().toString().slice(-8)}`;
      navigate('/ticketPage', {
        state: {
          movie,
          show,
          theater,
          time,
          date,
          seats,
          seatLabels,
          totalPrice,
          basePrice,
          convenienceFee,
          discount,
          bookingId,
          paymentId: `PAY${Date.now().toString().slice(-8)}`,
          paymentStatus: 'PAID',
          showPostPaymentFlow: true,
        }
      });
    }, 2000);
  };

  if (!movie?.title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-800 text-xl">Invalid payment session</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/30 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-orange-500 transition-colors mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Seat Selection
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-gray-600">Complete your booking securely</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Payment Methods */}
          <div className="md:col-span-2 space-y-4">
            {/* Payment Method Selection */}
            <div className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">Select Payment Method</h3>

              <div className="space-y-3">
                {/* UPI Option */}
                <button
                  onClick={() => handlePaymentMethodChange('upi')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'upi' ? 'bg-orange-500' : 'bg-gray-100'}`}>
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-semibold text-sm">UPI</p>
                    <p className="text-gray-500 text-xs">GPay, PhonePe, Paytm</p>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Card Option */}
                <button
                  onClick={() => handlePaymentMethodChange('card')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-orange-500' : 'bg-gray-100'}`}>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-semibold text-sm">Credit / Debit Card</p>
                    <p className="text-gray-500 text-xs">Visa, Mastercard, Rupay</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Net Banking Option */}
                <button
                  onClick={() => handlePaymentMethodChange('netbanking')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    paymentMethod === 'netbanking'
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'netbanking' ? 'bg-orange-500' : 'bg-gray-100'}`}>
                    <Building2 className={`w-5 h-5 ${paymentMethod === 'netbanking' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-semibold text-sm">Net Banking</p>
                    <p className="text-gray-500 text-xs">All major Indian banks</p>
                  </div>
                  {paymentMethod === 'netbanking' && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Wallet Option */}
                <button
                  onClick={() => handlePaymentMethodChange('wallet')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    paymentMethod === 'wallet'
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'wallet' ? 'bg-orange-500' : 'bg-gray-100'}`}>
                    <Wallet className={`w-5 h-5 ${paymentMethod === 'wallet' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-semibold text-sm">Mobile Wallets</p>
                    <p className="text-gray-500 text-xs">Paytm, Amazon Pay, MobiKwik</p>
                  </div>
                  {paymentMethod === 'wallet' && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Payment Details Forms */}
            {paymentMethod === 'upi' && (
              <div ref={paymentDetailsRef} className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg scroll-mt-24">
                <h3 className="text-gray-900 font-semibold mb-3">Enter UPI ID</h3>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <p className="text-gray-500 text-sm mt-3">You will receive a payment request on your UPI app</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div ref={paymentDetailsRef} className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg scroll-mt-24">
                <h3 className="text-gray-900 font-semibold mb-3">Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div ref={paymentDetailsRef} className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg scroll-mt-24">
                <h3 className="text-gray-900 font-semibold mb-3">Select Your Bank</h3>
                <select className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors">
                  <option>Choose your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                  <option>Bank of Baroda</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
                <p className="text-gray-500 text-sm mt-3">You will be redirected to your bank's website</p>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div ref={paymentDetailsRef} className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg scroll-mt-24">
                <h3 className="text-gray-900 font-semibold mb-3">Select Wallet</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                    <p className="font-semibold text-gray-900">Paytm</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                    <p className="font-semibold text-gray-900">Amazon Pay</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                    <p className="font-semibold text-gray-900">MobiKwik</p>
                  </button>
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <Lock className="w-4 h-4" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">Order Summary</h3>

              {/* Movie Info */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Movie</p>
                  <p className="text-gray-900 font-semibold">{movie.title}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Date & Time</p>
                  <p className="text-gray-900 text-sm">{date ? String(date) : 'N/A'}</p>
                  <p className="text-gray-900 text-sm">{time ? String(time) : 'N/A'}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Seats</p>
                  <p className="text-gray-900 text-sm">{seatLabels?.join(', ')}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ticket Price</span>
                  <span className="text-gray-900">₹{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Convenience Fee</span>
                  <span className="text-gray-900">₹{formatPrice(convenienceFee)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-orange-600">₹{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay ₹{formatPrice(totalPrice)}</span>
                  </>
                )}
              </button>

              <p className="text-gray-500 text-xs text-center mt-4">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;