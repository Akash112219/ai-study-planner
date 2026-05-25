import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MarketingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-lg' : 'bg-transparent'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] transition-all duration-300 group-hover:scale-105">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              StudyPlanner<span className="text-emerald-400">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors group"
              >
                <span className={`relative z-10 transition-colors ${isActive(link.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {link.name}
                </span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-slate-800 rounded-lg -z-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="absolute inset-0 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3 relative z-10">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 mr-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>

            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">
              Log in
            </Link>
            <Link to="/signup">
              <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                Start for free
              </button>
            </Link>
          </div>

          {/* Mobile menu button & Theme toggle */}
          <div className="md:hidden flex items-center gap-2 relative z-10">
            <button 
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-800 my-2" />
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors text-center">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="btn-primary w-full mt-2">Start for free</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default MarketingNavbar;
