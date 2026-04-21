import type { LoanDetails } from "@/lib/api-types";

export type DashboardLoanStatus =
  | "active"
  | "submitted"
  | "pending_approval"
  | "declined"
  | "pending_kyc"
  | "kyc_rejected"
  | "approved_not_disbursed"
  | "overdue"
  | "completed";

export type LoanHistoryStatusBucket = "active" | "repaid" | "rejected" | "pending";

export function isActiveLoanStatus(status: LoanDetails["status"]): boolean {
  return status === "active";
}

export function isRepaidLoanStatus(status: LoanDetails["status"]): boolean {
  return status === "completed" || status === "closed";
}

export function isRejectedLoanStatus(status: LoanDetails["status"]): boolean {
  return status === "rejected" || status === "defaulted";
}

export function isPendingLoanStatus(status: LoanDetails["status"]): boolean {
  return (
    status === "submitted" ||
    status === "pending" ||
    status === "under_review" ||
    status === "approved_not_disbursed"
  );
}

export function getDashboardLoanStatus(status: LoanDetails["status"]): DashboardLoanStatus {
  if (status === "submitted") return "submitted";
  if (status === "approved_not_disbursed") return "approved_not_disbursed";
  if (status === "active") return "active";
  if (status === "defaulted") return "overdue";
  if (isRepaidLoanStatus(status)) return "completed";
  if (status === "rejected") return "declined";
  if (isPendingLoanStatus(status)) return "pending_approval";
  return "pending_approval";
}

export function getLoanHistoryStatusBucket(
  status: LoanDetails["status"],
): LoanHistoryStatusBucket {
  if (isActiveLoanStatus(status)) return "active";
  if (isRepaidLoanStatus(status)) return "repaid";
  if (isRejectedLoanStatus(status)) return "rejected";
  return "pending";
}

export function getLoanStatusLabel(status: LoanDetails["status"]): string {
  switch (status) {
    case "approved_not_disbursed":
      return "Approved";
    case "under_review":
      return "Under Review";
    case "submitted":
      return "Submitted";
    case "pending":
      return "Pending";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "closed":
      return "Repaid";
    case "rejected":
      return "Rejected";
    case "defaulted":
      return "Defaulted";
    default:
      return "Pending";
  }
}
