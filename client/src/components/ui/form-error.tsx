/**
 * FormError Component
 * Displays validation error messages with icon
 */

import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-red-600 mt-2 ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * FormSuccess Component
 * Displays success messages with icon
 */
export function FormSuccess({ message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-green-600 mt-2 ${className}`}>
      <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <span>{message}</span>
    </div>
  );
}
