import React, { forwardRef } from 'react';

const Select = forwardRef(({ 
  label, 
  error, 
  helperText, 
  options = [], 
  className = '', 
  placeholder,
  ...props 
}, ref) => {
  const baseClasses = `
    w-full bg-slate-800/50 border rounded-xl px-4 py-3
    text-slate-200 placeholder-slate-500 transition-all duration-300
    focus:outline-none focus:ring-1 appearance-none cursor-pointer
  `;

  const stateClasses = error 
    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
    : 'border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500 shadow-inner';

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <div className="relative">
        <select 
          ref={ref}
          className={`${baseClasses} ${stateClasses}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt} className="bg-slate-800 text-slate-200">
              {opt.label || opt}
            </option>
          ))}
        </select>
        
        {/* Custom Dropdown Arrow */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
