import React from 'react';

/**
 * Reusable Glassmorphism Alert Component
 * 
 * @param {string} type - 'success' | 'error' | 'warning' | 'info' (default: 'info')
 * @param {string} title - Optional bold title
 * @param {ReactNode} children - The main alert message
 * @param {boolean} dismissible - Whether to show an X button
 * @param {Function} onClose - Callback when dismissed
 */
const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  dismissible = false,
  onClose,
  className = ''
}) => {
  const styles = {
    success: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-300',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      )
    },
    error: {
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      text: 'text-rose-300',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      )
    },
    warning: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-300',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      )
    },
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-300',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      )
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 backdrop-blur-md shadow-lg ${style.bg} ${style.border} ${style.text} ${className} animate-in fade-in slide-in-from-top-2 duration-300`}>
      {style.icon}
      
      <div className="flex-1 text-sm leading-relaxed">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        {children}
      </div>

      {dismissible && (
        <button 
          onClick={onClose}
          className={`shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors ${style.text}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
