import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Advanced Premium DatePicker using react-datepicker
 * Styled for the dark glassmorphic theme.
 */
const DatePicker = forwardRef(({ label, className = '', error, value, onChange, name, required, ...props }, ref) => {
  // Convert standard string YYYY-MM-DD back to Date object for the picker
  const selectedDate = value ? new Date(value) : null;

  const handleDateChange = (date) => {
    if (!onChange) return;
    
    // Convert back to string format YYYY-MM-DD for the parent component
    const dateString = date ? date.toISOString().split('T')[0] : '';
    
    // Simulate standard event object to keep compatibility
    onChange({
      target: {
        name: name,
        value: dateString
      }
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Calendar Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>

        {/* The ReactDatePicker Input */}
        {/* We use a custom CSS wrapper class to style the popup */}
        <div className="custom-datepicker-wrapper w-full">
          <ReactDatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Exam Date..."
            className="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none transition-all duration-300 focus:bg-slate-800 focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] shadow-inner backdrop-blur-md appearance-none"
            calendarClassName="bg-slate-900 border border-slate-700 shadow-2xl rounded-xl font-sans"
            {...props}
          />
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;

