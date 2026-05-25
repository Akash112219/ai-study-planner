import React from 'react';
import GlassCard from './GlassCard';

/**
 * A reusable Skeleton loading component with a futuristic shimmer effect.
 * @param {string} className - Additional classes to control sizing and layout.
 * @param {string} variant - 'text' | 'circular' | 'rectangular' | 'card'
 */
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'bg-slate-800/60 animate-shimmer relative overflow-hidden';
  
  const variants = {
    text: 'h-4 rounded-md w-3/4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

/**
 * Pre-built Skeleton layouts for common sections
 */

export const StatCardSkeleton = () => (
  <GlassCard hoverEffect={false} padding="p-5" className="animate-shimmer">
    <Skeleton variant="text" className="w-1/3 mb-4 h-3 opacity-50" />
    <Skeleton variant="rectangular" className="w-1/2 h-8 mb-4 opacity-70" />
    <Skeleton variant="text" className="w-2/3 h-3 opacity-40" />
  </GlassCard>
);

export const ChartSkeleton = () => (
  <GlassCard hoverEffect={false} className="animate-shimmer h-full min-h-[300px] flex flex-col justify-end p-6">
    <div className="flex justify-between items-center mb-auto w-full">
      <Skeleton variant="text" className="w-1/3 h-6" />
      <Skeleton variant="rectangular" className="w-24 h-8" />
    </div>
    <div className="flex gap-2 items-end h-48 w-full mt-6">
      {[40, 70, 50, 90, 60, 30, 80].map((h, i) => (
        <Skeleton key={i} variant="rectangular" className={`flex-1 opacity-${Math.max(20, h)}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  </GlassCard>
);

export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 animate-shimmer">
        <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-3 opacity-50" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
