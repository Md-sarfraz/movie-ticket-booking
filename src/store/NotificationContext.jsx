import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import websocketService from '../services/websocket-service';
import {
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notification-service';
import { getStoredAuth } from '../auth/storage';

const NotificationContext = createContext(null);

const normalizeNotification = (item) => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const id = item.id != null ? String(item.id) : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    message: item.message ?? '',
    isRead: Boolean(item.isRead),
    createdAt: item.createdAt ?? new Date().toISOString(),
    type: item.type ?? 'SYSTEM',
  };
};

const mapAndSortNotifications = (items) => {
  const normalized = (Array.isArray(items) ? items : [])
    .map(normalizeNotification)
    .filter(Boolean);

  return normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

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

    const loadNotifications = async () => {
      try {
        const items = await getAdminNotifications();
        if (mounted) {
          setNotifications(mapAndSortNotifications(items));
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    loadNotifications();

    websocketService.connect(
      (incomingNotification) => {
        const notification = normalizeNotification(incomingNotification);
        if (!notification) {
          return;
        }

        setNotifications((prev) => {
          const existing = Array.isArray(prev) ? prev : [];
          const duplicate = existing.some((item) => item.id === notification.id);
          if (duplicate) {
            return existing;
          }
          return [notification, ...existing];
        });
      },
      undefined,
      (error) => {
        console.error('WebSocket notification error:', error);
      }
    );

    return () => {
      mounted = false;
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
        (Array.isArray(prev) ? prev : []).map((item) =>
          item.id === String(id) ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => ({ ...item, isRead: true }))
    );

    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      try {
        const refreshed = await getAdminNotifications();
        setNotifications(mapAndSortNotifications(refreshed));
      } catch (refreshError) {
        console.error('Failed to refresh notifications after mark-all failure:', refreshError);
      }
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((item) => item && !item.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead }),
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
