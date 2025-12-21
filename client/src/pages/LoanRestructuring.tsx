import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

/**
 * Loan Restructuring Request Page
 * Design: Mobile-first responsive with modern branding
 * - Reason selection
 * - Explanation field
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
    { value: "job-loss", label: "Job Loss or Reduced Income" },
    { value: "medical", label: "Medical Emergency" },
    { value: "hardship", label: "Financial Hardship" },
    { value: "other", label: "Other" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason && explanation && proposedTenure) {
      setIsSubmitted(true);
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    }
  };

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
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">Request Restructuring</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <div className="space-y-6 md:space-y-8">
              {/* Info Box */}
              <div className="p-4 md:p-6 bg-blue-50 rounded-2xl md:rounded-3xl border border-blue-200">
                <p className="text-sm md:text-base text-blue-900">
                  If you're experiencing financial hardship, we're here to help. Submit a restructuring request to extend your loan tenure or adjust your payment terms.
                </p>
              </div>

              {/* Loan Info Card */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
                <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
                  Current Loan Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Loan ID</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {loanInfo.loanId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Current Tenure</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {loanInfo.currentTenure} months
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Outstanding Balance</p>
                    <p className="font-bold text-primary text-sm md:text-base">
                      K{loanInfo.outstanding.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Reason Selection */}
                <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
                    Reason for Restructuring
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {reasons.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 md:gap-4 p-4 md:p-6 border-2 border-slate-200 rounded-2xl md:rounded-3xl cursor-pointer hover:border-primary/30 hover:bg-slate-50 transition-all"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={opt.value}
                          checked={reason === opt.value}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-5 h-5 md:w-6 md:h-6 accent-primary cursor-pointer"
                        />
                        <span className="font-semibold text-slate-900 text-sm md:text-base">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
                    Explain Your Situation
                  </h3>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Please provide details about your financial situation and why you need restructuring..."
                    className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 border-slate-200 focus:border-primary focus:ring-0 resize-none h-32 md:h-40 text-sm md:text-base"
                    required
                  />
                  <p className="text-xs md:text-sm text-slate-600 mt-2">
                    Minimum 20 characters required
                  </p>
                </div>

                {/* Proposed Terms */}
                <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
                    Proposed New Tenure
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        New Tenure (Months)
                      </label>
                      <Input
                        type="number"
                        min={loanInfo.currentTenure + 1}
                        max={60}
                        value={proposedTenure}
                        onChange={(e) => setProposedTenure(e.target.value)}
                        className="h-12 md:h-14 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-base md:text-lg"
                        required
                      />
                    </div>
                    <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-200">
                      <p className="text-xs text-slate-600 mb-2">Estimated New Monthly Payment</p>
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        K{(loanInfo.outstanding / parseInt(proposedTenure)).toFixed(2)}
                      </p>
                      <p className="text-xs md:text-sm text-slate-600 mt-2">
                        Current: K{loanInfo.monthlyPayment.toFixed(2)} per month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 md:p-6 bg-amber-50 rounded-2xl md:rounded-3xl border border-amber-200">
                  <p className="text-sm md:text-base text-amber-900">
                    <strong>Note:</strong> Your restructuring request will be reviewed by our loan officers. Approval may take 3-5 business days. You'll be notified of the decision via email and SMS.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!reason || !explanation || !proposedTenure}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white font-semibold py-3 h-12 md:h-14 text-base md:text-lg"
                >
                  Submit Restructuring Request
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Request Submitted!
              </h2>
              <p className="text-slate-600 text-sm md:text-base mb-4">
                Your loan restructuring request has been received.
              </p>
              <p className="text-slate-600 text-sm md:text-base mb-8">
                Our team will review your request and contact you within 3-5 business days with a decision.
              </p>
              <Button
                onClick={() => setLocation("/dashboard")}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 px-6 md:px-8 text-sm md:text-base"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
