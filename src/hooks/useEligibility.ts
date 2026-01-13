// hooks/useEligibility.ts
import { useCallback } from 'react';
import { useApiCall } from './useApiCall';
import EligibilityService from '@/services/EligibilityService';
import { EligibilityRequest, EligibilityResponse, LoanTerms } from '@/types';

export function useEligibility() {
  const checkEligibilityCall = useApiCall<EligibilityResponse>();
  const calculateTermsCall = useApiCall<LoanTerms>();

  const checkEligibility = useCallback(
    async (data: EligibilityRequest) => {
      return checkEligibilityCall.execute(async () => {
        return await EligibilityService.checkEligibility(data);
      });
    },
    [checkEligibilityCall.execute]
  );

  const calculateLoanTerms = useCallback(
    async (eligibilityData: EligibilityRequest, requestedAmount: number, tenureMonths: number) => {
      return calculateTermsCall.execute(async () => {
        return EligibilityService.calculateLoanTerms(eligibilityData, requestedAmount, tenureMonths);
      });
    },
    [calculateTermsCall.execute]
  );

  const validateEligibilityInputs = useCallback((data: EligibilityRequest) => {
    return EligibilityService.validateEligibilityInputs(data);
  }, []);

  const calculateDebtToIncomeRatio = useCallback((income: number, expenses: number, existingDebt: number = 0) => {
    return EligibilityService.calculateDebtToIncomeRatio(income, expenses, existingDebt);
  }, []);

  const calculateCreditScoreRating = useCallback((score: number) => {
    return EligibilityService.calculateCreditScoreRating(score);
  }, []);

  return {
    checkEligibility,
    calculateLoanTerms,
    validateEligibilityInputs,
    calculateDebtToIncomeRatio,
    calculateCreditScoreRating,
    ...checkEligibilityCall,
    ...calculateTermsCall
  };
}
