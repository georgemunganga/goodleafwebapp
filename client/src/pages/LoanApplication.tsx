import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Step = 1 | 2 | 3;
type LoanType = "personal" | "business";
type LoanCategory = "civil-servant" | "private" | "collateral" | "farmer";

interface ApplicationData {
  loanType: LoanType;
  loanCategory: LoanCategory;
  institutionName?: string;
  loanAmount: number;
  repaymentMonths: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pin: string;
  confirmPin: string;
}

/**
 * Loan Application - 3-Step Wizard
 * Design: Modern Financial Minimalism with Organic Warmth
 * - Step 1: Loan Terms
 * - Step 2: Loan Summary
 * - Step 3: Credentials/Registration
 */
export default function LoanApplication() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<ApplicationData>({
    loanType: "personal",
    loanCategory: "civil-servant",
    loanAmount: 10000,
    repaymentMonths: 12,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pin: "",
    confirmPin: ""
  });

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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pin !== formData.confirmPin) {
      alert("PINs do not match");
      return;
    }
    // Submit application
    setLocation("/kyc");
  };

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-10 md:h-12"
            />
          </button>
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() => setLocation("/login")}
              className="font-semibold text-primary hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step <= currentStep
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        step < currentStep ? "bg-primary" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Loan Terms</span>
              <span>Summary</span>
              <span>Create Account</span>
            </div>
          </div>

          {/* Step 1: Loan Terms */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Define Your Loan Terms
                </h1>
                <p className="text-slate-600">
                  Tell us about the loan you need. We'll calculate your monthly repayment instantly.
                </p>
              </div>

              <form className="space-y-6">
                {/* Loan Type */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Loan Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "personal", label: "Personal Loan" },
                      { value: "business", label: "Business Loan" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleInputChange("loanType", option.value);
                          handleInputChange("loanCategory", option.value === "personal" ? "civil-servant" : "collateral");
                        }}
                        className={`p-4 rounded-2xl border-2 font-medium transition-all ${
                          formData.loanType === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 bg-white text-slate-700 hover:border-primary/30"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Category */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    {formData.loanType === "personal" ? "Employment Type" : "Collateral Type"}
                  </label>
                  <select
                    value={formData.loanCategory}
                    onChange={(e) => handleInputChange("loanCategory", e.target.value)}
                    className="w-full px-4 py-3 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                  >
                    {formData.loanType === "personal" ? (
                      <>
                        <option value="civil-servant">Civil Servant (GRZ)</option>
                        <option value="private">Private Institution Employee</option>
                      </>
                    ) : (
                      <>
                        <option value="collateral">Vehicle/Property Collateral</option>
                        <option value="farmer">Farmer Loan</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Institution Name (if Private) */}
                {formData.loanType === "personal" && formData.loanCategory === "private" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Institution Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Zamtel, ZESCO"
                      value={formData.institutionName || ""}
                      onChange={(e) => handleInputChange("institutionName", e.target.value)}
                      className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                    />
                  </div>
                )}

                {/* Loan Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Loan Amount (ZMW)
                  </label>
                  <Input
                    type="number"
                    placeholder="10,000"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange("loanAmount", parseFloat(e.target.value) || 0)}
                    className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                  />
                  <p className="text-xs text-slate-500">
                    {formData.loanType === "personal" ? "Min: K5,000 - Max: K50,000" : "Min: K10,000 - Max: K200,000"}
                  </p>
                </div>

                {/* Repayment Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Repayment Duration (Months)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={formData.loanType === "personal" ? 6 : 12}
                      max={formData.loanType === "personal" ? 36 : 60}
                      value={formData.repaymentMonths}
                      onChange={(e) => handleInputChange("repaymentMonths", parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-lg font-bold text-primary min-w-fit">
                      {formData.repaymentMonths} months
                    </span>
                  </div>
                </div>
              </form>

              {/* Real-time Summary Card */}
              <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Estimated Monthly Repayment
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Monthly Payment</p>
                    <p className="text-2xl font-bold text-primary">
                      K{monthlyPayment.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Next Payment</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {nextPaymentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 h-12"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 h-12 flex items-center justify-center gap-2"
                >
                  Next: Summary <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Loan Summary */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Review Your Loan Summary
                </h1>
                <p className="text-slate-600">
                  Please review the details below before proceeding to account creation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Loan Amount</p>
                    <p className="text-xl font-bold text-slate-900">K{formData.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Tenure</p>
                    <p className="text-xl font-bold text-slate-900">{formData.repaymentMonths} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Service Fee</p>
                    <p className="text-xl font-bold text-slate-900">K{serviceFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Amount You Receive</p>
                    <p className="text-xl font-bold text-secondary">K{amountReceived.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Monthly Repayment</p>
                    <p className="text-xl font-bold text-primary">K{monthlyPayment.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Next Payment</p>
                    <p className="text-xl font-bold text-slate-900">
                      {nextPaymentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 h-12 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 h-12 flex items-center justify-center gap-2"
                >
                  Next: Create Account <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Credentials/Registration */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Create Your Account
                </h1>
                <p className="text-slate-600">
                  Complete your registration to submit your loan application.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      First Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+260 123 456 789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Create PIN (4-6 digits)
                    </label>
                    <Input
                      type="password"
                      placeholder="••••"
                      value={formData.pin}
                      onChange={(e) => handleInputChange("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Confirm PIN
                    </label>
                    <Input
                      type="password"
                      placeholder="••••"
                      value={formData.confirmPin}
                      onChange={(e) => handleInputChange("confirmPin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-700">
                    I agree to the Terms & Conditions and Privacy Policy
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-3 h-12 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 h-12"
                  >
                    Submit Application & Register
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
