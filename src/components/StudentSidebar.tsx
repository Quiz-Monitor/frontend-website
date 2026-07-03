import { useNavigate, useLocation } from 'react-router-dom';
import {
  Brain, Home, FileText, History, LogOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home,     path: '/student' },
  { id: 'exams',     label: 'My Exams',  icon: FileText, path: '/student/my-exams' },
  { id: 'history',   label: 'History',   icon: History,  path: '/student/history' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded, toggleSidebar, sidebarWidth } = useSidebar();
  const { user, logout } = useAuth();

  const initials = user?.fullName ? getInitials(user.fullName) : 'S';
  const displayName = user?.fullName ?? 'Student';
  const displayEmail = user?.email ?? '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/student') return location.pathname === '/student';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      style={{
        width: sidebarWidth,
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        backgroundColor: 'rgba(15, 17, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: isExpanded ? '28px 20px 20px' : '28px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button onClick={() => navigate('/')} className="group" style={{ flexShrink: 0 }}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
            <Brain className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </button>
        {isExpanded && (
          <span
            className="text-white font-semibold text-sm whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s' }}
          >
            QuizMonitor
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', flexShrink: 0, marginBottom: 8 }} />

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              title={!isExpanded ? item.label : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: isExpanded ? '10px 12px' : '10px 0',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                borderRadius: 10,
                background: active
                  ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
                  : 'transparent',
                boxShadow: active ? '0 4px 15px rgba(59,130,246,0.3)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              className={!active ? 'hover:bg-white/5' : ''}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${active ? 'text-white' : 'text-gray-400'}`}
                style={{ color: active ? 'white' : undefined }}
                strokeWidth={active ? 2.5 : 1.5}
              />
              {isExpanded && (
                <span
                  className="text-sm whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'white' : '#9CA3AF',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div style={{ padding: '8px', flexShrink: 0 }}>
        <button
          onClick={toggleSidebar}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-end' : 'center',
            padding: '8px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#6B7280',
          }}
          className="hover:bg-white/5 hover:text-gray-300 transition-colors duration-200"
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

      {/* User Footer */}
      <div style={{ padding: '12px 8px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: isExpanded ? 'flex-start' : 'center',
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              style={{ cursor: 'default' }}
            >
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2"
              style={{ borderColor: '#0F111A' }}
            />
          </div>

          {/* Name + role */}
          {isExpanded && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p
                className="text-white text-xs font-semibold truncate"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}
              >
                {displayName}
              </p>
              <p
                className="text-gray-500 text-xs truncate"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }}
              >
                {displayEmail}
              </p>
            </div>
          )}

          {/* Logout */}
          {isExpanded && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Logout icon when collapsed */}
        {!isExpanded && (
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full mt-2 p-2 flex justify-center rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </aside>
  );
}
