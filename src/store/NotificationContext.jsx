import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import websocketService from '../services/websocket-service';
import { getAdminNotifications, markNotificationRead } from '../services/notification-service';
import { getStoredAuth } from '../auth/storage';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const reduxRole = useSelector((state) => state.auth?.user?.role ?? null);
  const { role: storedRole } = getStoredAuth();
  const role = reduxRole || storedRole;

  useEffect(() => {
    if (role !== 'ADMIN') {
      setNotifications([]);
      return;
    }

    let mounted = true;
    let pollTimer;

    const loadNotifications = async () => {
      try {
        const items = await getAdminNotifications();
        if (mounted) {
          setNotifications(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    loadNotifications();
    pollTimer = window.setInterval(loadNotifications, 15000);

    websocketService.connect(
      (notification) => {
        if (!notification || typeof notification !== 'object') {
          return;
        }
        setNotifications((prev) => [notification, ...(Array.isArray(prev) ? prev : [])]);
      },
      undefined,
      (error) => {
        console.error('WebSocket notification error:', error);
      }
    );

    return () => {
      mounted = false;
      if (pollTimer) {
        window.clearInterval(pollTimer);
      }
      try {
        websocketService.disconnect();
      } catch (error) {
        console.error('WebSocket disconnect cleanup failed:', error);
      }
    };
  }, [role]);

  const markAsRead = async (id) => {
    try {
      const updated = await markNotificationRead(id);
      if (!updated) {
        return;
      }

      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead }),
    [notifications, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }
  return context;
};
