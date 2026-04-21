import type { LoanDetails } from "@/lib/api-types";

type PaymentCacheUpdate = {
  loanId: string;
  amount: number;
  paidAt?: string;
};

export function applyPaymentToLoanRecords(
  loans: LoanDetails[],
  update: PaymentCacheUpdate,
): LoanDetails[] {
  const paidAt = update.paidAt ?? new Date().toISOString();

  return loans.map((loan) => {
    const matchesLoan = loan.loanId === update.loanId || loan.id === update.loanId;
    if (!matchesLoan) {
      return loan;
    }

    const nextAmountPaid = Math.min(loan.amountPaid + update.amount, loan.totalRepayment);
    const nextAmountRemaining = Math.max(loan.amountRemaining - update.amount, 0);

    return {
      ...loan,
      amountPaid: nextAmountPaid,
      amountRemaining: nextAmountRemaining,
      lastPaymentDate: paidAt,
      lastPaymentAmount: update.amount,
      status: nextAmountRemaining <= 0 ? "closed" : loan.status,
      updatedAt: paidAt,
    };
  });
}
