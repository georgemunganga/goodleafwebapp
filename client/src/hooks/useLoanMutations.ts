import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loanService } from '@/lib/api-service';
import { queryKeys } from './query-keys';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Loan Mutation Hooks
 * Write operations for loans with proper error handling and cache invalidation
 */

// Submit a new loan application
export function useSubmitLoanApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: any) => {
      // Generate idempotency key to prevent duplicate submissions
      const idempotencyKey = uuidv4();
      
      // Add to request headers
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.history() });
      
      toast.success('Loan application submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit loan application');
    },
  });
}

// Initiate loan repayment
export function useInitiateRepayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repaymentData: { loanId: string; amount: number; method: string }) => {
      // Generate idempotency key for payment safety
      const idempotencyKey = uuidv4();

      const response = await fetch('/api/repayment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(repaymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate repayment');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate loan details and repayment schedule
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.loans.detail(variables.loanId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.repayment.schedule(variables.loanId) 
      });
      
      toast.success('Repayment initiated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to initiate repayment');
    },
  });
}

// Update loan (e.g., restructuring)
export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { loanId: string; updates: any }) => {
      const response = await fetch(`/api/loans/${data.loanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update loan');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.loans.detail(variables.loanId) 
      });
      toast.success('Loan updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update loan');
    },
  });
}
