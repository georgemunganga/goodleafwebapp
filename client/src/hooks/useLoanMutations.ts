import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import * as Types from '@/lib/api-types';
import { apiCall } from '@/lib/api-config';

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
      return apiCall('/loans/apply', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(applicationData),
      });
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

      return apiCall('/payments/submit', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          loanId: repaymentData.loanId,
          amount: repaymentData.amount,
          paymentMethod: repaymentData.method as Types.PaymentRequest['paymentMethod'],
        }),
      });
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
      return apiCall(`/loans/${data.loanId}`, {
        method: 'PATCH',
        body: JSON.stringify(data.updates),
      });
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
