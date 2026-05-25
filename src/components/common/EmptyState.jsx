import React from 'react';
import GlassCard from './GlassCard';

/**
 * Reusable Empty State Component
 * 
 * @param {ReactNode} icon - SVG icon to display
 * @param {string} title - Main heading
 * @param {string} description - Subtext explaining the empty state
 * @param {ReactNode} action - Optional action button or link
 */
const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  className = ''
}) => {
  return (
    <GlassCard hoverEffect={false} className={`flex flex-col items-center justify-center text-center p-12 lg:p-16 border-dashed border-2 border-slate-700/50 bg-slate-800/10 ${className}`}>
      
      {/* Icon Container with subtle glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
        <div className="relative w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-xl">
          {icon || (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {action && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
          {action}
        </div>
      )}
      
    </GlassCard>
  );
};

export default EmptyState;
