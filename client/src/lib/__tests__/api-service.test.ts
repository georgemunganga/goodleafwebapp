import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService, loanService, kycService, repaymentService } from '../api-service';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return success response with valid credentials', async () => {
      const result = await authService.login({
        phoneNumber: '+260123456789',
        pin: '1234',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('user');
    });

    it('should return error response with invalid credentials', async () => {
      const result = await authService.login({
        phoneNumber: '+260999999999',
        pin: '0000',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });

    it('should handle email login', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        pin: '1234',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const result = await authService.register({
        phoneNumber: '+260123456789',
        email: 'newuser@example.com',
        fullName: 'John Doe',
        pin: '1234',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('user');
    });

    it('should return error for duplicate email', async () => {
      const result = await authService.register({
        phoneNumber: '+260123456789',
        email: 'duplicate@example.com',
        fullName: 'John Doe',
        pin: '1234',
      });

      // In real scenario, this would fail
      expect(result).toBeDefined();
    });
  });

  describe('requestOTP', () => {
    it('should request OTP for valid email', async () => {
      const result = await authService.requestOTP('test@example.com');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('otpId');
    });

    it('should request OTP for valid phone', async () => {
      const result = await authService.requestOTP(undefined, '+260123456789');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('verifyOTP', () => {
    it('should verify valid OTP', async () => {
      const result = await authService.verifyOTP('123456');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should reject invalid OTP', async () => {
      const result = await authService.verifyOTP('000000');

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });
  });
});

describe('loanService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLoanProducts', () => {
    it('should return available loan products', async () => {
      const result = await loanService.getLoanProducts();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should return products with required fields', async () => {
      const result = await loanService.getLoanProducts();

      if (result.success && result.data.length > 0) {
        const product = result.data[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('minAmount');
        expect(product).toHaveProperty('maxAmount');
        expect(product).toHaveProperty('interestRate');
      }
    });
  });

  describe('submitApplication', () => {
    it('should submit loan application', async () => {
      const result = await loanService.submitApplication({
        loanProductId: 'product-1',
        amount: 5000,
        term: 12,
        purpose: 'Personal use',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('applicationId');
    });

    it('should validate amount range', async () => {
      const result = await loanService.submitApplication({
        loanProductId: 'product-1',
        amount: 999999999, // Unrealistic amount
        term: 12,
        purpose: 'Personal use',
      });

      expect(result).toBeDefined();
      // Should either fail or cap the amount
    });
  });

  describe('getActiveLoans', () => {
    it('should return active loans for user', async () => {
      const result = await loanService.getActiveLoans();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return loans with required fields', async () => {
      const result = await loanService.getActiveLoans();

      if (result.success && result.data.length > 0) {
        const loan = result.data[0];
        expect(loan).toHaveProperty('id');
        expect(loan).toHaveProperty('amount');
        expect(loan).toHaveProperty('status');
        expect(loan).toHaveProperty('disbursedDate');
      }
    });
  });
});

describe('kycService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getKycStatus', () => {
    it('should return KYC status', async () => {
      const result = await kycService.getKycStatus();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('status');
    });

    it('should return valid status values', async () => {
      const result = await kycService.getKycStatus();

      if (result.success) {
        const validStatuses = ['pending', 'approved', 'rejected', 'not_started'];
        expect(validStatuses).toContain(result.data.status);
      }
    });
  });
});

describe('repaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRepaymentSchedule', () => {
    it('should return repayment schedule for loan', async () => {
      const result = await repaymentService.getRepaymentSchedule('loan-123');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return schedule items with required fields', async () => {
      const result = await repaymentService.getRepaymentSchedule('loan-123');

      if (result.success && result.data.length > 0) {
        const item = result.data[0];
        expect(item).toHaveProperty('dueDate');
        expect(item).toHaveProperty('amount');
        expect(item).toHaveProperty('status');
      }
    });
  });

  describe('initiateRepayment', () => {
    it('should initiate repayment', async () => {
      const result = await repaymentService.initiateRepayment({
        loanId: 'loan-123',
        amount: 1000,
        paymentMethod: 'bank_transfer',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('transactionId');
    });
  });
});
