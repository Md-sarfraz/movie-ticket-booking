import { myAxios } from "./helper";

// Get recent activities (Admin)
export const getRecentActivities = async (limit = 10) => {
    try {
        const response = await myAxios.get('/admin/activities', {
            params: { limit }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
};
