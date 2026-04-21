import {
  getDashboardLoanStatus,
  getLoanHistoryStatusBucket,
  getLoanStatusLabel,
  isActiveLoanStatus,
  isPendingLoanStatus,
  isRepaidLoanStatus,
  isRejectedLoanStatus,
} from "@/lib/loan-status";

describe("loan status mapping", () => {
  it("treats approved but not yet disbursed loans as pending in loan history", () => {
    expect(getLoanHistoryStatusBucket("approved_not_disbursed")).toBe("pending");
    expect(getLoanStatusLabel("approved_not_disbursed")).toBe("Approved");
  });

  it("treats disbursed loans as active on the dashboard and in active-loan checks", () => {
    expect(getDashboardLoanStatus("active")).toBe("active");
    expect(isActiveLoanStatus("active")).toBe(true);
    expect(isActiveLoanStatus("approved_not_disbursed")).toBe(false);
  });

  it("does not fall back closed loans to under review on the dashboard", () => {
    expect(getDashboardLoanStatus("closed")).toBe("completed");
    expect(isRepaidLoanStatus("closed")).toBe(true);
  });

  it("keeps pending lifecycle statuses grouped together", () => {
    expect(isPendingLoanStatus("submitted")).toBe(true);
    expect(isPendingLoanStatus("pending")).toBe(true);
    expect(isPendingLoanStatus("under_review")).toBe(true);
    expect(isPendingLoanStatus("approved_not_disbursed")).toBe(true);
  });

  it("keeps rejected and defaulted loans out of active and repaid buckets", () => {
    expect(isRejectedLoanStatus("rejected")).toBe(true);
    expect(isRejectedLoanStatus("defaulted")).toBe(true);
    expect(getLoanHistoryStatusBucket("defaulted")).toBe("rejected");
  });
});
