// hooks/useLoans.ts
import { useCallback } from 'react';
import { useLoans } from '@/contexts/LoanContext';
import { useApiCall } from './useApiCall';
import LoanService from '@/services/LoanService';
import { Loan, LoanApplicationData } from '@/types';

export function useLoanOperations() {
  const { fetchLoans: contextFetchLoans, createLoan: contextCreateLoan, updateLoan: contextUpdateLoan, deleteLoan: contextDeleteLoan } = useLoans();
  const fetchCall = useApiCall<Loan[]>();
  const createCall = useApiCall<Loan>();
  const updateCall = useApiCall<Loan>();
  const deleteCall = useApiCall<void>();
  const repaymentCall = useApiCall<any>();

  const fetchLoans = useCallback(() => {
    return fetchCall.execute(async () => {
      return await contextFetchLoans();
    });
  }, [contextFetchLoans, fetchCall.execute]);

  const createLoan = useCallback((loanData: LoanApplicationData) => {
    return createCall.execute(async () => {
      return await contextCreateLoan(loanData);
    });
  }, [contextCreateLoan, createCall.execute]);

  const updateLoan = useCallback((id: string | number, loanData: Partial<Loan>) => {
    return updateCall.execute(async () => {
      return await contextUpdateLoan(id, loanData);
    });
  }, [contextUpdateLoan, updateCall.execute]);

  const deleteLoan = useCallback((id: string | number) => {
    return deleteCall.execute(async () => {
      await contextDeleteLoan(id);
    });
  }, [contextDeleteLoan, deleteCall.execute]);

  const processRepayment = useCallback((loanId: string | number, amount: number) => {
    return repaymentCall.execute(async () => {
      const result = await LoanService.submitRepayment(loanId, { amount });
      await contextFetchLoans();
      return result;
    });
  }, [repaymentCall.execute, contextFetchLoans]);

  return {
    fetchLoans,
    createLoan,
    updateLoan,
    deleteLoan,
    processRepayment,
    loading: fetchCall.loading || createCall.loading || updateCall.loading || deleteCall.loading || repaymentCall.loading,
    error: fetchCall.error || createCall.error || updateCall.error || deleteCall.error || repaymentCall.error,
    fetchState: fetchCall,
    createState: createCall,
    updateState: updateCall,
    deleteState: deleteCall,
    repaymentState: repaymentCall
  };
}
