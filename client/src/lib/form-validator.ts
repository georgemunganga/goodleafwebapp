/**
 * Form Validator
 * Comprehensive validation rules for all forms
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const formValidator = {
  /**
   * Validate phone number format
   */
  validatePhone(phone: string): { isValid: boolean; message?: string } {
    // Remove spaces and special characters
    const cleaned = phone.replace(/\D/g, '');

    // Check if it's a valid length (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return {
        isValid: false,
        message: 'Phone number must be between 10 and 15 digits',
      };
    }

    return { isValid: true };
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): { isValid: boolean; message?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Please enter a valid email address',
      };
    }

    return { isValid: true };
  },

  /**
   * Validate PIN (6 digits)
   */
  validatePin(pin: string): { isValid: boolean; message?: string } {
    if (!pin || pin.length !== 6) {
      return {
        isValid: false,
        message: 'PIN must be exactly 6 digits',
      };
    }

    if (!/^\d{6}$/.test(pin)) {
      return {
        isValid: false,
        message: 'PIN must contain only numbers',
      };
    }

    // Check for sequential or repeated digits
    if (/^(\d)\1{5}$/.test(pin)) {
      return {
        isValid: false,
        message: 'PIN cannot contain all the same digits',
      };
    }

    return { isValid: true };
  },

  /**
   * Validate loan amount
   */
  validateLoanAmount(
    amount: number,
    minAmount: number = 1000,
    maxAmount: number = 1000000
  ): { isValid: boolean; message?: string } {
    if (!amount || amount <= 0) {
      return {
        isValid: false,
        message: 'Loan amount must be greater than 0',
      };
    }

    if (amount < minAmount) {
      return {
        isValid: false,
        message: `Minimum loan amount is ${minAmount.toLocaleString()}`,
      };
    }

    if (amount > maxAmount) {
      return {
        isValid: false,
        message: `Maximum loan amount is ${maxAmount.toLocaleString()}`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate loan tenure (in months)
   */
  validateTenure(
    months: number,
    minMonths: number = 3,
    maxMonths: number = 60
  ): { isValid: boolean; message?: string } {
    if (!months || months <= 0) {
      return {
        isValid: false,
        message: 'Tenure must be greater than 0',
      };
    }

    if (months < minMonths) {
      return {
        isValid: false,
        message: `Minimum tenure is ${minMonths} months`,
      };
    }

    if (months > maxMonths) {
      return {
        isValid: false,
        message: `Maximum tenure is ${maxMonths} months`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate required field
   */
  validateRequired(value: string | number | undefined): {
    isValid: boolean;
    message?: string;
  } {
    if (value === undefined || value === null || value === '') {
      return {
        isValid: false,
        message: 'This field is required',
      };
    }

    return { isValid: true };
  },

  /**
   * Validate minimum length
   */
  validateMinLength(
    value: string,
    minLength: number
  ): { isValid: boolean; message?: string } {
    if (value.length < minLength) {
      return {
        isValid: false,
        message: `Minimum length is ${minLength} characters`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate maximum length
   */
  validateMaxLength(
    value: string,
    maxLength: number
  ): { isValid: boolean; message?: string } {
    if (value.length > maxLength) {
      return {
        isValid: false,
        message: `Maximum length is ${maxLength} characters`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate file upload
   */
  validateFile(
    file: File,
    maxSizeMB: number = 5,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
  ): { isValid: boolean; message?: string } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        message: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate date range
   */
  validateDateRange(
    startDate: Date,
    endDate: Date,
    minDays: number = 1
  ): { isValid: boolean; message?: string } {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < minDays) {
      return {
        isValid: false,
        message: `Date range must be at least ${minDays} day(s)`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength(
    password: string
  ): { isValid: boolean; message?: string; strength: 'weak' | 'medium' | 'strong' } {
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters',
        strength,
      };
    }

    // Check for uppercase, lowercase, numbers, and special characters
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const complexity = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (complexity >= 3) {
      strength = 'strong';
    } else if (complexity >= 2) {
      strength = 'medium';
    }

    return { isValid: true, strength };
  },

  /**
   * Validate form object against rules
   */
  validateForm(
    formData: Record<string, any>,
    rules: Record<string, Array<(value: any) => { isValid: boolean; message?: string }>>
  ): ValidationResult {
    const errors: ValidationError[] = [];

    Object.entries(rules).forEach(([field, fieldRules]) => {
      const value = formData[field];

      for (const rule of fieldRules) {
        const result = rule(value);
        if (!result.isValid) {
          errors.push({
            field,
            message: result.message || 'Validation failed',
          });
          break; // Stop at first error for this field
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
