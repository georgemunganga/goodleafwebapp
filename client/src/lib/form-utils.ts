import { FieldValues, UseFormSetError } from 'react-hook-form';
import { ZodError } from 'zod';

/**
 * Form Utilities
 * Helper functions for React Hook Form + Zod integration
 */

/**
 * Map Zod validation errors to React Hook Form field errors
 * Allows displaying field-specific error messages
 */
export function mapZodErrorsToFormErrors<T extends FieldValues>(
  error: ZodError,
  setError: UseFormSetError<T>
) {
  (error as any).errors?.forEach((err: any) => {
    const path = err.path.join('.') as any;
    setError(path, {
      type: 'manual',
      message: err.message,
    });
  });
}

/**
 * Format validation error message for display
 * Converts technical error codes to user-friendly messages
 */
export function formatValidationError(error: string): string {
  const errorMap: Record<string, string> = {
    'invalid_type': 'Invalid input type',
    'too_small': 'Value is too small',
    'too_big': 'Value is too large',
    'invalid_string': 'Invalid format',
    'invalid_enum': 'Invalid selection',
    'custom': 'Validation error',
  };

  return errorMap[error] || error;
}

/**
 * Check if form has any errors
 */
export function hasFormErrors<T extends FieldValues>(
  errors: Record<string, any>
): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get first error message from form errors
 */
export function getFirstErrorMessage<T extends FieldValues>(
  errors: Record<string, any>
): string | null {
  const firstError = Object.values(errors)[0];
  return firstError?.message || null;
}

/**
 * Clear specific field error
 */
export function clearFieldError<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fieldName: string
) {
  setError(fieldName as any, { type: 'manual', message: '' });
}
