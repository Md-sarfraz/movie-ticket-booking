import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../store/NotificationContext';

const toDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatRelativeTime = (value) => {
  const date = toDate(value);
  if (!date) {
    return 'Just now';
  }

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} min ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hr ago`;
  }

  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) {
    return `${days} day ago${days > 1 ? 's' : ''}`;
  }

  return date.toLocaleDateString();
};

const NotificationIcon = () => {
  const [open, setOpen] = useState(false);
  const [panelOffsetX, setPanelOffsetX] = useState(0);
  const panelRef = useRef(null);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const latestNotifications = useMemo(
    () => (Array.isArray(notifications) ? notifications.slice(0, 20) : []),
    [notifications]
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!panelRef.current) {
        return;
      }

      if (!panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setPanelOffsetX(0);
      return;
    }

    const keepPanelInViewport = () => {
      if (!dropdownRef.current || typeof window === 'undefined') {
        return;
      }

      const rect = dropdownRef.current.getBoundingClientRect();
      const gutter = 8;
      const maxRight = window.innerWidth - gutter;
      let nextOffset = 0;

      if (rect.left < gutter) {
        nextOffset = gutter - rect.left;
      } else if (rect.right > maxRight) {
        nextOffset = maxRight - rect.right;
      }

      setPanelOffsetX(nextOffset);
    };

    keepPanelInViewport();
    window.addEventListener('resize', keepPanelInViewport);
    window.addEventListener('orientationchange', keepPanelInViewport);

    return () => {
      window.removeEventListener('resize', keepPanelInViewport);
      window.removeEventListener('orientationchange', keepPanelInViewport);
    };
  }, [open]);

  const handleToggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className='relative' ref={panelRef}>
      <button
        className='relative rounded-lg border border-gray-200 p-2.5 text-gray-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
        aria-label='Notifications'
        title='Notifications'
        onClick={handleToggle}
      >
        <FaBell size={14} />
        {unreadCount > 0 && (
          <span className='absolute -right-2 -top-2 flex h-5 min-w-5 animate-pulse items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className='absolute right-0 z-[220] mt-2 w-96 max-w-[92vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl'
          style={panelOffsetX !== 0 ? { transform: `translateX(${panelOffsetX}px)` } : undefined}
        >
          <div className='flex items-center justify-between border-b border-gray-100 px-4 py-3'>
            <h3 className='text-sm font-semibold text-gray-800'>Notifications</h3>
            <span className='text-xs text-gray-500'>{unreadCount} unread</span>
          </div>

          <div className='max-h-96 overflow-y-auto'>
            {latestNotifications.length === 0 ? (
              <div className='px-4 py-6 text-center text-sm text-gray-500'>No notifications yet</div>
            ) : (
              latestNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`border-b border-gray-50 px-4 py-3 transition ${
                    item.isRead ? 'bg-white' : 'bg-red-50/40'
                  }`}
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-[11px] font-semibold uppercase tracking-wide text-red-500'>
                      {item.type || 'SYSTEM'}
                    </span>
                    <span className='text-[11px] text-gray-400'>{formatRelativeTime(item.createdAt)}</span>
                  </div>
                  <p className='mt-1 break-words text-sm text-gray-700'>{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
