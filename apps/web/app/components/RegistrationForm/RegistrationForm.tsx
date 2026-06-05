'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormInput from '../FormInput/FormInput';
import { passwordSchema, nameSchema, emailSchema } from '@/lib/auth-validation';

interface RegistrationFormProps {
  onSubmit?: (formData: RegistrationData) => void | Promise<void>;
  error?: string;
}

export interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  message: string;
  color: string;
  requirements: {
    minLength: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export default function RegistrationForm({ onSubmit, error }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calculate password strength
  const passwordStrength = useMemo((): PasswordStrength => {
    const pwd = formData.password;
    const requirements = {
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(pwd),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    let score = 0;
    let message = '';
    let color = '';

    if (pwd.length === 0) {
      score = 0;
      message = '';
      color = '';
    } else if (metRequirements === 4 && pwd.length >= 12) {
      score = 4;
      message = 'Strong password';
      color = 'text-green-500';
    } else if (metRequirements >= 3 && pwd.length >= 10) {
      score = 3;
      message = 'Good password';
      color = 'text-blue-500';
    } else if (metRequirements >= 2) {
      score = 2;
      message = 'Fair password';
      color = 'text-yellow-500';
    } else {
      score = 1;
      message = 'Weak password';
      color = 'text-red-500';
    }

    return { score, message, color, requirements };
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    try {
      emailSchema.parse(formData.email);
    } catch {
      newErrors.email = 'Please enter a valid email address';
    }

    // First name validation
    try {
      nameSchema.parse(formData.firstName);
    } catch {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes (1-50 characters)';
    }

    // Last name validation
    try {
      nameSchema.parse(formData.lastName);
    } catch {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes (1-50 characters)';
    }

    // Password validation
    try {
      passwordSchema.parse(formData.password);
    } catch {
      newErrors.password = 'Password must be 8+ characters with uppercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.length < 2) {
      newErrors.state = 'State must be at least 2 characters';
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    } else if (formData.country.length < 2) {
      newErrors.country = 'Country must be at least 2 characters';
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
      if (onSubmit) {
        await onSubmit(formData);
      }
      // reset form on successful submission
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        state: '',
        country: '',
      });
      setErrors({});
      setShowPasswordRequirements(false);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* welcome heading */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Hello!👋
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Welcome to Daniyaal's Tech Store. Make an account here by filling in
          the following details. If you already have an account,{' '}
          <Link href="/login" className="text-primary hover:underline">
            click here
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

      {/* Section 1: Account Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Account Information
        </h2>
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          error={errors.email}
          placeholder="you@example.com"
          ariaLabel="Email address"
        />
        <FormInput
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={(value) => handleInputChange('firstName', value)}
          error={errors.firstName}
          placeholder="John"
          ariaLabel="First name"
        />
        <FormInput
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={(value) => handleInputChange('lastName', value)}
          error={errors.lastName}
          placeholder="Doe"
          ariaLabel="Last name"
        />

        {/* Password field with strength indicator */}
        <div>
          <FormInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={errors.password}
            placeholder="••••••••"
            ariaLabel="Password"
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
          />

          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Password strength:</span>
                <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                  {passwordStrength.message}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.score === 4
                      ? 'bg-green-500 w-full'
                      : passwordStrength.score === 3
                      ? 'bg-blue-500 w-3/4'
                      : passwordStrength.score === 2
                      ? 'bg-yellow-500 w-1/2'
                      : 'bg-red-500 w-1/4'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Password requirements checklist */}
          {(showPasswordRequirements || formData.password) && (
            <div className="mt-3 p-3 bg-muted rounded-md text-sm space-y-1">
              <p className="font-semibold text-foreground">Password requirements:</p>
              <div className="space-y-1">
                <p className={passwordStrength.requirements.minLength ? 'text-green-500' : 'text-muted-foreground'}>
                  ✓ At least 8 characters
                </p>
                <p className={passwordStrength.requirements.uppercase ? 'text-green-500' : 'text-muted-foreground'}>
                  ✓ At least one uppercase letter (A-Z)
                </p>
                <p className={passwordStrength.requirements.number ? 'text-green-500' : 'text-muted-foreground'}>
                  ✓ At least one number (0-9)
                </p>
                <p className={passwordStrength.requirements.special ? 'text-green-500' : 'text-muted-foreground'}>
                  ✓ At least one special character (!@#$%^&* etc.)
                </p>
              </div>
            </div>
          )}
        </div>

        <FormInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="••••••••"
          ariaLabel="Confirm password"
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
      </div>

      {/* Section 2: Delivery Information */}
      <div className="space-y-4 mt-8">
        <h2 className="text-lg font-semibold text-foreground">
          Delivery Information
        </h2>
        <FormInput
          label="Address"
          type="text"
          value={formData.address}
          onChange={(value) => handleInputChange('address', value)}
          error={errors.address}
          placeholder="123 Example Street"
          ariaLabel="Street address"
        />
        <FormInput
          label="City"
          type="text"
          value={formData.city}
          onChange={(value) => handleInputChange('city', value)}
          error={errors.city}
          placeholder="Sydney"
          ariaLabel="City"
        />
        <FormInput
          label="State"
          type="text"
          value={formData.state}
          onChange={(value) => handleInputChange('state', value)}
          error={errors.state}
          placeholder="NSW"
          ariaLabel="State or province"
        />
        <FormInput
          label="Country"
          type="text"
          value={formData.country}
          onChange={(value) => handleInputChange('country', value)}
          error={errors.country}
          placeholder="Australia"
          ariaLabel="Country"
        />
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
