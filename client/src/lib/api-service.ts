/**
 * API Service Layer
 * Handles all HTTP requests to backend APIs
 * Supports both real API and mock data based on USAGE_DEMO flag
 */

import * as Types from './api-types';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USAGE_DEMO = import.meta.env.VITE_USAGE_DEMO === 'true';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      code: error.code || 'API_ERROR',
      message: error.message || 'An error occurred',
      status: response.status,
      details: error.details,
    } as Types.ApiError;
  }

  return response.json();
}

// ============ Authentication ============
export const authService = {
  async login(request: Types.LoginRequest): Promise<Types.LoginResponse> {
    if (USAGE_DEMO) {
      return {
        success: true,
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: request.email || 'john@example.com',
          phone: request.phone || '+260123456789',
        },
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token',
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

  async register(request: any): Promise<any> {
    if (USAGE_DEMO) {
      return {
        success: true,
        message: 'Registration successful',
        user: {
          id: 'user-' + Date.now(),
          name: request.fullName,
          email: request.email,
          phone: request.phoneNumber,
        },
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token',
      };
    }
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
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
      return {
        success: true,
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+260123456789',
        },
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token',
      };
    }
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
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
    return apiCall('/users/profile');
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
    return apiCall('/users/change-pin', {
      method: 'POST',
      body: JSON.stringify({ oldPin, newPin }),
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
    return apiCall(`/loans/${loanId}`);
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
    return apiCall('/loans');
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
    formData.append('documentType', request.documentType);
    formData.append('file', request.file);

    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/kyc/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Document upload failed');
    }

    return response.json();
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
        reminderFrequency: 'weekly',
      };
    }
    return apiCall('/notifications/settings');
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
        reminderFrequency: request.reminderFrequency ?? 'weekly',
      };
    }
    return apiCall('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
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
    return apiCall('/security/settings');
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
};
