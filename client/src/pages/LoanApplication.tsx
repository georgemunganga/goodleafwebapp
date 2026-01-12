import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { ButtonLoader } from "@/components/ui/loading-spinner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setLocation("/");
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
        <div className="w-1/2 flex flex-col border-r border-gray-200 overflow-hidden flex-shrink-0">
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
          <main className="flex-1 px-8 py-6 overflow-y-auto overflow-x-hidden">
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
                    <label className="block text-sm font-semibold text-gray-900">Loan Category</label>
                    <select
                      value={formData.loanCategory}
                      onChange={(e) => handleInputChange("loanCategory", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {formData.loanType === "personal" ? (
                        <>
                          <option value="civil-servant">Civil Servant</option>
                          <option value="private">Private Sector</option>
                        </>
                      ) : (
                        <>
                          <option value="collateral">Collateral-Based</option>
                          <option value="farmer">Farmer</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Institution Name (if business) */}
                  {formData.loanType === "business" && (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900">Institution/Business Name</label>
                      <input
                        type="text"
                        placeholder="Enter institution name"
                        value={formData.institutionName || ""}
                        onChange={(e) => handleInputChange("institutionName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  )}

                  {/* Loan Amount */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">Loan Amount (K)</label>
                    <input
                      type="number"
                      min="5000"
                      max="50000"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <p className="text-xs text-gray-500">Range: K5,000 - K50,000</p>
                  </div>

                  {/* Repayment Period */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">Repayment Period (Months)</label>
                    <input
                      type="number"
                      min="6"
                      max="60"
                      value={formData.repaymentMonths}
                      onChange={(e) => handleInputChange("repaymentMonths", Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <p className="text-xs text-gray-500">Range: 6 - 60 months</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Loan Summary */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Loan</h2>
                  <p className="text-gray-600">Confirm the details below</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Type</span>
                      <span className="font-semibold text-gray-900 capitalize">{formData.loanType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-semibold text-gray-900 capitalize">{formData.loanCategory}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Loan Amount</span>
                      <span className="font-semibold text-gray-900">K{formData.loanAmount.toLocaleString()}</span>
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
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg"
                  >
                    <ButtonLoader isLoading={isSubmitting} loadingText="Submitting...">
                      Submit Application
                    </ButtonLoader>
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
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center overflow-y-auto overflow-x-hidden flex-shrink-0">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Preview</h3>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] rounded-lg p-6 text-white">
                <p className="text-white/70 text-sm mb-2">Total Loan Amount</p>
                <p className="text-4xl font-bold">K{formData.loanAmount.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm mb-1">Service Fee</p>
                  <p className="text-xl font-bold text-gray-900">K{serviceFee.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm mb-1">You Receive</p>
                  <p className="text-xl font-bold text-primary">K{amountReceived.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Monthly Payment</span>
                  <span className="font-bold text-gray-900">K{monthlyPayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-bold text-gray-900">{formData.repaymentMonths} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">First Payment</span>
                  <span className="font-bold text-gray-900">{nextPaymentDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50 flex flex-col pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white px-5 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Apply for Loan</h1>
              <p className="text-white/70 text-sm">Step {currentStep} of 3</p>
            </div>
          </div>
          <ProgressSteps totalSteps={3} currentStep={currentStep} />
        </header>

        {/* Content */}
        <main className="flex-1 px-5 py-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-900">Define Your Loan</h2>
              
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
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Loan Category</label>
                <select
                  value={formData.loanCategory}
                  onChange={(e) => handleInputChange("loanCategory", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  {formData.loanType === "personal" ? (
                    <>
                      <option value="civil-servant">Civil Servant</option>
                      <option value="private">Private Sector</option>
                    </>
                  ) : (
                    <>
                      <option value="collateral">Collateral-Based</option>
                      <option value="farmer">Farmer</option>
                    </>
                  )}
                </select>
              </div>

              {formData.loanType === "business" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Institution/Business Name</label>
                  <input
                    type="text"
                    placeholder="Enter institution name"
                    value={formData.institutionName || ""}
                    onChange={(e) => handleInputChange("institutionName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Loan Amount (K)</label>
                <input
                  type="number"
                  min="5000"
                  max="50000"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <p className="text-xs text-gray-500">Range: K5,000 - K50,000</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Repayment Period (Months)</label>
                <input
                  type="number"
                  min="6"
                  max="60"
                  value={formData.repaymentMonths}
                  onChange={(e) => handleInputChange("repaymentMonths", Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <p className="text-xs text-gray-500">Range: 6 - 60 months</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-900">Review Your Loan</h2>
              
              <div className="bg-white rounded-xl p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{formData.loanType}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-gray-900">K{formData.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Service Fee (5%)</span>
                  <span className="font-semibold text-gray-900">K{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount You Receive</span>
                  <span className="font-bold text-primary">K{amountReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Monthly Payment</span>
                  <span className="font-bold text-gray-900">K{monthlyPayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">First Payment Due</span>
                  <span className="font-semibold text-gray-900">{nextPaymentDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
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
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg"
                >
                  <ButtonLoader isLoading={isSubmitting} loadingText="Submitting...">
                    Submit Application
                  </ButtonLoader>
                </Button>
              </form>
            </div>
          )}
        </main>

        {/* Footer Buttons */}
        {currentStep < 3 && (
          <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
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
    </div>
  );
}
