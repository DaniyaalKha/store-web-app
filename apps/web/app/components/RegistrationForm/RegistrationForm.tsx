'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormInput from '../FormInput/FormInput';

interface RegistrationFormProps {
  onSubmit?: (formData: RegistrationData) => void;
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

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
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

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // first name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // city validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // state validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
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
        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          error={errors.password}
          placeholder="••••••••"
          ariaLabel="Password"
        />
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
          ariaLabel="State"
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

      {/* Sign up button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
        size="default"
      >
        {isLoading ? 'Creating Account...' : 'Register'}
      </Button>

      {/* login link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </form>
  );
}
