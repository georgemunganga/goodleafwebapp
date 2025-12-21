import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, TrendingDown, Zap, Check } from "lucide-react";
import { useState } from "react";

/**
 * Early Repayment Calculator Page
 * Design: Mobile-native banking app style
 * - Payment type selection
 * - Real-time calculation
 * - Settlement benefits
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
    interestRate: 15
  };

  const amount = calculationType === "full" ? loanInfo.outstanding : (parseFloat(paymentAmount) || 0);
  const interestSavings = (amount / loanInfo.outstanding) * (loanInfo.totalRepayment - loanInfo.outstanding);
  const newOutstanding = Math.max(0, loanInfo.outstanding - amount);
  const newRemainingMonths = calculationType === "full" ? 0 : Math.ceil((newOutstanding / loanInfo.monthlyPayment));
  const monthsSaved = loanInfo.remainingMonths - newRemainingMonths;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => setLocation("/loans/1")}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="flex-1 text-center font-bold text-slate-900">
            Early Settlement
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24 space-y-4">
        {/* Current Loan Status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">{loanInfo.loanId}</p>
            <p className="text-xs text-slate-500">{loanInfo.remainingMonths} months left</p>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500">Outstanding Balance</p>
              <p className="text-2xl font-bold text-primary">K{loanInfo.outstanding.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Interest Rate</p>
              <p className="font-bold text-slate-900">{loanInfo.interestRate}%</p>
            </div>
          </div>
        </div>

        {/* Repayment Type Selection */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-3 text-sm">Choose Option</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCalculationType("partial")}
              className={`p-4 rounded-xl border-2 transition-all ${
                calculationType === "partial"
                  ? "border-primary bg-primary/5"
                  : "border-slate-200"
              }`}
            >
              <p className={`font-semibold text-sm ${calculationType === "partial" ? "text-primary" : "text-slate-700"}`}>
                Partial Payment
              </p>
              <p className="text-xs text-slate-500 mt-1">Pay any amount</p>
            </button>
            <button
              onClick={() => setCalculationType("full")}
              className={`p-4 rounded-xl border-2 transition-all ${
                calculationType === "full"
                  ? "border-primary bg-primary/5"
                  : "border-slate-200"
              }`}
            >
              <p className={`font-semibold text-sm ${calculationType === "full" ? "text-primary" : "text-slate-700"}`}>
                Full Settlement
              </p>
              <p className="text-xs text-slate-500 mt-1">Close loan</p>
            </button>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-3 text-sm">
            {calculationType === "full" ? "Settlement Amount" : "Payment Amount"}
          </h3>
          
          {calculationType === "full" ? (
            <div className="bg-primary/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary">K{loanInfo.outstanding.toLocaleString()}</p>
              <p className="text-xs text-slate-600 mt-1">Full settlement amount</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="h-12 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 text-xl font-bold text-center"
              />
              <p className="text-xs text-slate-500 text-center">
                Max: K{loanInfo.outstanding.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Impact Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-3 text-sm">Impact Summary</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-green-700">Interest Savings</p>
              <p className="text-xl font-bold text-green-600">K{interestSavings.toFixed(0)}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-700">Months Saved</p>
              <p className="text-xl font-bold text-blue-600">{monthsSaved}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-600">New Balance</p>
              <p className="text-xl font-bold text-slate-900">K{newOutstanding.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-600">Remaining</p>
              <p className="text-xl font-bold text-slate-900">{newRemainingMonths} mo</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-green-50 rounded-2xl border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800 text-sm">Benefits</h3>
          </div>
          <div className="space-y-2">
            {[
              `Save K${interestSavings.toFixed(0)} in interest`,
              "No prepayment penalties",
              "Improve your credit profile",
              calculationType === "full" ? "Close your loan today" : `Reduce tenure by ${monthsSaved} months`
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 safe-area-bottom">
        <Button
          onClick={() => setLocation("/repayment")}
          className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12"
        >
          <TrendingDown className="w-5 h-5 mr-2" />
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
