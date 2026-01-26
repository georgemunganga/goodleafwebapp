import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as Types from "@/lib/api-types";
import { ArrowLeft, Calendar, Check, Clock, Download, TrendingDown } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { useLoanDetails, useRepaymentSchedule } from "@/hooks/useLoanQueries";

/**
 * Loan Details Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Loan overview with key metrics
 * - Repayment schedule
 * - Action buttons
 */
export default function LoanDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/loans/:id");
  const loanId = params?.id;
  const loanQuery = useLoanDetails(loanId ?? "");
  const scheduleQuery = useRepaymentSchedule(loanId ?? "");

  const loan = (loanQuery.data ?? null) as Types.LoanDetails | null;
  const schedule = (scheduleQuery.data ?? []) as Types.RepaymentSchedule[];
  const isLoading = loanQuery.isLoading || scheduleQuery.isLoading;
  const error = loanQuery.error || scheduleQuery.error;
  const errorMessage = (() => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
      return (error as any).message as string;
    }
    return "Failed to load loan details. Please try again.";
  })();

  const progress = useMemo(() => {
    if (!loan || !loan.loanAmount) return 0;
    return Math.round((loan.amountPaid / loan.loanAmount) * 100);
  }, [loan]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner variant="spinner" size="lg" color="primary" />
      </div>
    );
  }

  if (!loanId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <p className="text-gray-600 mb-4">Loan not found.</p>
        <Button onClick={() => setLocation("/loans")} className="rounded-xl bg-primary hover:bg-[#256339]">
          Back to Loans
        </Button>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <p className="text-gray-600 mb-4">{errorMessage || "Loan not found."}</p>
        <Button onClick={() => setLocation("/loans")} className="rounded-xl bg-primary hover:bg-[#256339]">
          Back to Loans
        </Button>
      </div>
    );
  }

  const statusLabel = loan.status === "active"
    ? "Active"
    : loan.status === "completed"
    ? "Completed"
    : loan.status === "pending"
    ? "Pending"
    : loan.status === "rejected"
    ? "Rejected"
    : "Defaulted";

  const nextPaymentLabel = loan.nextPaymentDate
    ? new Date(loan.nextPaymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "-";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-5 pt-6 pb-6 w-full">
          <button
            onClick={() => setLocation("/loans")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-1">{loan.loanType === "business" ? "Business" : "Personal"} Loan</h1>
          <p className="text-white/70 text-base">{loan.loanId}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto space-y-4">
        {/* Loan Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 font-semibold">LOAN STATUS</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">{statusLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Loan Amount</p>
              <p className="text-lg font-bold text-gray-900">K{loan.loanAmount.toLocaleString()}</p>
            </div>
            <div className="bg-primary/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Outstanding</p>
              <p className="text-lg font-bold text-primary">K{loan.amountRemaining.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Interest Rate</p>
              <p className="text-lg font-bold text-gray-900">{loan.interestRate}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Monthly Payment</p>
              <p className="text-lg font-bold text-gray-900">K{loan.monthlyPayment.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-semibold">Repayment Progress</span>
              <span className="text-sm text-gray-600 font-semibold">{progress}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Key Details */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-base text-gray-600 font-medium">Disbursed</span>
              </div>
              <span className="text-base font-bold text-gray-900">
                {new Date(loan.approvalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-base text-gray-600 font-medium">Tenure</span>
              </div>
              <span className="text-base font-bold text-gray-900">{loan.repaymentMonths} months</span>
            </div>
          </div>
        </div>

        {/* Next Payment Card */}
        <div className="bg-gradient-to-br from-[#2e7146]/10 to-[#1d4a2f]/10 rounded-2xl border-2 border-primary/20 p-5">
          <p className="text-xs text-gray-600 mb-2 font-semibold">NEXT PAYMENT DUE</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">K{loan.monthlyPayment.toLocaleString()}</p>
              <p className="text-base text-gray-600 font-medium">{nextPaymentLabel}</p>
            </div>
            <Button
              onClick={() => setLocation("/repayment")}
              className="h-12 bg-primary hover:bg-[#256339] text-white font-bold rounded-xl px-6 text-base"
            >
              Pay Now
            </Button>
          </div>
        </div>

        {/* Repayment Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Repayment Schedule</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {schedule.length > 0 ? (
              schedule.map((payment) => {
                const dueDate = new Date(payment.dueDate);
                return (
                  <div key={payment.id} className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-gray-900">{dueDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                      <p className="text-sm text-gray-500">Due: {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">K{payment.amount.toLocaleString()}</p>
                      <p className={`text-sm font-semibold flex items-center gap-1 justify-end ${payment.status === "paid" ? "text-green-600" : "text-amber-600"}`}>
                        {payment.status === "paid" && <Check className="w-4 h-4" />}
                        {payment.status === "paid" ? "Paid" : "Upcoming"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-5 text-center text-sm text-gray-500">No repayment schedule available yet.</div>
            )}
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-primary font-bold text-base hover:underline">View Full Schedule</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setLocation("/early-repayment")}
            variant="outline"
            className="w-full h-12 border-2 border-primary text-primary font-bold text-base rounded-xl hover:bg-primary/5"
          >
            <TrendingDown className="w-5 h-5 mr-2" />
            Early Repayment Calculator
          </Button>
          <Button
            onClick={() => setLocation("/restructure")}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 text-gray-900 font-bold text-base rounded-xl hover:bg-gray-50"
          >
            Request Restructuring
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 text-gray-900 font-bold text-base rounded-xl hover:bg-gray-50"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Statement
          </Button>
        </div>
      </main>
    </div>
  );
}
