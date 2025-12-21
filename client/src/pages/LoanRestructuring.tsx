import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Loan Restructuring Request Page
 * Design: Mobile-native banking app style
 * - Reason selection
 * - Proposed terms
 * - Submission confirmation
 */
export default function LoanRestructuring() {
  const [, setLocation] = useLocation();
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [proposedTenure, setProposedTenure] = useState("24");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const loanInfo = {
    loanId: "GL-2025-001",
    currentTenure: 12,
    outstanding: 7500,
    monthlyPayment: 916.67
  };

  const reasons = [
    { value: "job-loss", label: "Job Loss / Reduced Income" },
    { value: "medical", label: "Medical Emergency" },
    { value: "hardship", label: "Financial Hardship" },
    { value: "other", label: "Other" }
  ];

  const newMonthlyPayment = loanInfo.outstanding / parseInt(proposedTenure || "24");
  const savings = loanInfo.monthlyPayment - newMonthlyPayment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason && explanation) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Request Submitted!
        </h2>
        <p className="text-slate-500 text-center mb-2 max-w-xs">
          Your restructuring request has been received.
        </p>
        <p className="text-slate-500 text-center mb-8 max-w-xs text-sm">
          We'll review and respond within 3-5 business days.
        </p>
        <Button
          onClick={() => setLocation("/dashboard")}
          className="w-full max-w-xs rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12"
        >
          Back to Home
        </Button>
      </div>
    );
  }

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
            Restructure Loan
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Experiencing financial difficulty? We can help extend your tenure and reduce monthly payments.
          </p>
        </div>

        {/* Current Loan */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
          <p className="text-xs text-slate-500 mb-2">{loanInfo.loanId}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500">Outstanding</p>
              <p className="font-bold text-primary">K{loanInfo.outstanding.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Current Payment</p>
              <p className="font-bold text-slate-900">K{loanInfo.monthlyPayment.toFixed(0)}/mo</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Reason</h3>
            <div className="space-y-2">
              {reasons.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    reason === opt.value ? "border-primary bg-primary/5" : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={opt.value}
                    checked={reason === opt.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className={`font-medium text-sm ${reason === opt.value ? "text-primary" : "text-slate-700"}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Explain Your Situation</h3>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Please describe your situation..."
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 resize-none h-24 text-sm"
              required
            />
          </div>

          {/* Proposed Tenure */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Proposed New Tenure</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Months</label>
                <Input
                  type="number"
                  min={loanInfo.currentTenure + 1}
                  max={60}
                  value={proposedTenure}
                  onChange={(e) => setProposedTenure(e.target.value)}
                  className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                />
              </div>
              
              <div className="bg-green-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-green-700">New Monthly Payment</span>
                  <span className="font-bold text-green-700">K{newMonthlyPayment.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-700">Monthly Savings</span>
                  <span className="font-bold text-green-700">K{savings.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Approval takes 3-5 business days. You'll be notified via SMS and email.
            </p>
          </div>
        </form>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 safe-area-bottom">
        <Button
          onClick={handleSubmit}
          disabled={!reason || !explanation}
          className="w-full rounded-xl bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold h-12"
        >
          Submit Request
        </Button>
      </div>
    </div>
  );
}
