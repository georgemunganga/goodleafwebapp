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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyCurrent = () => {
    if (currentPIN.length === 6) {
      setStep("new");
    }
  };

  const handleSetNewPIN = async () => {
    if (newPIN !== confirmPIN || newPIN.length !== 6) return;

    try {
      setIsSubmitting(true);
      const response = await userService.changePIN(currentPIN, newPIN);
      if (response.success) {
        toast.success(response.message || "PIN changed successfully");
        setStep("success");
      } else {
        toast.error(response.message || "Failed to change PIN");
      }
    } catch (err: any) {
      console.error("Failed to change PIN:", err);
      toast.error(err.message || "Failed to change PIN");
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
            <p className="text-white/70 text-base">Set a 6-digit PIN</p>
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
                value={newPIN}
                onChange={(e) => setNewPIN(e.target.value.slice(0, 6))}
                placeholder="Enter 6-digit PIN"
                maxLength={6}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest"
              />
            </div>

            {/* Confirm PIN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-base font-bold text-gray-900 mb-2">Confirm PIN</label>
              <input
                type="password"
                value={confirmPIN}
                onChange={(e) => setConfirmPIN(e.target.value.slice(0, 6))}
                placeholder="Re-enter 6-digit PIN"
                maxLength={6}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest"
              />
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleSetNewPIN}
              disabled={newPIN.length !== 6 || confirmPIN.length !== 6 || newPIN !== confirmPIN || isSubmitting}
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
              value={currentPIN}
              onChange={(e) => setCurrentPIN(e.target.value.slice(0, 6))}
              placeholder="Enter current 6-digit PIN"
              maxLength={6}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
            <p className="text-sm text-blue-700 font-medium">
              Your PIN must be 6 digits and should be unique for security.
            </p>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleVerifyCurrent}
            disabled={currentPIN.length !== 6}
            className="w-full h-12 bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-bold text-base rounded-xl"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
