import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronLeft, CreditCard, FileText, TrendingDown } from "lucide-react";

/**
 * Loan Details Page
 * Design: Mobile-first responsive with modern branding
 * - Loan summary
 * - Repayment schedule
 * - Action buttons
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
    status: "active"
  };

  const schedule = [
    { date: "Dec 31, 2024", principal: 750, interest: 166.67, status: "paid" },
    { date: "Jan 31, 2025", principal: 750, interest: 166.67, status: "due" },
    { date: "Feb 28, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Mar 31, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Apr 30, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "May 31, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Jun 30, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Jul 31, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Aug 31, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Sep 30, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Oct 31, 2025", principal: 750, interest: 166.67, status: "upcoming" },
    { date: "Nov 30, 2025", principal: 750, interest: 166.67, status: "upcoming" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 border-green-200";
      case "due":
        return "bg-accent/10 border-accent/30";
      case "upcoming":
        return "bg-white border-slate-200";
      default:
        return "bg-white border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">Paid</span>;
      case "due":
        return <span className="text-xs font-semibold text-accent bg-accent/20 px-2 py-1 rounded-full">Due</span>;
      case "upcoming":
        return <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Upcoming</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex items-center justify-between h-14 md:h-20 px-4 md:px-6">
          <button
            onClick={() => setLocation("/loans")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900" />
            <span className="text-sm md:text-base font-semibold text-slate-900">Back</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">{loan.id}</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Loan Summary Card */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
            <div className="flex items-start justify-between mb-6 md:mb-8">
              <div>
                <p className="text-sm text-slate-600 mb-1">Active Loan</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {loan.type}
                </h2>
              </div>
              <span className="px-4 py-2 bg-secondary/20 text-secondary font-semibold rounded-full text-sm">
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div>
                <p className="text-xs text-slate-600 mb-2">Loan Amount</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  K{loan.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-2">Amount Disbursed</p>
                <p className="text-xl md:text-2xl font-bold text-secondary">
                  K{loan.disbursed.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-2">Outstanding Balance</p>
                <p className="text-xl md:text-2xl font-bold text-primary">
                  K{loan.outstanding.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-2">Interest Rate</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {loan.interestRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Next Payment Card */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-accent/30">
            <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
              Next Payment Due
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <p className="text-xs text-slate-600 mb-2">Due Date</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900">
                  {loan.nextPayment}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-2">Amount Due</p>
                <p className="text-lg md:text-2xl font-bold text-accent">
                  K{loan.amountDue.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Button
                  onClick={() => setLocation("/repayment")}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                  Pay Now
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Button
              onClick={() => setLocation("/early-repayment")}
              variant="outline"
              className="rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-2 md:py-3 h-10 md:h-12 text-xs md:text-sm flex items-center justify-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Early Settlement
            </Button>
            <Button
              onClick={() => setLocation("/restructuring")}
              variant="outline"
              className="rounded-full border-2 border-accent text-accent hover:bg-accent/5 font-semibold py-2 md:py-3 h-10 md:h-12 text-xs md:text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Request Restructuring
            </Button>
          </div>

          {/* Repayment Schedule */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="font-bold text-slate-900 text-lg md:text-xl">
              Repayment Schedule
            </h3>

            <div className="space-y-2 md:space-y-3">
              {schedule.map((payment, idx) => (
                <div
                  key={idx}
                  className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all ${getStatusColor(payment.status)}`}
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm md:text-base mb-1">
                        {payment.date}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                        <div>
                          <p className="text-slate-600">Principal</p>
                          <p className="font-bold text-slate-900">
                            K{payment.principal.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Interest</p>
                          <p className="font-bold text-slate-900">
                            K{payment.interest.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border-2 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
              Loan Summary
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm md:text-base">Total Loan Amount</p>
                <p className="font-bold text-slate-900 text-sm md:text-base">
                  K{loan.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm md:text-base">Total Repayment</p>
                <p className="font-bold text-slate-900 text-sm md:text-base">
                  K{loan.totalRepayment.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm md:text-base">Outstanding Balance</p>
                <p className="font-bold text-primary text-sm md:text-base">
                  K{loan.outstanding.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-300">
                <p className="text-slate-600 text-sm md:text-base font-semibold">Amount Paid</p>
                <p className="font-bold text-secondary text-sm md:text-base">
                  K{(loan.amount - loan.outstanding).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
