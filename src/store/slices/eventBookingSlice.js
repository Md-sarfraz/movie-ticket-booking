import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  event: null,
  bookingId: null,
  bookingReference: null,
  userId: null,
  ticketCount: 1,
  unitPrice: 0,
  totalAmount: 0,
  expiresAt: null,
  customer: {
    name: "",
    email: "",
    phone: "",
  },
  confirmed: null,
};

const eventBookingSlice = createSlice({
  name: "eventBooking",
  initialState,
  reducers: {
    setEventBookingLock(state, action) {
      const payload = action.payload || {};
      state.event = payload.event || null;
      state.bookingId = payload.bookingId || null;
      state.bookingReference = payload.bookingReference || null;
      state.userId = payload.userId || null;
      state.ticketCount = payload.ticketCount || 1;
      state.unitPrice = payload.unitPrice || 0;
      state.totalAmount = payload.totalAmount || 0;
      state.expiresAt = payload.expiresAt || null;
      state.confirmed = null;
    },
    setEventBookingCustomer(state, action) {
      state.customer = {
        ...state.customer,
        ...(action.payload || {}),
      };
    },
    setEventBookingConfirmed(state, action) {
      state.confirmed = action.payload || null;
    },
    clearEventBookingFlow() {
      return { ...initialState };
    },
  },
});

export const {
  setEventBookingLock,
  setEventBookingCustomer,
  setEventBookingConfirmed,
  clearEventBookingFlow,
} = eventBookingSlice.actions;

export default eventBookingSlice.reducer;
