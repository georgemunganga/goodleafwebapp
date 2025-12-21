import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Lock, Check, ChevronDown } from "lucide-react";
import { ProgressSteps } from "@/components/ui/progress-steps";

type Step = 1 | 2 | 3;
type LoanType = "personal" | "business";
type LoanCategory = "civil-servant" | "private" | "collateral" | "farmer";

interface ApplicationData {
  loanType: LoanType;
  loanCategory: LoanCategory;
  institutionName?: string;
  loanAmount: number;
  repaymentMonths: number;
  pin: string;
}

/**
 * Loan Application - 3-Step Wizard
 * Design: Mobile-native banking app style matching reference designs
 * - Step 1: Loan Terms
 * - Step 2: Loan Summary
 * - Step 3: PIN Verification (user already logged in)
 */
export default function LoanApplication() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<ApplicationData>({
    loanType: "personal",
    loanCategory: "civil-servant",
    loanAmount: 10000,
    repaymentMonths: 12,
    pin: ""
  });
  const [pinError, setPinError] = useState("");

  const monthlyRate = 0.015; // 1.5% monthly
  const serviceFee = formData.loanAmount * 0.05; // 5% service fee
  const amountReceived = formData.loanAmount - serviceFee;
  const monthlyPayment = (formData.loanAmount * (1 + monthlyRate * formData.repaymentMonths)) / formData.repaymentMonths;
  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    } else {
      setLocation("/dashboard");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pin.length < 4) {
      setPinError("Please enter your PIN");
      return;
    }
    // Verify PIN and submit application
    setLocation("/kyc");
  };

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === "pin") setPinError("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white sticky top-0 z-20">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-lg">
            Apply for Loan
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <ProgressSteps totalSteps={3} currentStep={currentStep} />
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${currentStep >= 1 ? "text-primary font-medium" : "text-gray-400"}`}>Loan Terms</span>
          <span className={`text-xs ${currentStep >= 2 ? "text-primary font-medium" : "text-gray-400"}`}>Summary</span>
          <span className={`text-xs ${currentStep >= 3 ? "text-primary font-medium" : "text-gray-400"}`}>Confirm</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 pb-24 overflow-y-auto">
        {/* Step 1: Loan Terms */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Define Your Loan
              </h2>
              <p className="text-gray-500">
                Select loan type and amount
              </p>
            </div>

            <div className="space-y-5">
              {/* Loan Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Loan Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "personal", label: "Personal" },
                    { value: "business", label: "Business" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleInputChange("loanType", option.value);
                        handleInputChange("loanCategory", option.value === "personal" ? "civil-servant" : "collateral");
                      }}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                        formData.loanType === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  {formData.loanType === "personal" ? "Employment Type" : "Collateral Type"}
                </label>
                <div className="relative">
                  <select
                    value={formData.loanCategory}
                    onChange={(e) => handleInputChange("loanCategory", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-white"
                  >
                    {formData.loanType === "personal" ? (
                      <>
                        <option value="civil-servant">Civil Servant (GRZ)</option>
                        <option value="private">Private Institution</option>
                      </>
                    ) : (
                      <>
                        <option value="collateral">Vehicle/Property</option>
                        <option value="farmer">Farmer Loan</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Institution Name (if Private) */}
              {formData.loanType === "personal" && formData.loanCategory === "private" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Zamtel, ZESCO"
                    value={formData.institutionName || ""}
                    onChange={(e) => handleInputChange("institutionName", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              )}

              {/* Loan Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Loan Amount (ZMW)
                </label>
                <input
                  type="number"
                  placeholder="10,000"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xl font-bold"
                />
                <p className="text-xs text-gray-500">
                  {formData.loanType === "personal" ? "K5,000 - K50,000" : "K10,000 - K200,000"}
                </p>
              </div>

              {/* Repayment Duration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">
                    Repayment Period
                  </label>
                  <span className="text-xl font-bold text-primary">
                    {formData.repaymentMonths} months
                  </span>
                </div>
                <input
                  type="range"
                  min={formData.loanType === "personal" ? 6 : 12}
                  max={formData.loanType === "personal" ? 36 : 60}
                  value={formData.repaymentMonths}
                  onChange={(e) => handleInputChange("repaymentMonths", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formData.loanType === "personal" ? "6" : "12"} months</span>
                  <span>{formData.loanType === "personal" ? "36" : "60"} months</span>
                </div>
              </div>
            </div>

            {/* Monthly Payment Preview */}
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Est. Monthly Payment</span>
                <span className="text-3xl font-bold text-primary">
                  K{monthlyPayment.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              className="w-full rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-14 text-base shadow-lg shadow-primary/30"
            >
              Continue <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Loan Summary */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Loan Summary
              </h2>
              <p className="text-gray-500">
                Review your loan details
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] p-5">
                <p className="text-white/70 text-sm">Loan Amount</p>
                <p className="text-white text-4xl font-bold">
                  K{formData.loanAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Loan Type</span>
                  <span className="font-semibold text-gray-900">
                    {formData.loanType === "personal" ? "Personal Loan" : "Business Loan"}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {formData.loanCategory.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {formData.repaymentMonths} months
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Service Fee (5%)</span>
                  <span className="font-semibold text-gray-900">
                    K{serviceFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Amount You Receive</span>
                  <span className="font-bold text-primary text-lg">
                    K{amountReceived.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Monthly Payment</span>
                  <span className="font-bold text-gray-900 text-lg">
                    K{monthlyPayment.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">First Payment Due</span>
                  <span className="font-semibold text-gray-900">
                    {nextPaymentDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold h-14"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-14 shadow-lg shadow-primary/30"
              >
                Confirm <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: PIN Verification */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm with PIN
              </h2>
              <p className="text-gray-500">
                Enter your PIN to submit this loan application
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PIN Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 text-center">
                  Enter your 4-6 digit PIN
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  value={formData.pin}
                  onChange={(e) => handleInputChange("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full h-16 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-3xl tracking-[0.5em] font-bold"
                  maxLength={6}
                  required
                />
                {pinError && (
                  <p className="text-red-500 text-sm text-center">{pinError}</p>
                )}
              </div>

              {/* Summary reminder */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-500">Loan Amount</span>
                  <span className="font-bold text-gray-900 text-lg">K{formData.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Payment</span>
                  <span className="font-bold text-primary text-lg">K{monthlyPayment.toFixed(2)}</span>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the Terms & Conditions and authorize Goodleaf to process this loan application
                </label>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold h-14"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-14 shadow-lg shadow-primary/30"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
