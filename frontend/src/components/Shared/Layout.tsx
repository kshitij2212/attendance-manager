import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Calendar, Clock, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, employee, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';

  const navItems = isAdmin
    ? [
        { name: 'Dashboard',  icon: LayoutDashboard, path: '/admin' },
        { name: 'Employees',  icon: Users,           path: '/admin/employees' },
        { name: 'Leaves',     icon: ClipboardList,   path: '/admin/leaves' },
        { name: 'Attendance', icon: Calendar,         path: '/admin/attendance' },
      ]
    : [
        { name: 'Dashboard',     icon: LayoutDashboard, path: '/employee' },
        { name: 'My Attendance', icon: Clock,           path: '/employee/history' },
        { name: 'My Leaves',     icon: ClipboardList,   path: '/employee/leaves' },
      ];

  const initials = (name?: string) =>
    name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .layout-root { font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="layout-root flex h-screen overflow-hidden" style={{ background: '#f5f2ec' }}>

        <aside
          className="hidden lg:flex w-60 flex-col m-3 mr-0 rounded-2xl overflow-hidden"
          style={{
            background: '#ffffff',
            border: '1px solid #e4dfd4',
          }}
        >
          <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: '#e4dfd4' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#1a1a18' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-base font-semibold text-stone-900 tracking-tight">AttendanceIQ</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-3 mb-2">
              {isAdmin ? 'Admin' : 'Menu'}
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: isActive ? '#1a1a18' : 'transparent',
                    color: isActive ? '#ffffff' : '#78716c',
                    fontWeight: isActive ? '500' : '400',
                    fontSize: '14px',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = '#f5f2ec'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pb-4 space-y-1" style={{ borderTop: '1px solid #e4dfd4', paddingTop: '12px' }}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#f5f2ec' }}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                style={{ background: '#e4dfd4', color: '#5c5c58' }}
              >
                {initials(employee?.name)}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{employee?.name || 'User'}</p>
                <p className="text-[10px] text-stone-400 truncate uppercase tracking-wide">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{ color: '#dc2626', fontWeight: '400' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header
            className="lg:hidden mx-3 mt-3 mb-0 px-5 py-3.5 rounded-2xl flex items-center justify-between"
            style={{ background: '#ffffff', border: '1px solid #e4dfd4' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#1a1a18' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-stone-900">AttendanceIQ</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg transition-all"
              style={{ color: '#dc2626' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <LogOut size={16} />
            </button>
          </header>

          <div
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{ padding: '12px' }}
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;