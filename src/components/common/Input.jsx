import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  leftIcon,
  rightIcon,
  type = 'text',
  ...props 
}, ref) => {
  const baseClasses = `
    w-full bg-slate-800/50 border rounded-xl 
    text-slate-200 placeholder-slate-500 transition-all duration-300
    focus:outline-none focus:ring-1 
  `;

  const stateClasses = error 
    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
    : 'border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500 shadow-inner';

  const paddingClasses = `
    py-3 
    ${leftIcon ? 'pl-11' : 'pl-4'} 
    ${rightIcon ? 'pr-11' : 'pr-4'}
  `;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input 
          ref={ref}
          type={type}
          className={`${baseClasses} ${stateClasses} ${paddingClasses}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
