import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  rows = 4,
  ...props 
}, ref) => {
  const baseClasses = `
    w-full bg-slate-800/50 border rounded-xl px-4 py-3
    text-slate-200 placeholder-slate-500 transition-all duration-300
    focus:outline-none focus:ring-1 resize-y
  `;

  const stateClasses = error 
    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
    : 'border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500 shadow-inner';

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      
      <textarea 
        ref={ref}
        rows={rows}
        className={`${baseClasses} ${stateClasses}`}
        {...props}
      />
      
      {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
