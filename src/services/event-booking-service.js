import { myAxios } from "./helper";

export const createEventBooking = async (payload) => {
  const response = await myAxios.post("/event-bookings/create", payload);
  return response.data.data;
};

export const getUserEventBookings = async (userId) => {
  const response = await myAxios.get(`/event-bookings/user/${userId}`);
  return response.data.data || [];
};

export const getEventTicketByBookingReference = async (bookingReference) => {
  const response = await myAxios.get(`/event-bookings/ticket/${bookingReference}`);
  return response.data.data;
};

export const lockEventTickets = async (payload) => {
  const response = await myAxios.post("/events/lock-tickets", payload);
  return response.data.data;
};

export const createEventPaymentOrder = async (payload) => {
  const response = await myAxios.post("/event-payment/create-order", payload);
  return response.data.data;
};

export const verifyEventPayment = async (payload) => {
  const response = await myAxios.post("/event-payment/verify", payload);
  return response.data.data;
};

export const markEventPaymentFailed = async (razorpayOrderId) => {
  await myAxios.post(`/event-payment/failed?razorpayOrderId=${encodeURIComponent(razorpayOrderId)}`);
};

export const releaseEventLock = async (bookingId) => {
  await myAxios.post("/events/release-lock", { bookingId });
};
