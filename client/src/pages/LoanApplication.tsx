import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
 * Design: Responsive desktop and mobile layouts
 * - Desktop: Multi-column layout with form on left, preview on right
 * - Mobile: Full-width single column
 * - Step 1: Loan Terms
 * - Step 2: Loan Summary
 * - Step 3: PIN Verification
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
  const [showPin, setShowPin] = useState(false);

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
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Column - Form */}
        <div className="w-1/2 flex flex-col border-r border-gray-200">
          {/* Header */}
          <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Apply for Loan</h1>
                <p className="text-white/70 text-sm">Step {currentStep} of 3</p>
              </div>
            </div>
          </header>

          {/* Progress */}
          <div className="px-8 py-6 border-b border-gray-200">
            <ProgressSteps totalSteps={3} currentStep={currentStep} />
            <div className="flex justify-between mt-3 text-sm font-medium">
              <span className={currentStep >= 1 ? "text-primary" : "text-gray-400"}>Loan Terms</span>
              <span className={currentStep >= 2 ? "text-primary" : "text-gray-400"}>Summary</span>
              <span className={currentStep >= 3 ? "text-primary" : "text-gray-400"}>Confirm</span>
            </div>
          </div>

          {/* Form Content */}
          <main className="flex-1 px-8 py-6 overflow-y-auto">
            {/* Step 1: Loan Terms */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Define Your Loan</h2>
                  <p className="text-gray-600">Select loan type and amount</p>
                </div>

                <div className="space-y-5">
                  {/* Loan Type */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">Loan Type</label>
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
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      {formData.loanType === "personal" ? "Employment Type" : "Collateral Type"}
                    </label>
                    <select
                      value={formData.loanCategory}
                      onChange={(e) => handleInputChange("loanCategory", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                  </div>

                  {/* Institution Name */}
                  {formData.loanType === "personal" && formData.loanCategory === "private" && (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900">Institution Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Zamtel, ZESCO"
                        value={formData.institutionName || ""}
                        onChange={(e) => handleInputChange("institutionName", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  )}

                  {/* Loan Amount */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">Loan Amount (ZMW)</label>
                    <input
                      type="number"
                      placeholder="10,000"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-bold"
                    />
                    <p className="text-xs text-gray-500">
                      {formData.loanType === "personal" ? "K5,000 - K50,000" : "K10,000 - K200,000"}
                    </p>
                  </div>

                  {/* Repayment Duration */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-900">Repayment Period</label>
                      <span className="text-lg font-bold text-primary">{formData.repaymentMonths} months</span>
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
              </div>
            )}

            {/* Step 2: Summary */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Summary</h2>
                  <p className="text-gray-600">Review your loan details</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] p-6">
                    <p className="text-white/70 text-sm">Loan Amount</p>
                    <p className="text-white text-3xl font-bold">K{formData.loanAmount.toLocaleString()}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Loan Type</span>
                      <span className="font-semibold text-gray-900">{formData.loanType === "personal" ? "Personal" : "Business"}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-900">{formData.repaymentMonths} months</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Service Fee (5%)</span>
                      <span className="font-semibold text-gray-900">K{serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Amount You Receive</span>
                      <span className="font-bold text-primary text-lg">K{amountReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Monthly Payment</span>
                      <span className="font-bold text-gray-900 text-lg">K{monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-gray-600">First Payment Due</span>
                      <span className="font-semibold text-gray-900">{nextPaymentDate.toLocaleDateString()}</span>
                    </div>
                  </div>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm with PIN</h2>
                  <p className="text-gray-600">Enter your PIN to submit this application</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">Enter PIN</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPin ? "text" : "password"}
                        placeholder="••••••"
                        value={formData.pin}
                        onChange={(e) => handleInputChange("pin", e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {pinError && <p className="text-sm text-red-500">{pinError}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg"
                  >
                    Submit Application
                  </Button>
                </form>
              </div>
            )}
          </main>

          {/* Footer Buttons */}
          {currentStep < 3 && (
            <div className="px-8 py-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg"
              >
                Continue
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Preview</h3>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] rounded-lg p-6 text-white">
                <p className="text-white/70 text-sm mb-2">Total Loan Amount</p>
                <p className="text-4xl font-bold">K{formData.loanAmount.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">K{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You Receive</span>
                  <span className="font-bold text-primary text-lg">K{amountReceived.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-gray-600 font-semibold">Monthly Payment</span>
                  <span className="font-bold text-lg">K{monthlyPayment.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Duration:</strong> {formData.repaymentMonths} months<br/>
                  <strong>First Payment:</strong> {nextPaymentDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white sticky top-0 z-20">
          <div className="flex items-center h-14 px-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="flex-1 text-center font-semibold">Apply for Loan</h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Progress */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          <ProgressSteps totalSteps={3} currentStep={currentStep} />
          <div className="flex justify-between mt-2 text-xs">
            <span className={currentStep >= 1 ? "text-primary font-medium" : "text-gray-400"}>Terms</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : "text-gray-400"}>Summary</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : "text-gray-400"}>Confirm</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
          {/* Step 1: Loan Terms */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Define Your Loan</h2>
                <p className="text-sm text-gray-500">Select loan type and amount</p>
              </div>

              <div className="space-y-4">
                {/* Loan Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Loan Type</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                          formData.loanType === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 bg-white text-gray-700"
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
                  <select
                    value={formData.loanCategory}
                    onChange={(e) => handleInputChange("loanCategory", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
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
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Loan Amount (ZMW)</label>
                  <input
                    type="number"
                    placeholder="10,000"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange("loanAmount", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-bold"
                  />
                </div>

                {/* Repayment Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900">Repayment Period</label>
                    <span className="text-lg font-bold text-primary">{formData.repaymentMonths}m</span>
                  </div>
                  <input
                    type="range"
                    min={formData.loanType === "personal" ? 6 : 12}
                    max={formData.loanType === "personal" ? 36 : 60}
                    value={formData.repaymentMonths}
                    onChange={(e) => handleInputChange("repaymentMonths", parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Monthly Payment Preview */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-xs text-gray-600 mb-1">Est. Monthly Payment</p>
                  <p className="text-2xl font-bold text-primary">K{monthlyPayment.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Summary */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Loan Summary</h2>
                <p className="text-sm text-gray-500">Review your details</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] p-4">
                  <p className="text-white/70 text-xs">Loan Amount</p>
                  <p className="text-white text-2xl font-bold">K{formData.loanAmount.toLocaleString()}</p>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="font-semibold text-sm">{formData.loanType === "personal" ? "Personal" : "Business"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-semibold text-sm">{formData.repaymentMonths} months</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Service Fee</span>
                    <span className="font-semibold text-sm">K{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">You Receive</span>
                    <span className="font-bold text-primary text-sm">K{amountReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Monthly</span>
                    <span className="font-bold text-sm">K{monthlyPayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: PIN Verification */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm with PIN</h2>
                <p className="text-sm text-gray-600">Enter your PIN to submit</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Enter PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPin ? "text" : "password"}
                      placeholder="••••••"
                      value={formData.pin}
                      onChange={(e) => handleInputChange("pin", e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pinError && <p className="text-xs text-red-500">{pinError}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg text-sm"
                >
                  Submit Application
                </Button>
              </form>
            </div>
          )}
        </main>

        {/* Footer Buttons */}
        {currentStep < 3 && (
          <div className="px-4 py-4 border-t border-gray-200 bg-white flex gap-2">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-[#256339] text-white font-semibold py-2.5 rounded-lg text-sm"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
