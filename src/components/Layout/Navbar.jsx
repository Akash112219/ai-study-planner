import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserProfile } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Format the path to a readable title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.charAt(1).toUpperCase() + path.slice(2);
  };

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error("Failed to load navbar profile:", err);
      }
    };
    loadProfile();
  }, []);

  return (
    <nav className="glass-panel mx-4 lg:mx-8 mt-4 px-4 sm:px-6 py-3 flex justify-between items-center z-10 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        {/* Dynamic Page Title */}
        <h2 className="text-xl font-bold text-slate-100 tracking-wide">
          {getPageTitle()}
        </h2>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Search Input */}
        <div className="relative group flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 hidden sm:flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="hidden sm:block bg-slate-800/40 border border-slate-700/50 rounded-full pl-10 pr-4 py-2 w-32 md:w-48 lg:w-64 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:bg-slate-800/60 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
          />
          {/* Mobile Search Icon Only */}
          <button className="sm:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-slate-700/50"></div>
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          {/* Notification Indicator Dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-slate-900"></span>
          </span>
        </button>
        
        {/* Profile Avatar */}
        <button className="flex items-center gap-3 pl-1 sm:pl-0 border-l border-slate-700/50 sm:border-none">
          <div className="relative">
            <img 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-500/50 object-cover shadow-sm" 
              src={userProfile?.profile_picture || "https://api.dicebear.com/7.x/notionists/svg?seed=Default&backgroundColor=10b981"} 
              alt="User Avatar" 
            />
            {/* Online Status Indicator */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-200 leading-tight">{userProfile?.name || "Student"}</span>
            <span className="text-xs text-slate-400">Pro Plan</span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
