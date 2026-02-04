import { useState } from 'react';
import { Bell, X, Calendar, Trophy } from 'lucide-react';

interface Notification {
  id: number;
  type: 'exam' | 'result' | 'announcement';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'exam', title: 'Exam Reminder', message: 'Advanced Mathematics exam starts in 2 days', time: '2 hours ago', unread: true },
  { id: 2, type: 'result', title: 'Result Published', message: 'Your English Literature result is now available', time: '5 hours ago', unread: true },
  { id: 3, type: 'announcement', title: 'System Update', message: 'Platform maintenance scheduled for tonight', time: '1 day ago', unread: false },
  { id: 4, type: 'exam', title: 'New Exam Added', message: 'Machine Learning exam has been scheduled', time: '2 days ago', unread: false }
];

export function NotificationsButton() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 rounded-xl border hover:border-blue-500/50 hover:bg-blue-500/10 transition group"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <Bell className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setShowNotifications(false)}
          />
          <div 
            className="absolute right-0 top-full mt-2 w-96 rounded-2xl border shadow-2xl z-40"
            style={{ 
              backgroundColor: 'rgba(15, 17, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div>
                <h3 className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Notifications
                </h3>
                <p className="text-gray-400 text-xs">{unreadCount} unread messages</p>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 border-b hover:bg-white/5 transition cursor-pointer ${
                    notif.unread ? 'bg-blue-500/5' : ''
                  }`}
                  style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      notif.type === 'exam' ? 'bg-blue-500/20' :
                      notif.type === 'result' ? 'bg-green-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      {notif.type === 'exam' && <Calendar className="w-5 h-5 text-blue-400" />}
                      {notif.type === 'result' && <Trophy className="w-5 h-5 text-green-400" />}
                      {notif.type === 'announcement' && <Bell className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {notif.title}
                        </h4>
                        {notif.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{notif.message}</p>
                      <span className="text-gray-500 text-xs">{notif.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <button className="w-full py-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition text-sm">
                Mark all as read
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
