/**
 * Repository Pattern Implementation
 * 
 * Repositories abstract API access and provide a clean interface
 * Simplified version that wraps API services
 */

import { authService, loanService, kycService, paymentService } from '../api-service';

/**
 * User Repository
 */
export class UserRepository {
  async login(request: { phone?: string; email?: string; pin: string }) {
    return await authService.login(request);
  }

  async register(request: any) {
    return await authService.register(request);
  }

  async logout() {
    return authService.logout();
  }
}

/**
 * Loan Repository
 */
export class LoanRepository {
  async getUserLoans() {
    return await loanService.getUserLoans();
  }

  async getLoanDetails(loanId: string) {
    return await loanService.getLoanDetails(loanId);
  }

  async applyForLoan(data: any) {
    return await loanService.applyForLoan(data);
  }

  async checkEligibility(request: any) {
    return await loanService.checkEligibility(request);
  }
}

/**
 * Payment Repository
 */
export class PaymentRepository {
  async getPaymentHistory(loanId: string) {
    return await paymentService.getPaymentHistory(loanId);
  }

  async submitPayment(request: any) {
    return await paymentService.submitPayment(request);
  }

  async calculateEarlyRepayment(request: any) {
    return await paymentService.calculateEarlyRepayment(request);
  }

  async submitEarlyRepayment(request: any) {
    return await paymentService.submitEarlyRepayment(request);
  }
}

/**
 * KYC Repository
 */
export class KycRepository {
  async getKYCStatus() {
    return await kycService.getKYCStatus();
  }

  async uploadDocument(request: any) {
    return await kycService.uploadDocument(request);
  }
}

/**
 * Global repository instances
 */
export const userRepository = new UserRepository();
export const loanRepository = new LoanRepository();
export const paymentRepository = new PaymentRepository();
export const kycRepository = new KycRepository();
