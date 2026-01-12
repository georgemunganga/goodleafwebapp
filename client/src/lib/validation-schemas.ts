import { z } from 'zod';

/**
 * Validation Schemas
 * Zod schemas for API request/response validation
 * Ensures type safety at boundaries
 * 
 * PIN: 4 digits (account creation, verification)
 * OTP: 6 digits (two-factor authentication via SMS/Email)
 */

// ============================================
// REUSABLE SCHEMAS
// ============================================

// PIN Schema (4 digits - for account operations)
export const PIN_SCHEMA = z.string()
  .length(4, 'PIN must be exactly 4 digits')
  .regex(/^\d{4}$/, 'PIN must contain only digits');

export type PIN = z.infer<typeof PIN_SCHEMA>;

// OTP Schema (6 digits - for two-factor authentication)
export const OTP_SCHEMA = z.string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only digits');

export type OTP = z.infer<typeof OTP_SCHEMA>;

// ============================================
// AUTHENTICATION SCHEMAS
// ============================================

// Login with PIN Schema (standard login)
export const LoginSchema = z.object({
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  pin: PIN_SCHEMA,
});

export type Login = z.infer<typeof LoginSchema>;

// OTP Request Schema (request OTP for 2FA)
export const OTPRequestSchema = z.object({
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  method: z.enum(['sms', 'email']).optional().default('sms'),
});

export type OTPRequest = z.infer<typeof OTPRequestSchema>;

// OTP Verification Schema (verify OTP during 2FA login)
export const OTPVerificationSchema = z.object({
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  otp: OTP_SCHEMA,
});

export type OTPVerification = z.infer<typeof OTPVerificationSchema>;

// Login with OTP Schema (two-factor authentication)
export const LoginWithOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  otp: OTP_SCHEMA,
});

export type LoginWithOTP = z.infer<typeof LoginWithOTPSchema>;

// ============================================
// REGISTRATION & ACCOUNT SCHEMAS
// ============================================

// Registration Schema
export const RegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  pin: PIN_SCHEMA,
});

export type Registration = z.infer<typeof RegistrationSchema>;

// PIN Change Schema
export const PINChangeSchema = z.object({
  currentPin: PIN_SCHEMA,
  newPin: PIN_SCHEMA,
  confirmPin: PIN_SCHEMA,
}).superRefine((data, ctx) => {
  if (data.newPin !== data.confirmPin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'PINs do not match',
      path: ['confirmPin'],
    });
  }
});

export type PINChange = z.infer<typeof PINChangeSchema>;

// Profile Update Schema
export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

// ============================================
// LOAN SCHEMAS
// ============================================

// Loan Application Schema
export const LoanApplicationSchema = z.object({
  loanType: z.enum(['personal', 'business']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(5000, 'Minimum loan amount is K5,000').max(50000, 'Maximum loan amount is K50,000'),
  term: z.number().min(6, 'Minimum term is 6 months').max(60, 'Maximum term is 60 months'),
  pin: PIN_SCHEMA,
});

export type LoanApplication = z.infer<typeof LoanApplicationSchema>;

// Loan Restructuring Schema
export const LoanRestructuringSchema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
  newTerm: z.number().min(6, 'Minimum term is 6 months').max(120, 'Maximum term is 120 months'),
  reason: z.string().min(10, 'Please provide a reason for restructuring'),
  pin: PIN_SCHEMA,
});

export type LoanRestructuring = z.infer<typeof LoanRestructuringSchema>;

// ============================================
// REPAYMENT SCHEMAS
// ============================================

// Repayment Schema
export const RepaymentSchema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  paymentMethod: z.enum(['mobile_money', 'bank_transfer', 'card']),
  reference: z.string().optional(),
  pin: PIN_SCHEMA,
});

export type Repayment = z.infer<typeof RepaymentSchema>;

// ============================================
// KYC SCHEMAS
// ============================================

// KYC Document Schema
export const KYCDocumentSchema = z.object({
  documentType: z.enum(['national_id', 'passport', 'drivers_license']),
  documentNumber: z.string().min(5, 'Document number is required'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ),
});

export type KYCDocument = z.infer<typeof KYCDocumentSchema>;

// ============================================
// API RESPONSE SCHEMAS
// ============================================

// Generic API Response Schema
export const APIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  errors: z.record(z.string(), z.any()).optional(),
});

export type APIResponse = z.infer<typeof APIResponseSchema>;
