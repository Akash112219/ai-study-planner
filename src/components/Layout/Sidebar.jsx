import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../services/api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> },
  { path: '/planner', label: 'Planner', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
  { path: '/tasks', label: 'Tasks', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> },
  { path: '/subjects', label: 'Subjects', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> },
  { path: '/recommendations', label: 'AI Strategy', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> },
  { path: '/questions', label: 'Questions', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
  { path: '/exam', label: 'Mock Exam', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
  { path: '/analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg> },
  { path: '/settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> }
];

// Admin items removed

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const isActive = (route) => path === route;

  // Automatically close mobile menu when navigating
  useEffect(() => {
    onCloseMobile();
  }, [location, onCloseMobile]);

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error("Failed to load sidebar profile:", err);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <aside 
      className={`
        glass-panel flex flex-col shrink-0 z-40 transition-all duration-300 ease-in-out
        /* Desktop Layout */
        md:m-4 md:sticky md:top-4 md:h-[calc(100vh-32px)] md:translate-x-0
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        /* Mobile Layout */
        fixed top-0 left-0 h-full w-64 m-0 rounded-none md:rounded-2xl border-l-0 md:border-l border-y-0 md:border-y border-white/20
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
      `}
    >
      {/* Header Area */}
      <div className={`p-6 border-b border-white/10 flex items-center justify-between transition-all duration-300 ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[2rem] w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
            AI
          </div>
          <h1 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'md:opacity-0 md:hidden' : 'opacity-100'}`}>
            Planner
          </h1>
        </div>
        
        {/* Mobile Close Button */}
        <button className="md:hidden text-slate-400 hover:text-white p-2" onClick={onCloseMobile}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`
                flex items-center gap-4 py-3 rounded-xl font-medium border transition-all duration-200 group relative px-4
                ${isCollapsed ? 'md:justify-center md:px-0' : ''}
                ${active 
                  ? "bg-white/10 text-emerald-300 border-white/20 shadow-inner" 
                  : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
                }
              `}
              title={isCollapsed ? item.label : ""}
            >
              <div className={`shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              
              <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : 'block'}`}>
                {item.label}
              </span>

              {/* Tooltip for collapsed state (desktop only) */}
              {isCollapsed && (
                <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-4">
        {/* Toggle Collapse Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden md:flex items-center text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 ${isCollapsed ? 'justify-center' : 'justify-end'}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
        </button>

        {/* Logout and Navigation Options */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Logout */}
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 py-2 text-rose-400 hover:text-rose-300 transition-colors rounded-lg hover:bg-rose-500/10 px-2 ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
          >
            <svg className="min-w-[1.25rem] w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className={`font-medium whitespace-nowrap text-sm truncate w-full text-left ${isCollapsed ? 'md:hidden' : 'block'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
