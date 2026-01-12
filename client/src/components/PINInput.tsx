import React, { useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PINInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  maxLength?: number;
  type?: 'pin' | 'otp'; // pin = 4 digits, otp = 6 digits
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * PINInput Component
 * Reusable input for PIN (4 digits) and OTP (6 digits)
 * Features:
 * - Automatic digit-only filtering
 * - Visual masking (displays as dots)
 * - Show/hide toggle
 * - Auto-focus next field (for OTP grids)
 * - Keyboard navigation support
 */
export const PINInput = React.forwardRef<HTMLInputElement, PINInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = '••••',
      maxLength = 4,
      type = 'pin',
      disabled = false,
      error = false,
      autoFocus = false,
      className = '',
    },
    ref
  ) => {
    const [showValue, setShowValue] = React.useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Set maxLength based on type
    const actualMaxLength = type === 'otp' ? 6 : 4;

    // Handle input change - only allow digits
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Filter to only digits
      const digitsOnly = inputValue.replace(/\D/g, '');
      
      // Limit to maxLength
      const limited = digitsOnly.slice(0, actualMaxLength);
      
      onChange(limited);
    };

    // Handle paste - extract digits only
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const digitsOnly = pastedText.replace(/\D/g, '');
      const limited = digitsOnly.slice(0, actualMaxLength);
      onChange(limited);
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow backspace, delete, arrow keys, tab
      if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        return;
      }

      // Only allow digits
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    // Auto-focus on mount if requested
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    // Merge refs
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    return (
      <div className="relative">
        <input
          ref={inputRef}
          type={showValue ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={actualMaxLength}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="off"
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:outline-none focus:ring-2 transition-colors
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-[#2e7146] focus:ring-green-100'
            }
            ${className}
            pr-10
          `}
        />
        
        {/* Show/Hide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowValue(!showValue)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={showValue ? 'Hide PIN' : 'Show PIN'}
        >
          {showValue ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }
);

PINInput.displayName = 'PINInput';

/**
 * OTPGrid Component
 * Displays 6 separate input fields for OTP entry
 * Auto-focuses next field on digit entry
 */
interface OTPGridProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const OTPGrid = React.forwardRef<HTMLDivElement, OTPGridProps>(
  ({ value, onChange, onComplete, disabled = false, error = false, className = '' }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, digit: string) => {
      // Only allow single digit
      const singleDigit = digit.replace(/\D/g, '').slice(0, 1);
      
      const newValue = value.split('');
      newValue[index] = singleDigit;
      const result = newValue.join('');
      
      onChange(result);

      // Auto-focus next field
      if (singleDigit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Call onComplete if all fields filled
      if (result.length === 6 && onComplete) {
        onComplete();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        // Move to previous field on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const digitsOnly = pastedText.replace(/\D/g, '').slice(0, 6);
      onChange(digitsOnly);

      // Focus last field
      if (digitsOnly.length > 0) {
        inputRefs.current[Math.min(digitsOnly.length, 5)]?.focus();
      }
    };

    return (
      <div ref={ref} className={`flex gap-2 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-lg font-bold border-2 rounded-lg
              focus:outline-none focus:ring-2 transition-colors
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-[#2e7146] focus:ring-green-100'
              }
            `}
          />
        ))}
      </div>
    );
  }
);

OTPGrid.displayName = 'OTPGrid';
