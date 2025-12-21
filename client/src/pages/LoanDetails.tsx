import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronLeft, CreditCard, TrendingDown, FileText, Check, Clock, Circle } from "lucide-react";

/**
 * Loan Details Page
 * Design: Mobile-native banking app style
 * - Loan summary header
 * - Progress visualization
 * - Repayment schedule
 */
export default function LoanDetails() {
  const [, setLocation] = useLocation();

  const loan = {
    id: "GL-2025-001",
    type: "Personal Loan",
    amount: 10000,
    disbursed: 9500,
    totalRepayment: 11000,
    interestRate: 15,
    outstanding: 7500,
    nextPayment: "Jan 31, 2025",
    amountDue: 916.67,
    status: "active",
    progress: 25
  };

  const schedule = [
    { date: "Dec 31, 2024", amount: 916.67, status: "paid" },
    { date: "Jan 31, 2025", amount: 916.67, status: "due" },
    { date: "Feb 28, 2025", amount: 916.67, status: "upcoming" },
    { date: "Mar 31, 2025", amount: 916.67, status: "upcoming" },
    { date: "Apr 30, 2025", amount: 916.67, status: "upcoming" },
    { date: "May 31, 2025", amount: 916.67, status: "upcoming" },
    { date: "Jun 30, 2025", amount: 916.67, status: "upcoming" },
    { date: "Jul 31, 2025", amount: 916.67, status: "upcoming" },
    { date: "Aug 31, 2025", amount: 916.67, status: "upcoming" },
    { date: "Sep 30, 2025", amount: 916.67, status: "upcoming" },
    { date: "Oct 31, 2025", amount: 916.67, status: "upcoming" },
    { date: "Nov 30, 2025", amount: 916.67, status: "upcoming" }
  ];

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
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-white/70 text-[10px] uppercase tracking-wide">Loan Amount</p>
                <p className="text-white font-bold text-xl">K{loan.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase tracking-wide">Outstanding</p>
                <p className="text-white font-bold text-xl">K{loan.outstanding.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${loan.progress}%` }}
                ></div>
              </div>
              <span className="text-white text-xs font-medium">{loan.progress}% paid</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 -mt-2 pb-8 space-y-4">
        {/* Next Payment Card */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-amber-800 text-xs font-medium">Next Payment</p>
              <p className="text-amber-900 font-bold">{loan.nextPayment}</p>
            </div>
            <p className="text-amber-900 font-bold text-xl">K{loan.amountDue.toFixed(2)}</p>
          </div>
          <Button
            onClick={() => setLocation("/repayment")}
            className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold h-10 text-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        </div>

        {/* Quick Actions */}
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

        {/* Loan Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-3">Loan Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Interest Rate</span>
              <span className="font-semibold text-slate-900 text-sm">{loan.interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Amount Disbursed</span>
              <span className="font-semibold text-slate-900 text-sm">K{loan.disbursed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Total Repayment</span>
              <span className="font-semibold text-slate-900 text-sm">K{loan.totalRepayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <span className="text-slate-500 text-sm">Amount Paid</span>
              <span className="font-bold text-green-600 text-sm">K{(loan.amount - loan.outstanding).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Repayment Schedule */}
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Payment Schedule</h3>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {schedule.map((payment, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-4 ${idx !== schedule.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getStatusBg(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{payment.date}</p>
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
      </main>
    </div>
  );
}
