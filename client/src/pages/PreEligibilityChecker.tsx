import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

type EligibilityResult = "likely" | "potential" | "unlikely" | null;

/**
 * Pre-Eligibility Checker Page
 * Design: Modern Financial Minimalism with Organic Warmth
 * - Quick assessment tool
 * - Real-time result display
 * - CTA to full application
 */
export default function PreEligibilityChecker() {
  const [, setLocation] = useLocation();
  const [loanType, setLoanType] = useState<"personal" | "business">("personal");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingDebt, setExistingDebt] = useState("");
  const [result, setResult] = useState<EligibilityResult>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    // Simulate eligibility check
    setTimeout(() => {
      const income = parseFloat(monthlyIncome) || 0;
      const debt = parseFloat(existingDebt) || 0;
      const debtToIncomeRatio = income > 0 ? debt / income : 1;

      if (income > 5000 && debtToIncomeRatio < 0.3) {
        setResult("likely");
      } else if (income > 3000 && debtToIncomeRatio < 0.5) {
        setResult("potential");
      } else {
        setResult("unlikely");
      }
      setIsChecking(false);
    }, 1000);
  };

  const getResultConfig = (res: EligibilityResult) => {
    switch (res) {
      case "likely":
        return {
          icon: CheckCircle2,
          color: "text-secondary",
          bgColor: "bg-secondary/10",
          borderColor: "border-secondary/30",
          title: "Likely Eligible",
          description: "Great news! You're likely to qualify for a loan. Proceed with the full application.",
          cta: "Start Application"
        };
      case "potential":
        return {
          icon: AlertCircle,
          color: "text-accent",
          bgColor: "bg-accent/10",
          borderColor: "border-accent/30",
          title: "Potentially Eligible",
          description: "You may qualify, but additional review might be required. Complete the full application to proceed.",
          cta: "Start Application"
        };
      case "unlikely":
        return {
          icon: XCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          title: "Unlikely to Qualify",
          description: "Based on the information provided, you may not currently qualify. However, you can still apply and our team will review your case.",
          cta: "Apply Anyway"
        };
      default:
        return null;
    }
  };

  const resultConfig = result ? getResultConfig(result) : null;
  const ResultIcon = resultConfig?.icon;

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/login")}
            className="rounded-full"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Check Your Eligibility
            </h1>
            <p className="text-lg text-slate-600">
              Get an instant assessment of your loan eligibility in less than a minute
            </p>
          </div>

          <form onSubmit={handleCheckEligibility} className="space-y-8">
            {/* Loan Type Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-900">
                What type of loan are you interested in?
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "personal", label: "Personal Loan" },
                  { value: "business", label: "Business Loan" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLoanType(option.value as "personal" | "business")}
                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${
                      loanType === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-white text-slate-700 hover:border-primary/30"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Employment Status
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 bg-white"
                required
              >
                <option value="">Select your employment status</option>
                <option value="employed">Employed (Civil Servant)</option>
                <option value="private">Employed (Private Institution)</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            {/* Monthly Income */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Estimated Monthly Income (ZMW)
              </label>
              <Input
                type="number"
                placeholder="e.g., 10,000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                required
              />
            </div>

            {/* Existing Debt */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Total Monthly Debt Payments (ZMW)
              </label>
              <Input
                type="number"
                placeholder="e.g., 2,000"
                value={existingDebt}
                onChange={(e) => setExistingDebt(e.target.value)}
                className="h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                required
              />
            </div>

            {/* Check Button */}
            <Button
              type="submit"
              disabled={isChecking || !employmentStatus || !monthlyIncome || !existingDebt}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-lg h-12"
            >
              {isChecking ? "Checking..." : "Check Eligibility"}
            </Button>
          </form>

          {/* Result Display */}
          {resultConfig && ResultIcon && (
            <div className={`mt-12 p-8 rounded-3xl border-2 ${resultConfig.bgColor} ${resultConfig.borderColor} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
              <div className="flex items-start gap-4 mb-6">
                <ResultIcon className={`w-8 h-8 ${resultConfig.color} flex-shrink-0 mt-1`} />
                <div>
                  <h2 className={`text-2xl font-bold ${resultConfig.color} mb-2`}>
                    {resultConfig.title}
                  </h2>
                  <p className="text-slate-700">
                    {resultConfig.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-white rounded-2xl">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1">Monthly Income</p>
                  <p className="font-bold text-slate-900">K{parseFloat(monthlyIncome).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1">Monthly Debt</p>
                  <p className="font-bold text-slate-900">K{parseFloat(existingDebt).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1">Debt-to-Income</p>
                  <p className="font-bold text-slate-900">
                    {monthlyIncome ? ((parseFloat(existingDebt) / parseFloat(monthlyIncome)) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/apply")}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-lg h-12"
              >
                {resultConfig.cta}
              </Button>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> This eligibility check is non-binding and provides an initial assessment only. Your final eligibility will be determined after a complete review of your application and supporting documents.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
