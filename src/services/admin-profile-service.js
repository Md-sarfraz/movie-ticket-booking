import { myAxios } from "./helper";

const normalizeApiResponse = (responseData) => {
    return {
        ...responseData,
        // Backend returns `status`; some older callers expect `success`.
        success: responseData?.success ?? responseData?.status ?? false
    };
};

// Get admin profile
export const getAdminProfile = async (userId) => {
    try {
        console.log('🌐 API Call: GET /admin/profile/' + userId);
        const response = await myAxios.get(`/admin/profile/${userId}`);
        console.log('✅ API Response:', response.data);
        return normalizeApiResponse(response.data);
    } catch (error) {
        console.error("❌ Error fetching admin profile:", error);
        console.error("❌ Error response:", error.response?.data);
        throw error;
    }
};

// Update admin profile
export const updateAdminProfile = async (userId, profileData) => {
    try {
        const response = await myAxios.put(`/admin/profile/${userId}`, profileData);
        return normalizeApiResponse(response.data);
    } catch (error) {
        console.error("Error updating admin profile:", error);
        throw error;
    }
};

// Update password
export const updatePassword = async (userId, passwordData) => {
    try {
        console.log('🌐 API Call: POST /admin/profile/' + userId + '/password');
        const response = await myAxios.post(`/admin/profile/${userId}/password`, passwordData);
        console.log('✅ Password API Response:', response.data);
        return normalizeApiResponse(response.data);
    } catch (error) {
        console.error("Error updating password:", error);
        console.error("Error updating password response:", error.response?.data);
        throw error;
    }
};

// Upload avatar
export const uploadAvatar = async (userId, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await myAxios.post(`/admin/profile/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return normalizeApiResponse(response.data);
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
};
