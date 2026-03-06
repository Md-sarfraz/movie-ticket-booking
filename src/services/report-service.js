import { myAxios } from "./helper";

// Get report summary
export const getReportSummary = async (startDate, endDate) => {
    try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await myAxios.get('/admin/reports/summary', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching report summary:', error);
        throw error;
    }
};

// Get movie performance
export const getMoviePerformance = async (startDate, endDate) => {
    try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await myAxios.get('/admin/reports/movie-performance', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching movie performance:', error);
        throw error;
    }
};

// Get theater performance
export const getTheaterPerformance = async (startDate, endDate) => {
    try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await myAxios.get('/admin/reports/theater-performance', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching theater performance:', error);
        throw error;
    }
};

// Get seat occupancy
export const getSeatOccupancy = async (startDate, endDate) => {
    try {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await myAxios.get('/admin/reports/seat-occupancy', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching seat occupancy:', error);
        throw error;
    }
};

// Get booking trends
export const getBookingTrends = async (period = 'weekly', startDate, endDate) => {
    try {
        const params = { period };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await myAxios.get('/admin/reports/booking-trends', { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking trends:', error);
        throw error;
    }
};

// Get revenue chart data
export const getRevenueChart = async (period = 'weekly') => {
    try {
        const response = await myAxios.get('/admin/revenue-chart', {
            params: { period }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching revenue chart:', error);
        throw error;
    }
};
