import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

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

  const [formData, setFormData] = useState({
    loanType: "personal",
    employmentStatus: "employed",
    monthlyIncome: "",
    existingDebt: ""
  });

  const handleCheck = () => {
    const income = parseInt(formData.monthlyIncome) || 0;
    const debt = parseInt(formData.existingDebt) || 0;

    if (income >= 5000 && debt < income * 2) {
      setResult("eligible");
    } else if (income >= 3000 && debt < income * 3) {
      setResult("maybe");
    } else {
      setResult("ineligible");
    }
    setStep("result");
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
                <p className="text-base text-gray-600 mb-8">
                  Great news! Based on your information, you're likely to qualify for a loan with us.
                </p>
                <Button
                  onClick={() => setLocation("/apply")}
                  className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                >
                  Start Application
                </Button>
              </>
            )}

            {result === "maybe" && (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Possibly Eligible</h2>
                <p className="text-base text-gray-600 mb-8">
                  You might qualify, but we'll need to review your full application. Our team will assess your eligibility in detail.
                </p>
                <Button
                  onClick={() => setLocation("/apply")}
                  className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                >
                  Continue Application
                </Button>
              </>
            )}

            {result === "ineligible" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Currently Eligible</h2>
                <p className="text-base text-gray-600 mb-8">
                  Based on your information, you don't currently meet our eligibility criteria. Please check back later or contact our support team.
                </p>
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
            className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
          >
            Check Eligibility
          </Button>
        </div>
      </main>
    </div>
  );
}
