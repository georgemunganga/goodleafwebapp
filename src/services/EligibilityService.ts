// services/EligibilityService.ts
import { eligibilityAPI } from '@/lib/api';
import LoanService from './LoanService';
import { EligibilityRequest, EligibilityResponse, LoanTerms } from '@/types';

class EligibilityService {
  async checkEligibility(data: EligibilityRequest): Promise<EligibilityResponse> {
    try {
      const response = await eligibilityAPI.checkEligibility(data);
      return response.data;
    } catch (error) {
      console.error('Eligibility check error:', error);
      throw error;
    }
  }

  // Business logic methods
  calculateDebtToIncomeRatio(income: number, expenses: number, existingDebt: number = 0): number {
    const totalMonthlyObligations = expenses + existingDebt;
    return income > 0 ? (totalMonthlyObligations / income) * 100 : Infinity;
  }

  calculateCreditScoreRating(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 750) return 'excellent';
    if (score >= 650) return 'good';
    if (score >= 550) return 'fair';
    return 'poor';
  }

  determineMaxLoanAmount(income: number, creditScore: number): number {
    // Base amount based on income
    const baseAmount = income * 12; // Up to 1 year of income

    // Adjust based on credit score
    let multiplier = 1;
    if (creditScore >= 750) multiplier = 1.5; // Excellent credit
    else if (creditScore >= 650) multiplier = 1.2; // Good credit
    else if (creditScore >= 550) multiplier = 0.8; // Fair credit
    else multiplier = 0.5; // Poor credit

    // Cap at 50,000
    return Math.min(baseAmount * multiplier, 50000);
  }

  async calculateLoanTerms(
    eligibilityData: EligibilityRequest,
    requestedAmount: number,
    tenureMonths: number
  ): Promise<LoanTerms> {
    const validation = this.validateEligibilityInputs(eligibilityData);
    if (!validation.isValid) {
      throw new Error(`Invalid eligibility data: ${validation.errors.join(", ")}`);
    }

    try {
      const response = await eligibilityAPI.calculateTerms({
        eligibilityData,
        requestedAmount,
        tenureMonths
      });
      return response.data;
    } catch (error) {
      console.error("Loan terms calculation error:", error);

      let interestRate = 8.5;
      if (eligibilityData.creditScore >= 750) interestRate = 6.5;
      else if (eligibilityData.creditScore >= 650) interestRate = 7.5;
      else if (eligibilityData.creditScore >= 550) interestRate = 9.5;
      else interestRate = 12.0;

      const emi = LoanService.calculateEMI(requestedAmount, interestRate, tenureMonths);
      const totalInterest = LoanService.calculateTotalInterest(requestedAmount, interestRate, tenureMonths);

      return {
        interestRate,
        emi,
        totalInterest,
        totalPayment: requestedAmount + totalInterest,
        tenureMonths
      };
    }
  }

  validateEligibilityInputs(data: EligibilityRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.income <= 0) {
      errors.push('Income must be greater than zero');
    }

    if (data.expenses < 0) {
      errors.push('Expenses cannot be negative');
    }

    if (data.creditScore < 300 || data.creditScore > 850) {
      errors.push('Credit score must be between 300 and 850');
    }

    if (data.existingDebt && data.existingDebt < 0) {
      errors.push('Existing debt cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new EligibilityService();
