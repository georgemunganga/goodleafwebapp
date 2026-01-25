import React from 'react';
import { FieldError } from 'react-hook-form';

/**
 * FormField Component
 * Wrapper for form inputs with consistent error display and styling
 * Works with React Hook Form
 */

interface FormFieldProps {
  label?: string;
  error?: FieldError;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error.message}
        </p>
      )}

      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * FormFieldGroup Component
 * Wrapper for multiple related fields (e.g., phone number with country code)
 */
interface FormFieldGroupProps {
  children: React.ReactNode;
  layout?: 'row' | 'column';
  gap?: 'sm' | 'md' | 'lg';
}

export function FormFieldGroup({
  children,
  layout = 'column',
  gap = 'md',
}: FormFieldGroupProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const layoutClasses = layout === 'row' ? 'flex flex-row' : 'flex flex-col';

  return (
    <div className={`${layoutClasses} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}
