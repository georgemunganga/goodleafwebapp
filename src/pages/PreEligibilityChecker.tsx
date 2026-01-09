import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, AlertCircle, XCircle, ChevronLeft } from "lucide-react";
import { useEligibility } from "@/hooks/useEligibility";
import { toast } from "sonner";

type EligibilityResult = "likely" | "potential" | "unlikely" | null;

/**
 * Pre-Eligibility Checker Page
 * Design: Mobile-native banking app style
 * - Quick assessment tool
 * - Real-time result display
 */
export default function PreEligibilityChecker() {
  const [, setLocation] = useLocation();
  const { checkEligibility, loading } = useEligibility();
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingDebt, setExistingDebt] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      const eligibilityData = {
        income: parseFloat(monthlyIncome) || 0,
        expenses: 0, // Could be calculated based on other inputs
        creditScore: parseInt(creditScore) || 600,
        existingDebt: parseFloat(existingDebt) || 0,
        employmentYears: employmentStatus ? 2 : 0
      };

      const response = await checkEligibility(eligibilityData);

      // Process the response to determine result
      if (response.eligible) {
        if (response.interestRate <= 7) {
          setResult({ ...response, type: "likely" });
        } else if (response.interestRate <= 10) {
          setResult({ ...response, type: "potential" });
        } else {
          setResult({ ...response, type: "potential" });
        }
      } else {
        setResult({ ...response, type: "unlikely" });
      }
    } catch (error) {
      console.error("Eligibility check error:", error);
      toast.error("Failed to check eligibility. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const getResultConfig = (res: EligibilityResult) => {
    switch (res) {
      case "likely":
        return {
          icon: CheckCircle2,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          title: "Likely Eligible",
          titleColor: "text-green-700",
          description: "Great news! You're likely to qualify for a loan.",
          cta: "Start Application"
        };
      case "potential":
        return {
          icon: AlertCircle,
          bgColor: "bg-amber-50",
          iconColor: "text-amber-600",
          title: "Potentially Eligible",
          titleColor: "text-amber-700",
          description: "You may qualify. Complete the full application to proceed.",
          cta: "Start Application"
        };
      case "unlikely":
        return {
          icon: XCircle,
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          title: "Unlikely to Qualify",
          titleColor: "text-red-700",
          description: "Based on your info, you may not currently qualify. You can still apply.",
          cta: "Apply Anyway"
        };
      default:
        return null;
    }
  };

  const resultConfig = result ? getResultConfig(result) : null;
  const ResultIcon = resultConfig?.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => setLocation("/dashboard")}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="flex-1 text-center font-bold text-slate-900">
            Check Eligibility
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-8">
        {!result ? (
          <form onSubmit={handleCheckEligibility} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Quick Assessment
              </h2>
              <p className="text-sm text-slate-600">
                Get an instant eligibility check in under a minute
              </p>
            </div>

            {/* Employment Status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employment Status
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm bg-white"
                required
              >
                <option value="">Select status</option>
                <option value="employed">Civil Servant</option>
                <option value="private">Private Sector</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            {/* Monthly Income */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monthly Income (ZMW)
              </label>
              <Input
                type="number"
                placeholder="e.g., 10000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                required
              />
            </div>

            {/* Existing Debt */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monthly Debt Payments (ZMW)
              </label>
              <Input
                type="number"
                placeholder="e.g., 2000"
                value={existingDebt}
                onChange={(e) => setExistingDebt(e.target.value)}
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                Include all existing loan payments
              </p>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                This is a preliminary check. Final eligibility is determined after full application review.
              </p>
            </div>

            {/* Check Button */}
            <Button
              type="submit"
              disabled={isChecking || !employmentStatus || !monthlyIncome || !existingDebt}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold h-12"
            >
              {isChecking ? "Checking..." : "Check Eligibility"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* Result Card */}
            {resultConfig && ResultIcon && (
              <div className={`${resultConfig.bgColor} rounded-2xl p-6 text-center`}>
                <ResultIcon className={`w-12 h-12 ${resultConfig.iconColor} mx-auto mb-3`} />
                <h2 className={`text-xl font-bold ${resultConfig.titleColor} mb-2`}>
                  {resultConfig.title}
                </h2>
                <p className="text-sm text-slate-600">
                  {resultConfig.description}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Your Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Monthly Income</span>
                  <span className="font-semibold text-slate-900">K{parseFloat(monthlyIncome).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Monthly Debt</span>
                  <span className="font-semibold text-slate-900">K{parseFloat(existingDebt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm text-slate-500">Debt-to-Income Ratio</span>
                  <span className="font-bold text-primary">
                    {monthlyIncome ? ((parseFloat(existingDebt) / parseFloat(monthlyIncome)) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => setLocation("/apply")}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12"
              >
                {resultConfig?.cta}
              </Button>
              <Button
                onClick={() => setResult(null)}
                variant="outline"
                className="w-full rounded-xl border-2 border-slate-200 text-slate-700 font-semibold h-12"
              >
                Check Again
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
