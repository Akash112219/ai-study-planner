import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    const applyTheme = (t) => {
      if (t === 'light') {
        document.body.classList.add('light-theme');
      } else if (t === 'dark') {
        document.body.classList.remove('light-theme');
      } else if (t === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!isSystemDark) {
          document.body.classList.add('light-theme');
        } else {
          document.body.classList.remove('light-theme');
        }
      }
    };
    
    applyTheme(theme);
    
    // Listen for system theme changes if 'system' is selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
    
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
