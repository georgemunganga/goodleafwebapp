/**
 * API Service Layer
 * Handles all HTTP requests to backend APIs
 * Supports both real API and mock data based on USAGE_DEMO flag
 */

import * as Types from './api-types';
import { apiCall, apiCallFormData } from './api-config';

const USAGE_DEMO = import.meta.env.VITE_USAGE_DEMO === 'true';

const normalizeAuthUser = (user: Types.LoginResponse['user']) => {
  const nameFromParts = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  const normalizedName = user.name?.trim() || nameFromParts || undefined;
  return { ...user, name: normalizedName };
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value == null) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (value == null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const extractDataArray = <T>(response: unknown): T[] => {
  if (Array.isArray(response)) {
    return response as T[];
  }
  if (response && typeof response === 'object') {
    const data = (response as { data?: unknown }).data;
    if (Array.isArray(data)) {
      return data as T[];
    }
  }
  return [];
};

const extractDataObject = <T>(response: unknown): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as { data?: unknown }).data;
    if (data && typeof data === 'object') {
      return data as T;
    }
  }
  return response as T;
};

const normalizeRange = (range: any): Types.LoanConfigRange => ({
  min: toOptionalNumber(range?.min),
  default: toOptionalNumber(range?.default),
  max: toOptionalNumber(range?.max),
});

const normalizeDuration = (duration: any): Types.LoanConfigDuration => {
  const base = normalizeRange(duration);
  const periodRaw = typeof duration?.period === 'string' ? duration.period.trim() : '';
  const period = periodRaw.length > 0 ? periodRaw : 'month';
  return {
    ...base,
    period,
  };
};

const normalizeRates = (rates: any): Types.LoanConfigRates => {
  const base = normalizeRange(rates);
  const periodRaw = typeof rates?.period === 'string' ? rates.period.trim() : '';
  const period = periodRaw.length > 0 ? periodRaw : 'per-month';

  const methods = Array.isArray(rates?.methods)
    ? rates.methods
        .map((method: any) => ({
          id: toNumber(method?.id),
          name: typeof method?.name === 'string' && method.name.trim().length > 0 ? method.name : 'Standard',
          description: method?.description ?? null,
        }))
        .filter((method: Types.LoanConfigMethod) => method.id > 0)
    : [];

  const types = Array.isArray(rates?.types)
    ? rates.types
        .map((type: any) => ({
          id: toNumber(type?.id),
          name: typeof type?.name === 'string' && type.name.trim().length > 0 ? type.name : 'Percentage',
          description: type?.description ?? null,
        }))
        .filter((type: Types.LoanConfigRateType) => type.id > 0)
    : [];

  return {
    ...base,
    period,
    methods,
    types,
  };
};

const normalizeProduct = (product: any): Types.LoanConfigProduct => {
  const terms = product?.terms ?? {};
  const principal = normalizeRange(terms.principal);
  const duration = normalizeDuration(terms.duration);
  const repayments = normalizeRange(terms.repayments);

  const repaymentCycles = Array.isArray(product?.repaymentCycles)
    ? product.repaymentCycles
        .map((cycle: any) => ({
          id: toNumber(cycle?.id),
          name: cycle?.name ?? null,
        }))
        .filter((cycle: Types.LoanConfigRepaymentCycle) => cycle.id >= 0)
    : [];

  return {
    id: toNumber(product?.id),
    name:
      typeof product?.name === 'string' && product.name.trim().length > 0
        ? product.name
        : 'Loan Product',
    description: product?.description ?? null,
    terms: {
      principal,
      duration,
      repayments,
    },
    rates: normalizeRates(product?.rates),
    repaymentCycles,
    compliances: Array.isArray(product?.compliances) ? product.compliances : [],
  };
};

const normalizeCategory = (category: any): Types.LoanConfigCategory => {
  const products = Array.isArray(category?.products)
    ? category.products.map(normalizeProduct).filter((product: Types.LoanConfigProduct) => product.id > 0)
    : [];

  return {
    id: toNumber(category?.id),
    name:
      typeof category?.name === 'string' && category.name.trim().length > 0
        ? category.name
        : 'Loan Category',
    description: category?.description ?? null,
    products,
  };
};

const normalizeLoanConfigType = (loanType: any): Types.LoanConfigLoanType => {
  const categories = Array.isArray(loanType?.categories)
    ? loanType.categories
        .map(normalizeCategory)
        .filter((category: Types.LoanConfigCategory) => category.id > 0 && category.products.length > 0)
    : [];

  return {
    id: toNumber(loanType?.id),
    name:
      typeof loanType?.name === 'string' && loanType.name.trim().length > 0
        ? loanType.name
        : 'Loan Type',
    description: loanType?.description ?? null,
    categories,
  };
};

const normalizeLoan = (loan: any): Types.LoanDetails => {
  return {
    ...loan,
    id: String(loan.id),
    loanId: String(loan.loanId),
    userId: String(loan.userId),
    loanAmount: toNumber(loan.loanAmount),
    principalAmount: toNumber(loan.principalAmount),
    interestRate: toNumber(loan.interestRate),
    serviceCharge: toNumber(loan.serviceCharge),
    totalRepayment: toNumber(loan.totalRepayment),
    repaymentMonths: toNumber(loan.repaymentMonths),
    monthlyPayment: toNumber(loan.monthlyPayment),
    amountPaid: toNumber(loan.amountPaid),
    amountRemaining: toNumber(loan.amountRemaining),
  };
};

// ============ Authentication ============
export const authService = {
  async login(request: Types.LoginRequest): Promise<Types.LoginOTPResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'OTP sent successfully',
        otpId: 'otp-' + Date.now(),
      };
    }
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async forgotPIN(request: Types.ForgotPINRequest): Promise<Types.ForgotPINResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Verification code sent to your email',
        verificationId: 'verify-' + Date.now(),
      };
    }
    return apiCall('/auth/forgot-pin', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async resetPIN(request: Types.ResetPINRequest): Promise<Types.ResetPINResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'PIN reset successfully',
      };
    }
    return apiCall('/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async validatePinToken(token: string): Promise<Types.ValidatePinTokenResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Token is valid',
        email: 'demo@goodleaf.test',
      };
    }
    return apiCall('/auth/validate-pin-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async setPin(request: Types.SetPinRequest): Promise<Types.SetPinResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'PIN set successfully',
      };
    }
    return apiCall('/auth/set-pin', {
      method: 'POST',
      body: JSON.stringify({
        token: request.token,
        pin: request.pin,
        confirm_pin: request.confirmPin ?? request.pin,
        confirmPin: request.confirmPin ?? request.pin,
        pin_confirmation: request.confirmPin ?? request.pin,
      }),
    });
  },

  async register(request: any): Promise<any> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Registration successful',
        user: {
          id: 'user-' + Date.now(),
          name: request.firstName + ' ' + request.lastName,
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phone: request.phone,
        },
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token',
      };
    }

    // Ensure all required fields are present for registration
    const payload = {
      firstName: request.firstName || '',
      lastName: request.lastName || '',
      email: request.email || '',
      password: request.password || '',
      phone: request.phone || '',
      pin: request.pin || '',
      loanProductId: request.loanProductId || 1,
      institutionName: request.institutionName || null,
      loanAmount: request.loanAmount || 0,
      repaymentMonths: request.repaymentMonths || 0,
      ...request // Include any additional fields
    };

    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Register user and apply for loan in a single request
  async registerWithLoanApplication(userData: any, loanData: any): Promise<any> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Registration and loan application successful',
        user: {
          id: 'user-' + Date.now(),
          name: userData.firstName + ' ' + userData.lastName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
        },
        loan: {
          id: 'loan-' + Date.now(),
          userId: 'user-' + Date.now(),
          type: loanData.type || 'Personal Loan',
          amount: userData.loanAmount || loanData.amount,
          status: 'pending',
          tenure: userData.repaymentMonths || loanData.tenure,
          interestRate: loanData.interestRate,
          amountDue: loanData.amountDue,
          totalRepayment: loanData.totalRepayment,
        },
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token',
      };
    }

    // Ensure all required fields are present before sending
    const payload = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      password: userData.password || '',
      phone: userData.phone || '',
      pin: userData.pin || '',
      loanProductId: userData.loanProductId || 1,
      institutionName: userData.institutionName || null,
      loanAmount: userData.loanAmount || 0,
      repaymentMonths: userData.repaymentMonths || 0,
      ...userData // Include any additional fields
    };

    // Send the complete user data to the registration endpoint
    // The backend expects all fields in a single request
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async requestOTP(request: { email?: string; phone?: string }): Promise<{ success: boolean; message: string; otpId: string }> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'OTP sent successfully',
        otpId: 'otp-' + Date.now(),
      };
    }
    return apiCall('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async verifyOTP(request: { otpId: string; otp: string }): Promise<Types.LoginResponse> {
    if (USAGE_DEMO) {
      const user = normalizeAuthUser({
        id: 'user-123',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+260123456789',
      });

      return {
        success: true,
        user,
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token',
      };
    }
    const response = await apiCall<Types.LoginResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return { ...response, user: normalizeAuthUser(response.user) };
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};

// ============ User Profile ============
export const userService = {
  async getProfile(): Promise<Types.UserProfile> {
    if (USAGE_DEMO) {
      return {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+260123456789',
        dateOfBirth: '1990-01-15',
        address: '123 Main Street',
        city: 'Lusaka',
        country: 'Zambia',
        idNumber: 'ZM123456789',
        idType: 'National ID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await apiCall<unknown>('/users/profile');
    return extractDataObject<Types.UserProfile>(response);
  },

  async updateProfile(request: Types.UpdateProfileRequest): Promise<Types.UpdateProfileResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        user: {
          id: 'user-123',
          firstName: request.firstName || 'John',
          lastName: request.lastName || 'Doe',
          email: request.email || 'john@example.com',
          phone: request.phone || '+260123456789',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  async changePIN(oldPin: string, newPin: string): Promise<{ success: boolean; message: string }> {
    if (USAGE_DEMO) {
      return { success: true, message: 'PIN changed successfully' };
    }
    const verification = await userService.verifyPIN(oldPin);
    if (!verification?.verificationId) {
      throw new Error('PIN verification failed.');
    }
    await userService.setNewPIN(verification.verificationId, newPin, newPin);
    return { success: true, message: 'PIN changed successfully' };
  },

  async verifyPIN(currentPin: string): Promise<Types.VerifyPinResponse> {
    if (USAGE_DEMO) {
      // In demo mode, accept any 4-digit PIN
      if (currentPin.length === 4) {
        return {
          verificationId: 'demo-verify-' + Date.now(),
          expiresIn: 300,
        };
      }
      throw new Error('Invalid PIN');
    }
    return apiCall<Types.VerifyPinResponse>('/users/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ currentPin }),
    });
  },

  async setNewPIN(
    verificationId: string,
    newPin: string,
    confirmPin: string,
  ): Promise<Types.SetUserPinResponse> {
    if (USAGE_DEMO) {
      if (newPin === confirmPin && newPin.length === 4) {
        return { message: 'PIN set successfully' };
      }
      throw new Error('PINs do not match');
    }
    return apiCall<Types.SetUserPinResponse>('/users/set-pin', {
      method: 'POST',
      body: JSON.stringify({ verificationId, newPin, confirmPin }),
    });
  },
};

// ============ Loan Applications ============
export const loanService = {
  async checkEligibility(request: Types.PreEligibilityRequest): Promise<Types.PreEligibilityResponse> {
    if (USAGE_DEMO) {
      return {
        eligible: true,
        score: 85,
        message: 'You are eligible for a loan',
        maxLoanAmount: 50000,
        interestRate: 1.5,
      };
    }
    return apiCall('/loans/check-eligibility', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getLoanConfig(): Promise<Types.LoanConfigLoanType[]> {
    if (USAGE_DEMO) {
      return [
        {
          id: 1,
          name: 'Personal',
          description: null,
          categories: [
            {
              id: 1,
              name: 'Salary Advance',
              description: null,
              products: [
                {
                  id: 1,
                  name: 'Standard Personal Loan',
                  description: null,
                  terms: {
                    principal: { min: 5000, default: 10000, max: 50000 },
                    duration: { min: 6, default: 12, max: 60, period: 'month' },
                    repayments: { min: 1, default: 1, max: 60 },
                  },
                  rates: {
                    min: 1.5,
                    default: 1.5,
                    max: 1.5,
                    period: 'per-month',
                    methods: [
                      { id: 1, name: 'Flat Rate', description: 'Flat rate interest' },
                    ],
                    types: [
                      { id: 1, name: 'Percentage', description: 'Percentage based interest' },
                    ],
                  },
                  repaymentCycles: [{ id: 5, name: 'Monthly' }],
                  compliances: [],
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Business',
          description: null,
          categories: [
            {
              id: 2,
              name: 'SME Loan',
              description: null,
              products: [
                {
                  id: 2,
                  name: 'Standard Business Loan',
                  description: null,
                  terms: {
                    principal: { min: 5000, default: 15000, max: 75000 },
                    duration: { min: 6, default: 18, max: 60, period: 'month' },
                    repayments: { min: 1, default: 1, max: 60 },
                  },
                  rates: {
                    min: 1.8,
                    default: 1.8,
                    max: 1.8,
                    period: 'per-month',
                    methods: [
                      { id: 2, name: 'Reducing Balance', description: 'Reducing balance installments' },
                    ],
                    types: [
                      { id: 1, name: 'Percentage', description: 'Percentage based interest' },
                    ],
                  },
                  repaymentCycles: [{ id: 5, name: 'Monthly' }],
                  compliances: [],
                },
              ],
            },
          ],
        },
      ];
    }

    const response = await apiCall<unknown>('/loans/config');
    const config = extractDataArray<any>(response);
    return config
      .map(normalizeLoanConfigType)
      .filter((loanType) => loanType.id > 0 && loanType.categories.length > 0);
  },

  async applyForLoan(request: Types.LoanApplicationRequest): Promise<Types.LoanApplicationResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        applicationId: 'app-' + Date.now(),
        loanId: 'GL-2025-' + Math.floor(Math.random() * 1000),
        status: 'approved',
        message: 'Loan application approved',
        loanDetails: {
          id: 'loan-123',
          loanId: 'GL-2025-001',
          userId: 'user-123',
          loanType: request.loanType,
          loanCategory: request.loanCategory,
          loanAmount: request.loanAmount,
          principalAmount: request.loanAmount,
          interestRate: 1.5,
          serviceCharge: request.loanAmount * 0.05,
          totalRepayment: request.loanAmount * 1.05 + (request.loanAmount * 0.015 * request.repaymentMonths),
          repaymentMonths: request.repaymentMonths,
          monthlyPayment: (request.loanAmount * 1.05 + (request.loanAmount * 0.015 * request.repaymentMonths)) / request.repaymentMonths,
          status: 'active',
          approvalDate: new Date().toISOString(),
          firstPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          maturityDate: new Date(Date.now() + request.repaymentMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          amountPaid: 0,
          amountRemaining: request.loanAmount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    return apiCall('/loans/apply', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getLoanDetails(loanId: string): Promise<Types.LoanDetails> {
    if (USAGE_DEMO) {
      return {
        id: 'loan-123',
        loanId,
        userId: 'user-123',
        loanType: 'personal',
        loanCategory: 'Emergency',
        loanAmount: 10000,
        principalAmount: 10000,
        interestRate: 1.5,
        serviceCharge: 500,
        totalRepayment: 11050,
        repaymentMonths: 12,
        monthlyPayment: 916.67,
        status: 'active',
        approvalDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        firstPaymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        maturityDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        nextPaymentDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        amountPaid: 2750,
        amountRemaining: 8300,
        lastPaymentDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await apiCall<unknown>(`/loans/${loanId}`);
    const loan = extractDataObject<any>(response);
    return normalizeLoan(loan);
  },

  async getUserLoans(): Promise<Types.LoanDetails[]> {
    if (USAGE_DEMO) {
      return [
        {
          id: 'loan-123',
          loanId: 'GL-2025-001',
          userId: 'user-123',
          loanType: 'personal',
          loanCategory: 'Emergency',
          loanAmount: 10000,
          principalAmount: 10000,
          interestRate: 1.5,
          serviceCharge: 500,
          totalRepayment: 11050,
          repaymentMonths: 12,
          monthlyPayment: 916.67,
          status: 'active',
          approvalDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          firstPaymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          maturityDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
          nextPaymentDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          amountPaid: 2750,
          amountRemaining: 8300,
          lastPaymentDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'loan-124',
          loanId: 'GL-2024-002',
          userId: 'user-123',
          loanType: 'personal',
          loanCategory: 'Business',
          loanAmount: 25000,
          principalAmount: 25000,
          interestRate: 2.0,
          serviceCharge: 1250,
          totalRepayment: 27500,
          repaymentMonths: 24,
          monthlyPayment: 1145.83,
          status: 'completed',
          approvalDate: new Date(Date.now() - 720 * 24 * 60 * 60 * 1000).toISOString(),
          firstPaymentDate: new Date(Date.now() - 690 * 24 * 60 * 60 * 1000).toISOString(),
          maturityDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextPaymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          amountPaid: 27500,
          amountRemaining: 0,
          lastPaymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 720 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
    const response = await apiCall<unknown>('/loans');
    const loans = extractDataArray<any>(response);
    return loans.map(normalizeLoan);
  },

  async getRepaymentSchedule(loanId: string): Promise<Types.RepaymentSchedule[]> {
    if (USAGE_DEMO) {
      const schedules: Types.RepaymentSchedule[] = [];
      for (let i = 0; i < 12; i++) {
        schedules.push({
          id: `schedule-${i}`,
          loanId,
          dueDate: new Date(Date.now() + (i * 30 + 30) * 24 * 60 * 60 * 1000).toISOString(),
          amount: 916.67,
          principalAmount: 833.33,
          interestAmount: 83.34,
          status: i < 3 ? 'paid' : i === 3 ? 'pending' : 'pending',
          paidDate: i < 3 ? new Date(Date.now() - (3 - i) * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          paidAmount: i < 3 ? 916.67 : undefined,
        });
      }
      return schedules;
    }
    return apiCall(`/loans/${loanId}/repayment-schedule`);
  },
};

// ============ Payments ============
export const paymentService = {
  async submitPayment(request: Types.PaymentRequest): Promise<Types.PaymentResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        transactionId: 'txn-' + Date.now(),
        status: 'completed',
        message: 'Payment submitted successfully',
      };
    }
    return apiCall('/payments/submit', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getPaymentHistory(loanId: string): Promise<Types.PaymentHistory[]> {
    if (USAGE_DEMO) {
      return [
        {
          id: 'pay-1',
          transactionId: 'txn-001',
          loanId,
          amount: 916.67,
          paymentMethod: 'bank_transfer',
          status: 'completed',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          reference: 'GL-2025-001-001',
          description: 'Monthly Loan Payment',
        },
        {
          id: 'pay-2',
          transactionId: 'txn-002',
          loanId,
          amount: 916.67,
          paymentMethod: 'mobile_money',
          status: 'completed',
          date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          reference: 'GL-2025-001-002',
          description: 'Monthly Loan Payment',
        },
      ];
    }
    return apiCall(`/payments/history/${loanId}`);
  },

  async calculateEarlyRepayment(request: Types.EarlyRepaymentRequest): Promise<Types.EarlyRepaymentCalculation> {
    if (USAGE_DEMO) {
      return {
        loanId: request.loanId,
        earlyPaymentAmount: request.repaymentAmount,
        interestSaved: 500,
        newMaturityDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        totalPayment: 10550,
      };
    }
    return apiCall('/payments/early-repayment-calculation', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async submitEarlyRepayment(request: Types.EarlyRepaymentRequest): Promise<Types.EarlyRepaymentResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Early repayment submitted successfully',
        calculation: {
          loanId: request.loanId,
          earlyPaymentAmount: request.repaymentAmount,
          interestSaved: 500,
          newMaturityDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          totalPayment: 10550,
        },
      };
    }
    return apiCall('/payments/early-repayment', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

// ============ Loan Restructuring ============
export const restructuringService = {
  async requestRestructuring(request: Types.LoanRestructuringRequest): Promise<Types.LoanRestructuringResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        requestId: 'req-' + Date.now(),
        status: 'pending',
        message: 'Restructuring request submitted',
        newDetails: {
          id: 'loan-123',
          loanId: request.loanId,
          userId: 'user-123',
          loanType: 'personal',
          loanCategory: 'Emergency',
          loanAmount: 10000,
          principalAmount: 10000,
          interestRate: 1.5,
          serviceCharge: 500,
          totalRepayment: 11050,
          repaymentMonths: request.newRepaymentMonths,
          monthlyPayment: 11050 / request.newRepaymentMonths,
          status: 'active',
          approvalDate: new Date().toISOString(),
          firstPaymentDate: new Date().toISOString(),
          maturityDate: new Date(Date.now() + request.newRepaymentMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          amountPaid: 2750,
          amountRemaining: 8300,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    return apiCall('/loans/restructuring', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

// ============ KYC / Documents ============
export const kycService = {
  async uploadDocument(request: Types.DocumentUploadRequest): Promise<Types.DocumentUploadResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        documentId: 'doc-' + Date.now(),
        url: '/documents/doc-' + Date.now(),
        status: 'verified',
        message: 'Document uploaded successfully',
      };
    }

    const formData = new FormData();
    formData.append('userId', request.userId);
    formData.append('documentType', request.documentType);
    formData.append('file', request.file);

    return apiCallFormData('/kyc/upload', formData);
  },

  async getKYCStatus(): Promise<Types.KYCStatus> {
    if (USAGE_DEMO) {
      return {
        userId: 'user-123',
        status: 'completed',
        documents: [
          {
            id: 'doc-1',
            type: 'id',
            status: 'verified',
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 'doc-2',
            type: 'proof_of_income',
            status: 'verified',
            uploadedAt: new Date().toISOString(),
          },
        ],
        verificationDate: new Date().toISOString(),
      };
    }
    return apiCall('/kyc/status');
  },
};

// ============ Notifications ============
export const notificationService = {
  async getNotificationSettings(): Promise<Types.NotificationSettings> {
    if (USAGE_DEMO) {
      return {
        userId: 'user-123',
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        paymentReminders: true,
        applicationUpdates: true,
        promotions: false,
        notificationFrequency: 'monthly',
        frequencyOptions: ['daily', 'weekly', 'monthly'],
      };
    }
    const response = await apiCall<unknown>('/notifications/settings');
    return extractDataObject<Types.NotificationSettings>(response);
  },

  async updateNotificationSettings(request: Types.UpdateNotificationSettingsRequest): Promise<Types.NotificationSettings> {
    if (USAGE_DEMO) {
      return {
        userId: 'user-123',
        emailNotifications: request.emailNotifications ?? true,
        smsNotifications: request.smsNotifications ?? true,
        pushNotifications: request.pushNotifications ?? false,
        paymentReminders: request.paymentReminders ?? true,
        applicationUpdates: request.applicationUpdates ?? true,
        promotions: request.promotions ?? false,
        notificationFrequency: request.notificationFrequency ?? 'monthly',
      };
    }
    const response = await apiCall<unknown>('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    return extractDataObject<Types.NotificationSettings>(response);
  },
};

// ============ Security ============
export const securityService = {
  async getSecuritySettings(): Promise<Types.SecuritySettings> {
    if (USAGE_DEMO) {
      return {
        userId: 'user-123',
        twoFactorEnabled: false,
        biometricEnabled: false,
        lastLoginDate: new Date().toISOString(),
        loginAttempts: 0,
        accountLocked: false,
      };
    }
    const response = await apiCall<unknown>('/security/settings');
    return extractDataObject<Types.SecuritySettings>(response);
  },

  async enableTwoFactor(request: Types.EnableTwoFactorRequest): Promise<Types.EnableTwoFactorResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Two-factor authentication enabled',
        secret: 'DEMO_SECRET_KEY',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
    }
    return apiCall('/security/enable-2fa', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async disableTwoFactor(): Promise<Types.DisableTwoFactorResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Two-factor authentication disabled',
      };
    }
    return apiCall('/security/disable-2fa', {
      method: 'POST',
    });
  },

  async getActiveSessions(): Promise<Types.ActiveSession[]> {
    if (USAGE_DEMO) {
      return [
        {
          id: 'session-1',
          device: 'iPhone 12',
          browser: 'Safari',
          location: 'Lusaka, Zambia',
          ipAddress: '196.1.xxx.xxx',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
        {
          id: 'session-2',
          device: 'Chrome on Windows',
          browser: 'Chrome',
          location: 'Lusaka, Zambia',
          ipAddress: '196.1.xxx.xxx',
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isCurrent: false,
        },
      ];
    }
    const response = await apiCall<unknown>('/security/sessions');
    return extractDataArray<Types.ActiveSession>(response);
  },

  async signOutSession(sessionId: string): Promise<Types.SignOutSessionResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Session terminated successfully',
      };
    }
    return apiCall(`/security/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  async signOutAllDevices(): Promise<Types.SignOutAllDevicesResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'All other sessions terminated',
        sessionsTerminated: 1,
      };
    }
    return apiCall('/security/sessions/all', {
      method: 'DELETE',
    });
  },
};

// ============ Support / Contact ============
export const supportService = {
  async submitContactRequest(request: Types.ContactSupportRequest): Promise<Types.ContactSupportResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        ticketId: 'TICKET-' + Date.now(),
        message: 'Your message has been received. We will get back to you shortly.',
      };
    }
    return apiCall('/support/contact', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getTickets(): Promise<Types.SupportTicket[]> {
    if (USAGE_DEMO) {
      return [
        {
          id: 'TICKET-123',
          subject: 'Payment issue',
          message: 'I had trouble making a payment...',
          status: 'resolved',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
    const response = await apiCall<unknown>('/support/tickets');
    return extractDataArray<Types.SupportTicket>(response);
  },
};
