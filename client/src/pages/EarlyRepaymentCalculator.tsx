import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, TrendingDown, Zap } from "lucide-react";
import { useState } from "react";

/**
 * Early Repayment Calculator Page
 * Design: Mobile-first responsive with modern branding
 * - Payment amount input
 * - Real-time calculation
 * - Settlement quote
 */
export default function EarlyRepaymentCalculator() {
  const [, setLocation] = useLocation();
  const [paymentAmount, setPaymentAmount] = useState("7500");
  const [calculationType, setCalculationType] = useState<"partial" | "full">("partial");

  const loanInfo = {
    loanId: "GL-2025-001",
    outstanding: 7500,
    totalRepayment: 11000,
    monthlyPayment: 916.67,
    remainingMonths: 12,
    interestRate: 15,
    nextPaymentDate: "Jan 31, 2025"
  };

  const amount = parseFloat(paymentAmount) || 0;
  const interestSavings = calculationType === "full" 
    ? (loanInfo.totalRepayment - loanInfo.outstanding)
    : (amount / loanInfo.outstanding) * (loanInfo.totalRepayment - loanInfo.outstanding);
  
  const newOutstanding = Math.max(0, loanInfo.outstanding - amount);
  const newRemainingMonths = calculationType === "full" 
    ? 0
    : Math.ceil((newOutstanding / loanInfo.monthlyPayment));
  
  const newFinalDate = new Date();
  newFinalDate.setMonth(newFinalDate.getMonth() + newRemainingMonths);

  const fullSettlementAmount = loanInfo.outstanding;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex items-center justify-between h-14 md:h-20 px-4 md:px-6">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900" />
            <span className="text-sm md:text-base font-semibold text-slate-900">Back</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">Early Settlement</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          {/* Loan Info Card */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
            <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
              Current Loan Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <p className="text-xs text-slate-600 mb-1">Loan ID</p>
                <p className="font-bold text-slate-900 text-sm md:text-base">
                  {loanInfo.loanId}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Outstanding Balance</p>
                <p className="font-bold text-primary text-sm md:text-base">
                  K{loanInfo.outstanding.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Remaining Months</p>
                <p className="font-bold text-slate-900 text-sm md:text-base">
                  {loanInfo.remainingMonths}
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Type Selection */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
              Repayment Type
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { value: "partial", label: "Partial Payment" },
                { value: "full", label: "Full Settlement" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCalculationType(option.value as any)}
                  className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 font-semibold transition-all text-sm md:text-base ${
                    calculationType === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Amount Input */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
              {calculationType === "full" ? "Full Settlement Amount" : "Payment Amount"}
            </h3>
            
            {calculationType === "full" ? (
              <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-200">
                <p className="text-xs text-slate-600 mb-2">Full Settlement Amount</p>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  K{fullSettlementAmount.toLocaleString()}
                </p>
                <p className="text-xs md:text-sm text-slate-600 mt-3">
                  This is the exact amount needed to fully settle your loan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-12 md:h-14 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-base md:text-lg font-bold"
                />
                <p className="text-xs md:text-sm text-slate-600">
                  Maximum: K{loanInfo.outstanding.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Calculation Results */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="font-bold text-slate-900 text-lg md:text-xl">
              Impact of This Payment
            </h3>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200">
                <p className="text-xs text-slate-600 mb-2">New Outstanding Balance</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  K{newOutstanding.toLocaleString()}
                </p>
              </div>

              <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-secondary/30">
                <p className="text-xs text-slate-600 mb-2">Interest Savings</p>
                <p className="text-2xl md:text-3xl font-bold text-secondary">
                  K{interestSavings.toFixed(2)}
                </p>
              </div>

              <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200">
                <p className="text-xs text-slate-600 mb-2">Remaining Months</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">
                  {newRemainingMonths}
                </p>
              </div>

              <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200">
                <p className="text-xs text-slate-600 mb-2">New Final Payment Date</p>
                <p className="text-lg md:text-xl font-bold text-slate-900">
                  {newFinalDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Box */}
          <div className="p-6 md:p-8 bg-green-50 rounded-3xl border-2 border-green-200">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 text-base md:text-lg mb-2">
                  Benefits of Early Repayment
                </h4>
                <ul className="text-xs md:text-sm text-green-800 space-y-2">
                  <li>✓ Save K{interestSavings.toFixed(2)} in interest charges</li>
                  <li>✓ Reduce your loan tenure by {loanInfo.remainingMonths - newRemainingMonths} months</li>
                  <li>✓ Improve your credit profile</li>
                  <li>✓ No prepayment penalties</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 md:gap-4">
            <Button
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setLocation("/repayment")}
              className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base flex items-center justify-center gap-2"
            >
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
