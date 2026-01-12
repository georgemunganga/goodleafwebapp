/**
 * API Types and Interfaces
 * Defines all request/response types for backend API integration
 */

// ============ Authentication ============
export interface LoginRequest {
  phone?: string;
  email?: string;
  pin: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

export interface ForgotPINRequest {
  email: string;
  phone: string;
}

export interface ForgotPINResponse {
  success: boolean;
  message: string;
  verificationId: string;
}

export interface ResetPINRequest {
  verificationId: string;
  newPin: string;
  confirmPin: string;
}

export interface ResetPINResponse {
  success: boolean;
  message: string;
}

// ============ User Profile ============
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  idNumber?: string;
  idType?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: UserProfile;
}

// ============ Loan Application ============
export interface LoanApplicationRequest {
  loanType: "personal" | "business";
  loanCategory: string;
  institutionName?: string;
  loanAmount: number;
  repaymentMonths: number;
  purpose?: string;
  monthlyIncome?: number;
  employmentStatus?: string;
  existingDebt?: number;
}

export interface LoanApplicationResponse {
  success: boolean;
  applicationId: string;
  loanId: string;
  status: "pending" | "approved" | "rejected";
  message: string;
  loanDetails?: LoanDetails;
}

export interface PreEligibilityRequest {
  loanType: "personal" | "business";
  monthlyIncome: number;
  employmentStatus: string;
  existingDebt: number;
  loanAmount: number;
}

export interface PreEligibilityResponse {
  eligible: boolean;
  score: number;
  message: string;
  maxLoanAmount: number;
  interestRate: number;
}

// ============ Loan Details ============
export interface LoanDetails {
  id: string;
  loanId: string;
  userId: string;
  loanType: "personal" | "business";
  loanCategory: string;
  loanAmount: number;
  principalAmount: number;
  interestRate: number;
  serviceCharge: number;
  totalRepayment: number;
  repaymentMonths: number;
  monthlyPayment: number;
  status: "active" | "completed" | "defaulted" | "pending" | "rejected";
  approvalDate: string;
  firstPaymentDate: string;
  maturityDate: string;
  nextPaymentDate: string;
  amountPaid: number;
  amountRemaining: number;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepaymentSchedule {
  id: string;
  loanId: string;
  dueDate: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  status: "pending" | "paid" | "overdue";
  paidDate?: string;
  paidAmount?: number;
}

// ============ Payments ============
export interface PaymentRequest {
  loanId: string;
  amount: number;
  paymentMethod: "bank_transfer" | "mobile_money" | "card";
  reference?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: "pending" | "completed" | "failed";
  message: string;
}

export interface PaymentHistory {
  id: string;
  transactionId: string;
  loanId: string;
  amount: number;
  paymentMethod: "bank_transfer" | "mobile_money" | "card";
  status: "completed" | "pending" | "failed";
  date: string;
  reference: string;
  description: string;
}

export interface EarlyRepaymentCalculation {
  loanId: string;
  earlyPaymentAmount: number;
  interestSaved: number;
  newMaturityDate: string;
  totalPayment: number;
}

export interface EarlyRepaymentRequest {
  loanId: string;
  repaymentAmount: number;
}

export interface EarlyRepaymentResponse {
  success: boolean;
  message: string;
  calculation: EarlyRepaymentCalculation;
}

// ============ Loan Restructuring ============
export interface LoanRestructuringRequest {
  loanId: string;
  newRepaymentMonths: number;
  reason: string;
}

export interface LoanRestructuringResponse {
  success: boolean;
  requestId: string;
  status: "pending" | "approved" | "rejected";
  message: string;
  newDetails?: LoanDetails;
}

// ============ KYC / Document Upload ============
export interface DocumentUploadRequest {
  userId: string;
  documentType: "id" | "proof_of_income" | "bank_statement" | "utility_bill";
  file: File;
}

export interface DocumentUploadResponse {
  success: boolean;
  documentId: string;
  url: string;
  status: "pending" | "verified" | "rejected";
  message: string;
}

export interface KYCStatus {
  userId: string;
  status: "pending" | "completed" | "rejected";
  documents: {
    id: string;
    type: string;
    status: "pending" | "verified" | "rejected";
    uploadedAt: string;
  }[];
  verificationDate?: string;
  rejectionReason?: string;
}

// ============ Notifications ============
export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  paymentReminders: boolean;
  applicationUpdates: boolean;
  promotions: boolean;
  reminderFrequency: "daily" | "weekly" | "monthly";
}

export interface UpdateNotificationSettingsRequest {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  paymentReminders?: boolean;
  applicationUpdates?: boolean;
  promotions?: boolean;
  reminderFrequency?: "daily" | "weekly" | "monthly";
}

// ============ Security ============
export interface SecuritySettings {
  userId: string;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  lastLoginDate: string;
  loginAttempts: number;
  accountLocked: boolean;
}

export interface EnableTwoFactorRequest {
  method: "sms" | "email" | "authenticator";
}

export interface EnableTwoFactorResponse {
  success: boolean;
  secret?: string;
  qrCode?: string;
  message: string;
}

// ============ Generic API Response ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, any>;
}

// ============ Pagination ============
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
