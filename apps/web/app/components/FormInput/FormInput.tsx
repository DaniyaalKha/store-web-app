'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  label: string;
  type: 'email' | 'password' | 'text';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  ariaLabel?: string;
}

export default function FormInput({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  ariaLabel,
}: FormInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-foreground">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        className={error ? 'aria-invalid' : ''}
      />
      {error && (
        <p className="text-destructive text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
