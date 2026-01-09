// services/BusinessOrchestrator.ts
import UserService from './UserService';
import LoanService from './LoanService';
import EligibilityService from './EligibilityService';
import { EligibilityRequest, LoanApplicationData } from '@/types';

class BusinessOrchestrator {
  userService = UserService;
  loanService = LoanService;
  eligibilityService = EligibilityService;

  /**
   * Complete loan application process
   * Orchestrates eligibility check, loan creation, and user updates
   */
  async applyForLoan(
    userId: number,
    loanData: LoanApplicationData,
    eligibilityData: EligibilityRequest
  ): Promise<{ loan: any; eligibilityResult: any }> {
    // Step 1: Check eligibility
    const eligibilityResult = await this.eligibilityService.checkEligibility(eligibilityData);
    
    if (!eligibilityResult.eligible) {
      throw new Error('Applicant is not eligible for a loan based on provided information');
    }

    // Step 2: Validate loan amount against eligibility
    if (loanData.amount > eligibilityResult.maxAmount) {
      throw new Error(`Requested loan amount exceeds maximum eligible amount of ${eligibilityResult.maxAmount}`);
    }

    // Step 3: Create the loan application
    const loan = await this.loanService.createLoan(loanData);

    return { loan, eligibilityResult };
  }

  /**
   * Complete user onboarding process
   * Orchestrates user registration, profile setup, and initial eligibility check
   */
  async onboardUser(userData: { email: string; password: string; name: string }, eligibilityData: EligibilityRequest) {
    // Step 1: Register user
    const userResult = await this.userService.register(userData);

    // Step 2: Check initial eligibility
    const eligibilityResult = await this.eligibilityService.checkEligibility(eligibilityData);

    return { user: userResult.user, eligibilityResult };
  }

  /**
   * Process loan repayment
   * Updates loan status, calculates new balances, and manages repayment records
   */
  async processRepayment(loanId: string, amount: number) {
    // Get the current loan details
    const loan = await this.loanService.getLoanById(loanId);

    // Submit the repayment
    const repaymentResult = await this.loanService.submitRepayment(loanId, { amount });

    // Update loan status if fully repaid
    if (loan.outstanding && loan.outstanding - amount <= 0) {
      // Loan is fully repaid
      const updatedLoan = await this.loanService.updateLoan(loanId, {
        status: 'repaid',
        outstanding: 0,
        progress: 100
      });
      
      return { repayment: repaymentResult, loan: updatedLoan };
    } else {
      // Update outstanding balance
      const updatedOutstanding = loan.outstanding ? loan.outstanding - amount : 0;
      const updatedProgress = loan.amount ? ((loan.amount - updatedOutstanding) / loan.amount) * 100 : 0;
      
      const updatedLoan = await this.loanService.updateLoan(loanId, {
        outstanding: updatedOutstanding,
        progress: Math.round(updatedProgress)
      });
      
      return { repayment: repaymentResult, loan: updatedLoan };
    }
  }

  /**
   * Calculate loan terms based on user profile and eligibility
   */
  calculateLoanTerms(eligibilityData: EligibilityRequest, requestedAmount: number, tenureMonths: number) {
    // Validate eligibility
    const validation = this.eligibilityService.validateEligibilityInputs(eligibilityData);
    if (!validation.isValid) {
      throw new Error(`Invalid eligibility data: ${validation.errors.join(', ')}`);
    }

    // Determine interest rate based on credit score
    let interestRate = 8.5; // Base rate
    if (eligibilityData.creditScore >= 750) interestRate = 6.5;
    else if (eligibilityData.creditScore >= 650) interestRate = 7.5;
    else if (eligibilityData.creditScore >= 550) interestRate = 9.5;
    else interestRate = 12.0;

    // Calculate EMI and total interest
    const emi = this.loanService.calculateEMI(requestedAmount, interestRate, tenureMonths);
    const totalInterest = this.loanService.calculateTotalInterest(requestedAmount, interestRate, tenureMonths);

    return {
      interestRate,
      emi,
      totalInterest,
      totalPayment: requestedAmount + totalInterest,
      tenureMonths
    };
  }

  /**
   * Generate user dashboard summary
   */
  async getUserDashboardSummary(userId: number) {
    // Get user profile
    const user = await this.userService.getCurrentUser();

    // Get all user loans
    const loans = await this.loanService.getAllLoans();
    const activeLoans = loans.filter(loan => loan.status === 'active' || loan.status === 'approved');
    const totalOutstanding = activeLoans.reduce((sum, loan) => sum + (loan.outstanding || 0), 0);

    // Calculate next payment due
    let nextPaymentDue = null;
    let nearestDueDate = null;
    
    for (const loan of activeLoans) {
      if (loan.nextPayment) {
        const loanDate = new Date(loan.nextPayment);
        if (!nearestDueDate || loanDate < nearestDueDate) {
          nearestDueDate = loanDate;
          nextPaymentDue = {
            loanId: loan.id,
            amount: loan.amountDue || 0,
            dueDate: loan.nextPayment
          };
        }
      }
    }

    return {
      user,
      totalOutstanding,
      activeLoansCount: activeLoans.length,
      nextPaymentDue,
      totalLoans: loans.length
    };
  }
}

export default new BusinessOrchestrator();