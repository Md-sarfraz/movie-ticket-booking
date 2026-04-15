import { myAxios } from "./helper";

// Get all bookings (Admin)
export const getAllBookings = async () => {
    try {
        const response = await myAxios.get('/admin/bookings');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

// Update booking status (Admin)
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await myAxios.put(`/admin/bookings/${bookingId}/status`, null, {
            params: { status }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
};

// Get bookings by user ID
export const getUserBookings = async (userId) => {
    try {
        const response = await myAxios.get(`/bookings/user/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
};

export const cancelUserBooking = async (bookingId, userId) => {
    try {
        // userId is intentionally unused; backend derives user identity from JWT.
        void userId;
        const response = await myAxios.post('/bookings/cancel-booking', {
            bookingId,
        });
        return response.data;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};

export const getCancellationPreview = async (bookingId) => {
    try {
        const response = await myAxios.get(`/bookings/${bookingId}/cancellation-preview`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching cancellation preview:', error);
        throw error;
    }
};

export const getUserRefundHistory = async (userId) => {
    try {
        const response = await myAxios.get(`/bookings/user/${userId}/refunds`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching refund history:', error);
        throw error;
    }
};
