// services/LoanService.ts
import { loanAPI, repaymentAPI } from '@/lib/api';
import { Loan, LoanApplicationData, LoanScheduleItem } from '@/types';

class LoanService {
  async getAllLoans(): Promise<Loan[]> {
    try {
      const response = await loanAPI.getLoans();
      return response.data;
    } catch (error) {
      console.error('Get loans error:', error);
      throw error;
    }
  }

  async getLoanById(id: string): Promise<Loan> {
    try {
      const response = await loanAPI.getLoanById(id);
      return response.data;
    } catch (error) {
      console.error(`Get loan ${id} error:`, error);
      throw error;
    }
  }

  async getLoanSchedule(id: string): Promise<LoanScheduleItem[]> {
    try {
      const response = await loanAPI.getLoanSchedule(id);
      return response.data;
    } catch (error) {
      console.error(`Get loan ${id} schedule error:`, error);
      throw error;
    }
  }

  async createLoan(loanData: LoanApplicationData): Promise<Loan> {
    try {
      const response = await loanAPI.createLoan(loanData);
      return response.data;
    } catch (error) {
      console.error('Create loan error:', error);
      throw error;
    }
  }

  async updateLoan(id: string, loanData: Partial<Loan>): Promise<Loan> {
    try {
      const response = await loanAPI.updateLoan(id, loanData);
      return response.data;
    } catch (error) {
      console.error(`Update loan ${id} error:`, error);
      throw error;
    }
  }

  async deleteLoan(id: string): Promise<void> {
    try {
      await loanAPI.deleteLoan(id);
    } catch (error) {
      console.error(`Delete loan ${id} error:`, error);
      throw error;
    }
  }

  async submitRepayment(loanId: string | number, repaymentData: { amount: number }): Promise<any> {
    try {
      const normalizedLoanId = typeof loanId === "number" || Number.isNaN(Number(loanId))
        ? loanId
        : Number(loanId);
      const response = await repaymentAPI.submitRepayment(normalizedLoanId, repaymentData);
      return response.data;
    } catch (error) {
      console.error(`Submit repayment for loan ${loanId} error:`, error);
      throw error;
    }
  }

  // Business logic methods
  calculateEMI(principal: number, annualInterestRate: number, months: number): number {
    const monthlyRate = annualInterestRate / 100 / 12;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
               (Math.pow(1 + monthlyRate, months) - 1);
    return parseFloat(emi.toFixed(2));
  }

  calculateTotalInterest(principal: number, annualInterestRate: number, months: number): number {
    const emi = this.calculateEMI(principal, annualInterestRate, months);
    const totalPayment = emi * months;
    return parseFloat((totalPayment - principal).toFixed(2));
  }

  getRemainingBalance(loan: Loan): number {
    if (loan.status === 'repaid') return 0;
    return loan.outstanding || 0;
  }

  isLoanOverdue(loan: Loan): boolean {
    if (!loan.nextPayment || loan.status !== 'active') return false;
    return new Date(loan.nextPayment) < new Date();
  }
}

export default new LoanService();
