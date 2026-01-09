// types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  balance?: number;
  address?: string;
  income?: number;
  expenses?: number;
  creditScore?: number;
  existingDebt?: number;
  employmentYears?: number;
}

export interface Loan {
  id: number | string;
  userId?: number;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'active' | 'paid' | 'repaid' | 'rejected' | 'restructuring_requested';
  date: string;
  outstanding?: number;
  nextPayment?: string;
  amountDue?: number;
  progress?: number;
  interestRate?: number;
  disbursed?: number;
  totalRepayment?: number;
  remainingMonths?: number;
  tenure?: number;
  proposedTenure?: number;
  restructuringReason?: string;
  restructuringExplanation?: string;
}

export interface LoanApplicationData {
  type: string;
  amount: number;
  purpose?: string;
  tenure?: number;
  interestRate?: number;
  amountDue?: number;
  totalRepayment?: number;
}

export interface Repayment {
  id: number;
  loanId: number;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface LoanTerms {
  interestRate: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  tenureMonths: number;
}

export interface LoanScheduleItem {
  date: string;
  amount: number;
  status: 'paid' | 'due' | 'upcoming';
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
}

export interface EligibilityRequest {
  income: number;
  expenses: number;
  creditScore: number;
  existingDebt?: number;
  employmentYears?: number;
}

export interface EligibilityResponse {
  eligible: boolean;
  maxAmount: number;
  interestRate: number;
  message: string;
  recommendedAmount?: number;
  tenureOptions?: number[]; // in months
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email?: string;
  password: string;
  phone?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
