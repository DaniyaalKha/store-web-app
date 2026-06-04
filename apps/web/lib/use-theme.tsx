'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';

const STORAGE_KEY = 'theme-mode';
const DARK_CLASS = 'dark';

type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // initialise theme
  useEffect(() => {
    const initializeTheme = async () => {
      let preferredTheme: ThemeMode = 'dark'; // default

      // 1: read from cookie 
      const cookies = document.cookie.split('; ');
      const themeCookie = cookies.find(c => c.startsWith('theme-mode='));
      if (themeCookie) {
        const cookieValue = themeCookie.split('=')[1] as ThemeMode;
        if (cookieValue === 'light' || cookieValue === 'dark') {
          preferredTheme = cookieValue;
        }
      }
      // 2: read from database (authenticated user)
      else if (user?.preferredMode) {
        preferredTheme = (user.preferredMode as ThemeMode) || 'dark';
      }
      // 3: read from localStorage (non-authenticated user)
      else {
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        if (stored === 'light' || stored === 'dark') {
          preferredTheme = stored;
        }
      }

      setTheme(preferredTheme);
      applyTheme(preferredTheme);
      setIsLoading(false);
    };

    initializeTheme();
  }, [user]);

  const applyTheme = (mode: ThemeMode) => {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add(DARK_CLASS);
    } else {
      html.classList.remove(DARK_CLASS);
    }
  };

  const toggleTheme = async () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);

    // save to cookie for server-side SSR
    document.cookie = `theme-mode=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year

    // save to localStorage as backup
    localStorage.setItem(STORAGE_KEY, newTheme);

    if (user?.id) {
      // if authenticated: save to database
      try {
        await fetch('/api/user/theme', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preferredMode: newTheme }),
        });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  return { theme, toggleTheme, isLoading };
}
