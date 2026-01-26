import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { loanService } from "@/lib/api-service";
import * as Types from "@/lib/api-types";
import { useLoanApplicationGate } from "@/hooks/useLoanApplicationGate";

/**
 * Pre-Eligibility Checker Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Loan type and eligibility questions
 * - Real-time eligibility assessment
 * - Results display
 */
export default function PreEligibilityChecker() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"form" | "result">("form");
  const [result, setResult] = useState<"eligible" | "maybe" | "ineligible" | null>(null);
  const [apiResult, setApiResult] = useState<Types.PreEligibilityResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canApply, inProgressLoan } = useLoanApplicationGate();

  const [formData, setFormData] = useState({
    loanType: "personal",
    employmentStatus: "employed",
    monthlyIncome: "",
    existingDebt: "",
    loanAmount: ""
  });

  const handleCheck = async () => {
    const income = parseInt(formData.monthlyIncome) || 0;
    const debt = parseInt(formData.existingDebt) || 0;
    const desiredLoanAmount = parseInt(formData.loanAmount) || 0;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await loanService.checkEligibility({
        loanType: formData.loanType as Types.PreEligibilityRequest["loanType"],
        employmentStatus: formData.employmentStatus,
        monthlyIncome: income,
        existingDebt: debt,
        loanAmount: desiredLoanAmount,
      });
      setApiResult(response);

      if (response.eligible) {
        setResult("eligible");
      } else if (response.score >= 50) {
        setResult("maybe");
      } else {
        setResult("ineligible");
      }

      setStep("result");
    } catch (err) {
      console.error("Eligibility check failed:", err);
      setError("Eligibility check failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "result") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
          <div className="px-5 pt-6 pb-6 w-full">
            <button
              onClick={() => setStep("form")}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-base font-semibold">Back</span>
            </button>
            <h1 className="text-2xl font-bold">Eligibility Result</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-6 w-full overflow-y-auto flex flex-col items-center justify-center">
          {/* Result Card */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            {result === "eligible" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Likely Eligible</h2>
                <p className="text-base text-gray-600 mb-4">
                  {apiResult?.message || "Great news! Based on your information, you're likely to qualify for a loan with us."}
                </p>
                {apiResult && (
                  <div className="bg-green-50 rounded-xl p-4 text-left mb-6">
                    <p className="text-sm text-green-800">Estimated score: {apiResult.score}</p>
                    <p className="text-sm text-green-800">Max loan amount: K{apiResult.maxLoanAmount.toLocaleString()}</p>
                    <p className="text-sm text-green-800">Interest rate: {apiResult.interestRate}%</p>
                  </div>
                )}
                {canApply ? (
                  <Button
                    onClick={() => setLocation("/apply")}
                    className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                  >
                    Start Application
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-800">You have a loan application in progress</p>
                    </div>
                    <Button
                      onClick={() => setLocation(`/loans/${inProgressLoan?.loanId}`)}
                      className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                    >
                      View Application Status
                    </Button>
                  </div>
                )}
              </>
            )}

            {result === "maybe" && (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Possibly Eligible</h2>
                <p className="text-base text-gray-600 mb-4">
                  {apiResult?.message || "You might qualify, but we'll need to review your full application. Our team will assess your eligibility in detail."}
                </p>
                {apiResult && (
                  <div className="bg-amber-50 rounded-xl p-4 text-left mb-6">
                    <p className="text-sm text-amber-800">Estimated score: {apiResult.score}</p>
                    <p className="text-sm text-amber-800">Max loan amount: K{apiResult.maxLoanAmount.toLocaleString()}</p>
                    <p className="text-sm text-amber-800">Interest rate: {apiResult.interestRate}%</p>
                  </div>
                )}
                {canApply ? (
                  <Button
                    onClick={() => setLocation("/apply")}
                    className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                  >
                    Continue Application
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-800">You have a loan application in progress</p>
                    </div>
                    <Button
                      onClick={() => setLocation(`/loans/${inProgressLoan?.loanId}`)}
                      className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                    >
                      View Application Status
                    </Button>
                  </div>
                )}
              </>
            )}

            {result === "ineligible" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Currently Eligible</h2>
                <p className="text-base text-gray-600 mb-4">
                  {apiResult?.message || "Based on your information, you don't currently meet our eligibility criteria. Please check back later or contact our support team."}
                </p>
                {apiResult && (
                  <div className="bg-red-50 rounded-xl p-4 text-left mb-6">
                    <p className="text-sm text-red-800">Estimated score: {apiResult.score}</p>
                    <p className="text-sm text-red-800">Max loan amount: K{apiResult.maxLoanAmount.toLocaleString()}</p>
                    <p className="text-sm text-red-800">Interest rate: {apiResult.interestRate}%</p>
                  </div>
                )}
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="w-full h-12 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold text-base rounded-xl"
                >
                  Return to Dashboard
                </Button>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-5 pt-6 pb-6 w-full">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-1">Check Eligibility</h1>
          <p className="text-white/70 text-base">Quick assessment in 2 minutes</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {/* Loan Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-base font-bold text-gray-900 mb-4">Loan Type</label>
            <div className="space-y-3">
              {[
                { value: "personal", label: "Personal Loan" },
                { value: "business", label: "Business Loan" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, loanType: option.value })}
                  className={`w-full p-4 rounded-xl border-2 text-left font-bold text-base transition-all ${
                    formData.loanType === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Employment Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-base font-bold text-gray-900 mb-4">Employment Status</label>
            <select
              value={formData.employmentStatus}
              onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base font-medium"
            >
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          {/* Monthly Income */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-base font-bold text-gray-900 mb-2">Monthly Income (K)</label>
            <p className="text-sm text-gray-500 mb-4">Approximate gross monthly income</p>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              placeholder="Enter amount"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
            />
          </div>

          {/* Desired Loan Amount */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-base font-bold text-gray-900 mb-2">Desired Loan Amount (K)</label>
            <p className="text-sm text-gray-500 mb-4">How much are you looking to borrow?</p>
            <input
              type="number"
              value={formData.loanAmount}
              onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
              placeholder="Enter amount"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
            />
          </div>

          {/* Existing Debt */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-base font-bold text-gray-900 mb-2">Existing Monthly Debt (K)</label>
            <p className="text-sm text-gray-500 mb-4">Other loans, credit cards, etc.</p>
            <input
              type="number"
              value={formData.existingDebt}
              onChange={(e) => setFormData({ ...formData, existingDebt: e.target.value })}
              placeholder="Enter amount"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
            />
          </div>

          {/* Check Button */}
          <Button
            onClick={handleCheck}
            disabled={isSubmitting}
            className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
          >
            {isSubmitting ? "Checking..." : "Check Eligibility"}
          </Button>
        </div>
      </main>
    </div>
  );
}
