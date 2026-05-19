import { useMemo } from "react";
import { useUserLoans } from "./useLoanQueries";
import type { LoanDetails } from "@/lib/api-types";

/**
 * Loan statuses that block new applications.
 * The LMS enforces this too; this hook only prevents a bad user journey before submit.
 */
const BLOCKED_STATUSES: LoanDetails["status"][] = [
  "submitted",
  "pending",
  "under_review",
  "approved_not_disbursed",
  "active",
  "rescheduled",
  "defaulted",
];

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
    // Find any loan that is still in process or already open.
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
