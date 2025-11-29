import React, { useLayoutEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

// ThemeProvider now forces dark mode globally (per design request)
export const ThemeProvider = ({ children }) => {
  const [isDarkMode] = useState(true);

  useLayoutEffect(() => {
    try {
      localStorage.setItem('theme', 'dark');
    } catch {
      // ignore storage issues
    }

    document.documentElement.classList.add('dark');
  }, []);

  // toggle becomes a no-op but preserves context contract
  const toggleTheme = () => {};

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

