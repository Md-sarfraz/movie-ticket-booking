import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearEventBookingFlow, setEventBookingCustomer, setEventBookingLock } from "@/store/slices/eventBookingSlice";
import {
  createEventPaymentOrder,
  lockEventTickets,
  markEventPaymentFailed,
  releaseEventLock,
  verifyEventPayment,
} from "@/services/event-booking-service";
import { Calendar, Clock, IndianRupee, MapPin } from "lucide-react";

const EventBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const bookingState = useSelector((state) => state.eventBooking);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [form, setForm] = useState({
    name: bookingState.customer?.name || "",
    email: bookingState.customer?.email || "",
    phone: bookingState.customer?.phone || "",
  });

  const initialized = useRef(false);
  const paymentCompletedRef = useRef(false);
  const event = bookingState.event;
  const userId = bookingState.userId;

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    const statePayload = location.state;
    if (statePayload?.event && statePayload?.userId) {
      dispatch(
        setEventBookingLock({
          event: statePayload.event,
          bookingId: null,
          bookingReference: null,
          userId: statePayload.userId,
          ticketCount: statePayload.ticketCount || 1,
          unitPrice: statePayload.unitPrice || 0,
          totalAmount: statePayload.totalAmount || 0,
          expiresAt: null,
        })
      );
    }

    initialized.current = true;
  }, [dispatch, location.state]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!event || !userId) {
      navigate("/event");
    }
  }, [event, userId, navigate]);

  const amountInPaise = useMemo(() => {
    const total = Number(bookingState.totalAmount || 0);
    return Math.round(total * 100);
  }, [bookingState.totalAmount]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = async () => {
    try {
      if (bookingState.bookingId) {
        await releaseEventLock(bookingState.bookingId);
      }
    } catch (error) {
      console.error("Failed to release event lock", error);
    } finally {
      dispatch(clearEventBookingFlow());
      navigate(`/eventDetails/${event?.id || ""}`);
    }
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert("Please fill in name, email and phone.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      alert("Please enter a valid email address.");
      return false;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(form.phone.trim())) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }

    return true;
  };

  const handleProceedPayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    setPaymentLoading(true);
    paymentCompletedRef.current = false;
    try {
      dispatch(setEventBookingCustomer(form));

      const lockResponse = await lockEventTickets({
        eventId: event.id,
        userId,
        ticketCount: bookingState.ticketCount,
      });

      dispatch(
        setEventBookingLock({
          event,
          bookingId: lockResponse.bookingId,
          bookingReference: lockResponse.bookingReference,
          userId,
          ticketCount: bookingState.ticketCount,
          unitPrice: lockResponse.unitPrice,
          totalAmount: lockResponse.totalAmount,
          expiresAt: lockResponse.expiresAt,
        })
      );

      const orderResponse = await createEventPaymentOrder({
        bookingId: lockResponse.bookingId,
      });

      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amountInPaise,
        currency: orderResponse.currency,
        order_id: orderResponse.razorpayOrderId,
        name: "BookShow",
        description: `Event booking for ${event.title}`,
        image: event.imageUrl || "",
        handler: async function (response) {
          paymentCompletedRef.current = true;
          try {
            const confirmation = await verifyEventPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              name: form.name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
            });

            const bookingDetails = confirmation.bookingDetails;
            navigate("/ticketPage", {
              state: {
                bookingId: bookingDetails.bookingReference,
                paymentId: response.razorpay_payment_id,
                totalPrice: bookingDetails.totalAmount,
                customerName: form.name.trim(),
                paymentStatus: "PAID",
                ticketCount: bookingDetails.numberOfTickets || bookingState.ticketCount,
                date: bookingDetails.eventDate || event.date,
                time: bookingDetails.eventTime || event.time,
                movie: {
                  title: bookingDetails.eventTitle || event.title,
                  imageUrl: bookingDetails.imageUrl || event.imageUrl,
                  language: event.category,
                },
                show: {
                  category: event.category,
                  format: "Event",
                },
                theater: {
                  name: bookingDetails.location || event.location,
                  location: bookingDetails.location || event.location,
                },
                seatLabels: [],
                ticketId: confirmation.ticketId,
                qrCode: confirmation.qrCode,
                showPostPaymentFlow: true,
              },
            });
          } catch (error) {
            console.error("Failed to confirm event booking", error);
            alert(error?.response?.data?.message || "Payment succeeded but booking confirmation failed.");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },
        notes: {
          eventId: String(event.id),
          eventTitle: event.title,
          ticketCount: String(bookingState.ticketCount || 1),
        },
        theme: { color: "#db2777" },
        modal: {
          ondismiss: async () => {
            if (paymentCompletedRef.current) {
              setPaymentLoading(false);
              return;
            }

            try {
              await releaseEventLock(lockResponse.bookingId);
            } catch (error) {
              console.error("Failed to release lock on checkout dismiss", error);
            }
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", async function (response) {
        paymentCompletedRef.current = false;
        try {
          await markEventPaymentFailed(orderResponse.razorpayOrderId);
        } catch (error) {
          console.error("Failed to mark event payment failed", error);
        }

        alert(`Payment failed: ${response?.error?.description || "Please try again"}`);
        setPaymentLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment flow failed", error);
      alert(error?.response?.data?.message || "Unable to start payment flow.");
      setPaymentLoading(false);
    }
  };

  if (!event || !userId) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-start gap-4">
            <img src={event.imageUrl} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
              <div className="text-sm text-gray-600 mt-1 flex flex-col gap-1">
                <span className="flex items-center gap-2"><Calendar size={14} /> {event.date}</span>
                <span className="flex items-center gap-2"><Clock size={14} /> {event.time}</span>
                <span className="flex items-center gap-2"><MapPin size={14} /> {event.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="10-digit phone"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>

          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Tickets</span>
              <span>{bookingState.ticketCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per ticket</span>
              <span className="flex items-center"><IndianRupee size={14} /> {Number(bookingState.unitPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span className="flex items-center"><IndianRupee size={14} /> {Number(amountInPaise / 100).toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={paymentLoading}
            onClick={handleProceedPayment}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 font-medium disabled:opacity-50"
          >
            {paymentLoading ? "Opening Razorpay..." : "Proceed to Payment"}
          </button>

          <button
            disabled={paymentLoading}
            onClick={handleCancel}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg py-2.5 font-medium"
          >
            Go Back
          </button>

          <p className="text-xs text-gray-500">You will be redirected to Razorpay secure checkout.</p>
        </div>
      </div>
    </div>
  );
};

export default EventBookingPage;
