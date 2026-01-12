/**
 * Form Validators
 * Real-time validation utilities for form fields
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate phone number (format: +260123456789 or 0123456789)
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; message?: string } {
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }

  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");

  // Check if it's a valid Zambian number
  if (!/^(\+260|0)[0-9]{9}$/.test(cleaned)) {
    return { isValid: false, message: "Enter a valid phone number (e.g., +260123456789)" };
  }

  return { isValid: true };
}

/**
 * Validate PIN (6 digits)
 */
export function validatePIN(pin: string): { isValid: boolean; message?: string } {
  if (!pin) {
    return { isValid: false, message: "PIN is required" };
  }

  if (!/^[0-9]{6}$/.test(pin)) {
    return { isValid: false, message: "PIN must be exactly 6 digits" };
  }

  return { isValid: true };
}

/**
 * Validate email
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Validate loan amount
 */
export function validateLoanAmount(
  amount: number,
  minAmount: number = 1000,
  maxAmount: number = 500000
): { isValid: boolean; message?: string } {
  if (!amount || amount === 0) {
    return { isValid: false, message: "Loan amount is required" };
  }

  if (amount < minAmount) {
    return { isValid: false, message: `Minimum loan amount is K${minAmount.toLocaleString()}` };
  }

  if (amount > maxAmount) {
    return { isValid: false, message: `Maximum loan amount is K${maxAmount.toLocaleString()}` };
  }

  return { isValid: true };
}

/**
 * Validate repayment months
 */
export function validateRepaymentMonths(
  months: number,
  minMonths: number = 3,
  maxMonths: number = 60
): { isValid: boolean; message?: string } {
  if (!months || months === 0) {
    return { isValid: false, message: "Repayment period is required" };
  }

  if (months < minMonths) {
    return { isValid: false, message: `Minimum repayment period is ${minMonths} months` };
  }

  if (months > maxMonths) {
    return { isValid: false, message: `Maximum repayment period is ${maxMonths} months` };
  }

  return { isValid: true };
}

/**
 * Validate loan application form
 */
export function validateLoanApplication(data: {
  loanAmount: number;
  repaymentMonths: number;
  pin: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const amountValidation = validateLoanAmount(data.loanAmount);
  if (!amountValidation.isValid) {
    errors.push({ field: "loanAmount", message: amountValidation.message || "" });
  }

  const monthsValidation = validateRepaymentMonths(data.repaymentMonths);
  if (!monthsValidation.isValid) {
    errors.push({ field: "repaymentMonths", message: monthsValidation.message || "" });
  }

  const pinValidation = validatePIN(data.pin);
  if (!pinValidation.isValid) {
    errors.push({ field: "pin", message: pinValidation.message || "" });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate login form
 */
export function validateLoginForm(data: {
  phone: string;
  pin: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const phoneValidation = validatePhoneNumber(data.phone);
  if (!phoneValidation.isValid) {
    errors.push({ field: "phone", message: phoneValidation.message || "" });
  }

  const pinValidation = validatePIN(data.pin);
  if (!pinValidation.isValid) {
    errors.push({ field: "pin", message: pinValidation.message || "" });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
