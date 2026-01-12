import { z } from 'zod';

/**
 * Validation Schemas
 * Zod schemas for API request/response validation
 * Ensures type safety at boundaries
 */

// Loan Application Schema
export const LoanApplicationSchema = z.object({
  loanType: z.enum(['personal', 'business']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(5000, 'Minimum loan amount is K5,000').max(50000, 'Maximum loan amount is K50,000'),
  term: z.number().min(6, 'Minimum term is 6 months').max(60, 'Maximum term is 60 months'),
});

export type LoanApplication = z.infer<typeof LoanApplicationSchema>;

// Registration Schema
export const RegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(6, 'PIN must be at most 6 digits'),
});

export type Registration = z.infer<typeof RegistrationSchema>;

// Login Schema
export const LoginSchema = z.object({
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid phone number'),
  pin: z.string().min(4, 'PIN is required'),
});

export type Login = z.infer<typeof LoginSchema>;

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

// Repayment Schema
export const RepaymentSchema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  paymentMethod: z.enum(['mobile_money', 'bank_transfer', 'card']),
  reference: z.string().optional(),
});

export type Repayment = z.infer<typeof RepaymentSchema>;

// Profile Update Schema
export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid phone number').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

// PIN Change Schema
export const PINChangeSchema = z.object({
  currentPin: z.string().min(4, 'Current PIN is required'),
  newPin: z.string().min(4, 'New PIN must be at least 4 digits').max(6, 'New PIN must be at most 6 digits'),
  confirmPin: z.string().min(4, 'Confirmation PIN is required'),
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

// Loan Restructuring Schema
export const LoanRestructuringSchema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
  newTerm: z.number().min(6, 'Minimum term is 6 months').max(120, 'Maximum term is 120 months'),
  reason: z.string().min(10, 'Please provide a reason for restructuring'),
});

export type LoanRestructuring = z.infer<typeof LoanRestructuringSchema>;

// Generic API Response Schema
export const APIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  errors: z.record(z.string(), z.any()).optional(),
});

export type APIResponse = z.infer<typeof APIResponseSchema>;
