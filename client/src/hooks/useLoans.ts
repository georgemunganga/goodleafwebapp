/**
 * useLoans Hook
 * Handles all loan-related operations
 */

import { useCallback, useState } from 'react';
import * as Types from '@/lib/api-types';
import { loanService, paymentService, restructuringService } from '@/lib/api-service';
import { auditLogger, AuditEventType } from '@/lib/audit-logger';

export function useLoans() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyForLoan = useCallback(
    async (request: Types.LoanApplicationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await loanService.applyForLoan(request);
        auditLogger.log(AuditEventType.LOAN_APPLICATION_SUBMITTED, 'Loan application submitted', { loanAmount: request.loanAmount }, 'info');
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to apply for loan';
        setError(errorMessage);
        auditLogger.logError(err as Error, { action: 'applyForLoan' });
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getLoanDetails = useCallback(
    async (loanId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await loanService.getLoanDetails(loanId);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch loan details';
        setError(errorMessage);
        auditLogger.logError(err as Error, { action: 'getLoanDetails', loanId });
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getUserLoans = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await loanService.getUserLoans();
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch loans';
        setError(errorMessage);
        auditLogger.logError(err as Error, { action: 'getUserLoans' });
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkEligibility = useCallback(
    async (request: Types.PreEligibilityRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await loanService.checkEligibility(request);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to check eligibility';
        setError(errorMessage);
        auditLogger.logError(err as Error, { action: 'checkEligibility' });
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const requestRestructuring = useCallback(
    async (request: Types.LoanRestructuringRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await restructuringService.requestRestructuring(request);
        auditLogger.log(AuditEventType.LOAN_RESTRUCTURING_REQUESTED, 'Restructuring request submitted', {}, 'info');
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to request restructuring';
        setError(errorMessage);
        auditLogger.logError(err as Error, { action: 'requestRestructuring' });
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getRepaymentSchedule = useCallback(
    async (loanId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await loanService.getRepaymentSchedule(loanId);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repayment schedule';
        setError(errorMessage);
        auditLogger.logError(err as Error, { action: 'getRepaymentSchedule' });
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    applyForLoan,
    getLoanDetails,
    getUserLoans,
    checkEligibility,
    requestRestructuring,
    getRepaymentSchedule,
  };
}
