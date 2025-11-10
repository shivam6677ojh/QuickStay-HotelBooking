import React, { useLayoutEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

// ThemeProvider sets the initial theme synchronously using useLayoutEffect
// to avoid a flash-of-unstyled (light) state and persists choice to localStorage.
export const ThemeProvider = ({ children }) => {
        const [isDarkMode, setIsDarkMode] = useState(() => {
            try {
                const saved = localStorage.getItem('theme');
                if (saved) return saved === 'dark';
            } catch {
                // ignore (e.g. during SSR or restricted env)
            }
        return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // useLayoutEffect runs before paint so the .dark class is applied immediately
    useLayoutEffect(() => {
            try {
                localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            } catch {
                // ignore
            }

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode((v) => !v);

    return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

