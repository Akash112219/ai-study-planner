import React from 'react';

/**
 * Reusable Glassmorphism Card Component
 * 
 * @param {ReactNode} children - The content inside the card
 * @param {string} className - Optional extra Tailwind classes
 * @param {boolean} hoverEffect - Whether to enable the hover lift & glow animation (default: true)
 * @param {string} padding - Responsive padding classes (default: 'p-5 sm:p-6 lg:p-8')
 */
const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  padding = 'p-5 sm:p-6 lg:p-8',
  ...props 
}) => {
  
  const baseClasses = `
    bg-slate-800/40 
    backdrop-blur-xl 
    border border-slate-700/50 
    rounded-2xl 
    shadow-[0_8px_30px_rgb(0,0,0,0.12)]
    relative
    overflow-hidden
  `;

  const hoverClasses = hoverEffect 
    ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.25)] hover:border-slate-600/50' 
    : '';

  // Cleanly join the classes
  const finalClasses = [baseClasses, padding, hoverClasses, className]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className={finalClasses} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
