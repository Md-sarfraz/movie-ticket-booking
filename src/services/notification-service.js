import { myAxios } from './helper';

export const getAdminNotifications = async () => {
  const response = await myAxios.get('/admin/notifications');
  return response.data?.data ?? [];
};

export const markNotificationRead = async (id) => {
  const response = await myAxios.put(`/admin/notifications/${id}/read`);
  return response.data?.data;
};

export const markAllNotificationsRead = async () => {
  const response = await myAxios.put('/admin/notifications/read-all');
  return response.data?.data;
};
