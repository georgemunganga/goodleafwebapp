import { Button } from "@/components/ui/button";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft, CreditCard, TrendingDown, FileText, Check, Clock, Circle } from "lucide-react";
import { useLoans } from "@/contexts/LoanContext";
import { toast } from "sonner";
import LoanService from "@/services/LoanService";
import { LoanScheduleItem } from "@/types";

/**
 * Loan Details Page
 * Design: Mobile-native banking app style
 * - Loan summary header
 * - Progress visualization
 * - Repayment schedule
 */
export default function LoanDetails() {
  const [loanId] = useParams();
  const [, setLocation] = useLocation();
  const { loans, isLoading, error, fetchLoans } = useLoans();
  const [loan, setLoan] = useState<any>(null);
  const [schedule, setSchedule] = useState<LoanScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  useEffect(() => {
    if (loans.length > 0) {
      const foundLoan = loans.find(l => l.id.toString() === loanId);
      if (foundLoan) {
        setLoan(foundLoan);
      } else {
        toast.error("Loan not found");
        setLocation("/loans");
      }
    }
  }, [loans, loanId, setLocation]);

  useEffect(() => {
    if (!loan?.id) {
      return;
    }

    let isCurrent = true;
    setScheduleLoading(true);
    setScheduleError(null);

    LoanService.getLoanSchedule(loan.id.toString())
      .then((data) => {
        if (isCurrent) {
          setSchedule(data);
        }
      })
      .catch((err: any) => {
        if (isCurrent) {
          setScheduleError(err.message || "Failed to load schedule");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setScheduleLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [loan?.id]);

  if (isLoading && !loan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (error && !loan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Circle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Error Loading Loan</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => fetchLoans()} className="bg-primary hover:bg-[#256339]">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!loan) {
    return null;
  }

  const formatDate = (value?: string) => {
    if (!value) return "TBD";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="w-4 h-4 text-white" />;
      case "due":
        return <Clock className="w-4 h-4 text-white" />;
      default:
        return <Circle className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "due":
        return "bg-amber-500";
      default:
        return "bg-slate-200";
    }
  };

  const outstanding = loan.outstanding ?? 0;
  const progress = loan.progress ?? 0;
  const nextPayment = loan.nextPayment ?? "TBD";
  const amountDue = loan.amountDue ?? 0;
  const interestRate = loan.interestRate ?? 0;
  const disbursed = loan.disbursed ?? loan.amount;
  const totalRepayment = loan.totalRepayment ?? loan.amount;
  const isActive = loan.status === "active";
  const isApproved = loan.status === "approved";
  const isPending = loan.status === "pending";
  const isRejected = loan.status === "rejected";
  const isPaid = loan.status === "paid" || loan.status === "repaid";
  const isRestructuring = loan.status === "restructuring_requested";

  const statusLabel = isActive
    ? "Active"
    : isApproved
    ? "Approved"
    : isPending
    ? "Processing"
    : isRejected
    ? "Declined"
    : isPaid
    ? "Repaid"
    : isRestructuring
    ? "Restructuring"
    : loan.status.charAt(0).toUpperCase() + loan.status.slice(1);

  const statusNotice = (() => {
    if (isPending) {
      return {
        tone: "bg-amber-50 border-amber-200 text-amber-800",
        title: "Application in Review",
        description: "We're verifying your details. Complete KYC to move faster.",
        actionLabel: "Complete KYC",
        actionPath: "/kyc",
      };
    }
    if (isApproved) {
      return {
        tone: "bg-emerald-50 border-emerald-200 text-emerald-800",
        title: "Approved",
        description: "Your loan is approved and pending disbursement.",
        actionLabel: "Back to Dashboard",
        actionPath: "/dashboard",
      };
    }
    if (isRejected) {
      return {
        tone: "bg-red-50 border-red-200 text-red-800",
        title: "Application Declined",
        description: "We couldn't approve this request. You can update details and reapply.",
        actionLabel: "Apply Again",
        actionPath: "/apply",
      };
    }
    if (isRestructuring) {
      return {
        tone: "bg-purple-50 border-purple-200 text-purple-800",
        title: "Restructuring in Review",
        description: "Your request is under review. We'll notify you once a decision is made.",
        actionLabel: "Back to Dashboard",
        actionPath: "/dashboard",
      };
    }
    if (isPaid) {
      return {
        tone: "bg-green-50 border-green-200 text-green-800",
        title: "Loan Repaid",
        description: "This loan is fully settled. Thank you for paying on time.",
        actionLabel: "View History",
        actionPath: "/loans",
      };
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-primary pt-safe">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => setLocation("/loans")}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="flex-1 text-center font-bold text-white">
            Loan Details
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Loan Summary */}
        <div className="px-5 pb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/70 text-xs">{loan.id}</p>
                  <h2 className="text-white font-bold text-lg">{loan.type}</h2>
                </div>
              <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                {statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-white/70 text-[10px] uppercase tracking-wide">Loan Amount</p>
                <p className="text-white font-bold text-xl">K{loan.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase tracking-wide">Outstanding</p>
                <p className="text-white font-bold text-xl">K{outstanding.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-white text-xs font-medium">{progress}% paid</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 -mt-2 pb-8 space-y-4">
        {statusNotice && (
          <div className={`rounded-2xl border p-4 ${statusNotice.tone}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold">{statusNotice.title}</h3>
                <p className="text-sm mt-1">{statusNotice.description}</p>
              </div>
              <Button
                onClick={() => setLocation(statusNotice.actionPath)}
                size="sm"
                className="rounded-xl bg-primary hover:bg-[#256339]"
              >
                {statusNotice.actionLabel}
              </Button>
            </div>
          </div>
        )}

        {/* Next Payment Card */}
        {isActive && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-amber-800 text-xs font-medium">Next Payment</p>
                <p className="text-amber-900 font-bold">{formatDate(nextPayment)}</p>
              </div>
              <p className="text-amber-900 font-bold text-xl">K{amountDue.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => setLocation("/repayment")}
              className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold h-10 text-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {isActive && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocation("/early-repayment")}
              className="bg-white rounded-xl p-4 border border-slate-100 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-slate-900 text-sm">Early Settlement</p>
              <p className="text-xs text-slate-500">Pay off early</p>
            </button>
            <button
              onClick={() => setLocation("/restructuring")}
              className="bg-white rounded-xl p-4 border border-slate-100 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <p className="font-semibold text-slate-900 text-sm">Restructure</p>
              <p className="text-xs text-slate-500">Extend tenure</p>
            </button>
          </div>
        )}

        {/* Loan Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-3">Loan Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Interest Rate</span>
              <span className="font-semibold text-slate-900 text-sm">{interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Amount Disbursed</span>
              <span className="font-semibold text-slate-900 text-sm">K{disbursed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Total Repayment</span>
              <span className="font-semibold text-slate-900 text-sm">K{totalRepayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <span className="text-slate-500 text-sm">Amount Paid</span>
              <span className="font-bold text-green-600 text-sm">K{Math.max(0, totalRepayment - outstanding).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Repayment Schedule */}
        {(isActive || isPaid) && (
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Payment Schedule</h3>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {scheduleLoading && (
                <div className="p-4 text-sm text-slate-500">Loading schedule...</div>
              )}
              {scheduleError && (
                <div className="p-4 text-sm text-red-600">{scheduleError}</div>
              )}
              {!scheduleLoading && !scheduleError && schedule.length === 0 && (
                <div className="p-4 text-sm text-slate-500">No schedule available.</div>
              )}
              {schedule.map((payment, idx) => (
                <div
                  key={`${payment.date}-${idx}`}
                  className={`flex items-center gap-3 p-4 ${idx !== schedule.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getStatusBg(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">{formatDate(payment.date)}</p>
                    <p className="text-xs text-slate-500">
                      {payment.status === "paid" ? "Completed" : payment.status === "due" ? "Due now" : "Upcoming"}
                    </p>
                  </div>
                  <p className={`font-bold text-sm ${payment.status === "paid" ? "text-green-600" : payment.status === "due" ? "text-amber-600" : "text-slate-900"}`}>
                    K{payment.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isActive && !isPaid && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 text-sm text-slate-500">
            Payment schedule will be available once the loan is active.
          </div>
        )}
      </main>
    </div>
  );
}
