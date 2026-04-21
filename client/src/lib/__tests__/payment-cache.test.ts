import { describe, expect, it } from "vitest";
import type { LoanDetails } from "@/lib/api-types";
import { applyPaymentToLoanRecords } from "@/lib/payment-cache";

const baseLoan: LoanDetails = {
  id: "123",
  loanId: "GL-2026-000123",
  userId: "user-1",
  loanType: "personal",
  loanCategory: "Emergency",
  loanAmount: 10000,
  principalAmount: 10000,
  interestRate: 15,
  serviceCharge: 500,
  totalRepayment: 12000,
  repaymentMonths: 12,
  monthlyPayment: 1000,
  status: "active",
  approvalDate: "2026-01-01T00:00:00.000Z",
  firstPaymentDate: "2026-02-01T00:00:00.000Z",
  maturityDate: "2026-12-01T00:00:00.000Z",
  nextPaymentDate: "2026-05-01T00:00:00.000Z",
  amountPaid: 3000,
  amountRemaining: 9000,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
};

describe("applyPaymentToLoanRecords", () => {
  it("updates the remaining balance and last payment date after a partial payment", () => {
    const paidAt = "2026-04-21T12:00:00.000Z";
    const result = applyPaymentToLoanRecords([baseLoan], {
      loanId: baseLoan.loanId,
      amount: 1000,
      paidAt,
    });

    expect(result[0].amountPaid).toBe(4000);
    expect(result[0].amountRemaining).toBe(8000);
    expect(result[0].lastPaymentDate).toBe(paidAt);
    expect(result[0].lastPaymentAmount).toBe(1000);
    expect(result[0].status).toBe("active");
  });

  it("marks the loan closed when the repayment clears the remaining balance", () => {
    const paidAt = "2026-04-21T12:00:00.000Z";
    const result = applyPaymentToLoanRecords([baseLoan], {
      loanId: baseLoan.id,
      amount: 9000,
      paidAt,
    });

    expect(result[0].amountPaid).toBe(12000);
    expect(result[0].amountRemaining).toBe(0);
    expect(result[0].lastPaymentDate).toBe(paidAt);
    expect(result[0].lastPaymentAmount).toBe(9000);
    expect(result[0].status).toBe("closed");
  });
});
