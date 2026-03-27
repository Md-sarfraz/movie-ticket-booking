import { useMemo, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../store/NotificationContext';

const formatTime = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const latestNotifications = useMemo(() => notifications.slice(0, 20), [notifications]);

  return (
    <div className='relative'>
      <button
        className='relative p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200'
        aria-label='Notifications'
        title='Notifications'
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaBell size={14} />
        {unreadCount > 0 && (
          <span className='absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-96 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-[220]'>
          <div className='px-4 py-3 border-b border-gray-100 flex items-center justify-between'>
            <h3 className='text-sm font-semibold text-gray-800'>Admin Notifications</h3>
            <span className='text-xs text-gray-500'>{unreadCount} unread</span>
          </div>

          <div className='max-h-96 overflow-y-auto'>
            {latestNotifications.length === 0 ? (
              <div className='px-4 py-6 text-sm text-gray-500 text-center'>No notifications yet</div>
            ) : (
              latestNotifications.map((item) => (
                <button
                  key={item.id}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                    item.isRead ? 'bg-white' : 'bg-red-50/40'
                  }`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-[11px] font-semibold uppercase tracking-wide text-red-500'>
                      {item.type}
                    </span>
                    <span className='text-[11px] text-gray-400'>{formatTime(item.createdAt)}</span>
                  </div>
                  <p className='mt-1 text-sm text-gray-700'>{item.message}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
