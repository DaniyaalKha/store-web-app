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

      if (user?.preferredMode) {
        // if authenticated: get preference from database
        preferredTheme = (user.preferredMode as ThemeMode) || 'dark';
      } else {
        // if not authenticated: check localStorage
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
