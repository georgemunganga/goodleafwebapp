// hooks/useDashboard.ts
import { useCallback } from 'react';
import { useApiCall } from './useApiCall';
import BusinessOrchestrator from '@/services/BusinessOrchestrator';

export function useDashboard() {
  const getSummaryCall = useApiCall<any>();
  const applyCall = useApiCall<any>();
  const repaymentCall = useApiCall<any>();

  const getDashboardSummary = useCallback((userId: number) => {
    return getSummaryCall.execute(async () => {
      return await BusinessOrchestrator.getUserDashboardSummary(userId);
    });
  }, [getSummaryCall.execute]);

  const applyForLoan = useCallback((
    userId: number,
    loanData: any,
    eligibilityData: any
  ) => {
    return applyCall.execute(async () => {
      return await BusinessOrchestrator.applyForLoan(userId, loanData, eligibilityData);
    });
  }, [applyCall.execute]);

  const processRepayment = useCallback((loanId: string, amount: number) => {
    return repaymentCall.execute(async () => {
      return await BusinessOrchestrator.processRepayment(loanId, amount);
    });
  }, [repaymentCall.execute]);

  return {
    getDashboardSummary,
    applyForLoan,
    processRepayment,
    loading: getSummaryCall.loading || applyCall.loading || repaymentCall.loading,
    error: getSummaryCall.error || applyCall.error || repaymentCall.error,
    summaryState: getSummaryCall,
    applyState: applyCall,
    repaymentState: repaymentCall
  };
}
