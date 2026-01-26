import { useMemo } from "react";
import { useUserLoans } from "./useLoanQueries";
import type { LoanDetails } from "@/lib/api-types";

/**
 * Loan statuses that block new applications
 * Users with loans in these statuses should not see "Apply for Loan" options
 */
const BLOCKED_STATUSES: LoanDetails["status"][] = ["submitted", "pending"];

/**
 * Hook to determine if a user can apply for a new loan
 * Used across the app to gate loan application UI
 *
 * @returns {Object} Gating information
 * @returns {boolean} canApply - Whether user can apply for a new loan
 * @returns {boolean} hasInProgressLoan - Whether user has a submitted/pending loan
 * @returns {LoanDetails | null} inProgressLoan - The in-progress loan details (if any)
 * @returns {boolean} isLoading - Whether loan data is still loading
 */
export function useLoanApplicationGate() {
  const { data: loans = [], isLoading } = useUserLoans();

  const gateInfo = useMemo(() => {
    // Find any loan that is in a blocked status (submitted or pending)
    const inProgressLoan = loans.find((loan) =>
      BLOCKED_STATUSES.includes(loan.status)
    ) || null;

    return {
      canApply: !inProgressLoan,
      hasInProgressLoan: Boolean(inProgressLoan),
      inProgressLoan,
    };
  }, [loans]);

  return {
    ...gateInfo,
    isLoading,
  };
}

export default useLoanApplicationGate;
