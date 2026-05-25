import React from 'react';

/**
 * Reusable Futuristic Button Component
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' (default: 'primary')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} isLoading - Shows loading spinner and disables button
 * @param {boolean} fullWidth - Makes button width 100%
 * @param {ReactNode} leftIcon - Icon to render before children
 * @param {ReactNode} rightIcon - Icon to render after children
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  
  // Base structural classes
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-xl transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  // Sizing variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  // Thematic variants with futuristic glowing hover states
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-teal-600 text-white
      shadow-[0_0_15px_rgba(16,185,129,0.2)] 
      hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:from-emerald-400 hover:to-teal-500
      focus:ring-emerald-500
    `,
    secondary: `
      bg-slate-800 text-slate-200 border border-slate-700
      hover:bg-slate-700 hover:text-white hover:border-slate-500
      shadow-[0_4px_10px_rgba(0,0,0,0.2)]
      focus:ring-slate-500
    `,
    outline: `
      bg-transparent text-emerald-400 border-2 border-emerald-500/50
      hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300
      hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
      focus:ring-emerald-500
    `,
  };

  // Combine all classes
  const finalClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ').trim();

  // Loading Spinner SVG
  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button 
      className={finalClasses}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Spinner />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
