'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import type { AuthUser } from './auth-utils';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (data: SignupData) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
}

export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // load session on mount
  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        setUser(null);
        return null;
      }

      const text = await response.text();
      
      if (!text) {
        setUser(null);
        return null;
      }

      const data = JSON.parse(text);
      if (data.session?.user) {
        const baUser = data.session.user;
        const appUser: AuthUser = {
          id: baUser.id,
          email: baUser.email,
          firstName: baUser.firstName || '',
          lastName: baUser.lastName || '',
          role: (baUser.role || 'customer') as 'customer' | 'admin',
          address: baUser.address,
          city: baUser.city,
          state: baUser.state,
          country: baUser.country,
        };
        setUser(appUser);
        return appUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => {
      setLoading(false);
    });
  }, [refreshSession]);

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Login failed');
      }

      const data = await response.json();
      const baUser = data.user;
      const appUser: AuthUser = {
        id: baUser.id,
        email: baUser.email,
        firstName: baUser.firstName || '',
        lastName: baUser.lastName || '',
        role: (baUser.role || 'customer') as 'customer' | 'admin',
        address: baUser.address,
        city: baUser.city,
        state: baUser.state,
        country: baUser.country,
      };
      setUser(appUser);
      return appUser;
    } catch (error) {
      throw error;
    }
  }

  async function signup(formData: SignupData) {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Signup error response:', responseText);
        let errorMessage = 'Signup failed';
        try {
          const data = JSON.parse(responseText);
          errorMessage = data.error?.message || data.error || 'Signup failed';
        } catch (e) {
          // Response wasn't JSON
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const baUser = data.user;
      const appUser: AuthUser = {
        id: baUser.id,
        email: baUser.email,
        firstName: baUser.firstName || '',
        lastName: baUser.lastName || '',
        role: (baUser.role || 'customer') as 'customer' | 'admin',
        address: baUser.address,
        city: baUser.city,
        state: baUser.state,
        country: baUser.country,
      };
      setUser(appUser);
      return appUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
