import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/issues', label: 'User Issues', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    { path: '/admin/analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg> },
    { path: '/admin/exams', label: 'Exams', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
    { path: '/admin/subjects', label: 'Subjects', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> },
    { path: '/admin/settings', label: 'Website Settings', icon: <Settings className="w-5 h-5" /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex relative overflow-hidden text-slate-100">
      <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Admin Sidebar */}
      <aside className={`
        glass-panel flex flex-col shrink-0 z-40 transition-all duration-300 ease-in-out w-64
        md:m-4 md:sticky md:top-4 md:h-[calc(100vh-32px)]
        fixed top-0 left-0 h-full m-0 rounded-none md:rounded-2xl border-l-0 md:border-l
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 shadow-none'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              Admin Panel
            </h1>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 py-6 px-3 flex flex-col gap-2">
          {navItems.map(item => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link 
                key={item.path} to={item.path}
                className={`flex items-center gap-4 py-3 px-4 rounded-xl font-medium border transition-all duration-200 ${active ? 'bg-white/10 text-indigo-300 border-white/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 py-2 text-slate-400 hover:text-rose-400 transition-colors px-4 w-full">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Admin Navbar */}
        <nav className="glass-panel mx-4 lg:mx-8 mt-4 px-4 sm:px-6 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-100">Superuser Console</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white bg-slate-800/50 rounded-lg">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;
