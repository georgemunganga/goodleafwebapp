import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { userService } from "@/lib/api-service";
import { toast } from "sonner";

/**
 * Change PIN Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Current PIN verification
 * - New PIN setup
 */
export default function ChangePIN() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"current" | "new" | "success">("current");
  const [currentPIN, setCurrentPIN] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyCurrent = async () => {
    if (currentPIN.length !== 4) return;

    try {
      setIsVerifying(true);
      const response = await userService.verifyPIN(currentPIN);
      if (response?.verificationId) {
        setVerificationId(response.verificationId);
        setStep("new");
      } else {
        toast.error("Incorrect PIN. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to verify PIN:", err);
      toast.error(err.message || "Failed to verify PIN. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSetNewPIN = async () => {
    if (newPIN !== confirmPIN || newPIN.length !== 4) return;
    if (!verificationId) {
      toast.error("Verification expired. Please verify your current PIN again.");
      setStep("current");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await userService.setNewPIN(verificationId, newPIN, confirmPIN);
      const success = typeof response?.success === "boolean" ? response.success : true;
      if (!success) {
        toast.error(response?.message || "Failed to change PIN");
        return;
      }
      toast.success(response?.message || "PIN changed successfully");
      setStep("success");
    } catch (err: any) {
      console.error("Failed to change PIN:", err);
      // If verification expired, go back to current step
      if (err.message?.toLowerCase().includes("verification")) {
        toast.error("Verification expired. Please verify your current PIN again.");
        setStep("current");
        setVerificationId(null);
      } else {
        toast.error(err.message || "Failed to change PIN");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
          <div className="px-5 pt-6 pb-6 w-full">
            <h1 className="text-2xl font-bold">PIN Changed</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-6 w-full overflow-y-auto flex flex-col items-center justify-center">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PIN Changed Successfully</h2>
            <p className="text-base text-gray-600 mb-8">
              Your PIN has been updated. Use your new PIN for future logins.
            </p>
            <Button
              onClick={() => setLocation("/profile")}
              className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
            >
              Return to Profile
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "new") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
          <div className="px-5 pt-6 pb-6 w-full">
            <button
              onClick={() => setStep("current")}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-base font-semibold">Back</span>
            </button>
            <h1 className="text-2xl font-bold mb-1">Create New PIN</h1>
            <p className="text-white/70 text-base">Set a 4-digit PIN</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
          <div className="space-y-5">
            {/* New PIN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-base font-bold text-gray-900 mb-2">New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                value={newPIN}
                onChange={(e) => setNewPIN(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest"
              />
            </div>

            {/* Confirm PIN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-base font-bold text-gray-900 mb-2">Confirm PIN</label>
              <input
                type="password"
                inputMode="numeric"
                value={confirmPIN}
                onChange={(e) => setConfirmPIN(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Re-enter 4-digit PIN"
                maxLength={4}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest"
              />
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleSetNewPIN}
              disabled={newPIN.length !== 4 || confirmPIN.length !== 4 || newPIN !== confirmPIN || isSubmitting}
              className="w-full h-12 bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-bold text-base rounded-xl"
            >
              {isSubmitting ? "Updating..." : "Confirm New PIN"}
            </Button>
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
            onClick={() => setLocation("/profile")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-1">Change PIN</h1>
          <p className="text-white/70 text-base">Update your login PIN</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-5">
          {/* Current PIN */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-base font-bold text-gray-900 mb-2">Current PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={currentPIN}
              onChange={(e) => setCurrentPIN(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="Enter current 4-digit PIN"
              maxLength={4}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
            <p className="text-sm text-blue-700 font-medium">
              Your PIN must be 4 digits and should be unique for security.
            </p>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleVerifyCurrent}
            disabled={currentPIN.length !== 4 || isVerifying}
            className="w-full h-12 bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-bold text-base rounded-xl"
          >
            {isVerifying ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </main>
    </div>
  );
}
