'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormInput from '../FormInput/FormInput';

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void | Promise<void>;
  error?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // handle onSubmit
      if (onSubmit) {
        await onSubmit(email, password);
      }
      // clear form
      setEmail('');
      setPassword('');
      setErrors({});
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* welcome heading */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Welcome back.
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Welcome back to Daniyaal's Tech Store. Please sign in with your email
          and password or create an account by{' '}
          <Link href="/register" className="text-primary hover:underline">
            clicking here
          </Link>
          .
        </p>
      </div>

      {/* error message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* login form fields */}
      <div className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          placeholder="you@example.com"
          ariaLabel="Email address"
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          placeholder="••••••••"
          ariaLabel="Password"
        />
      </div>

      {/* login button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
        size="default"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Sign up link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account yet? </span>
        <Link href="/register" className="text-primary hover:underline font-medium">
          Sign up here
        </Link>
      </div>
    </form>
  );
}
