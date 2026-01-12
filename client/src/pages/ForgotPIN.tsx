import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Phone, Mail, CheckCircle } from "lucide-react";
import { useState } from "react";

/**
 * Forgot PIN Page
 * Design: Mobile-native banking app style with consistent sizing
 * - Phone/Email verification
 * - PIN reset
 */
export default function ForgotPIN() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"method" | "verify" | "reset" | "success">("method");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const handleSendCode = () => {
    setStep("verify");
  };

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      setStep("reset");
    }
  };

  const handleResetPIN = () => {
    if (newPIN === confirmPIN && newPIN.length === 6) {
      setStep("success");
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
          <div className="px-5 pt-6 pb-6 w-full">
            <h1 className="text-2xl font-bold">PIN Reset</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-6 w-full overflow-y-auto flex flex-col items-center justify-center">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PIN Reset Successful</h2>
            <p className="text-base text-gray-600 mb-8">
              Your PIN has been successfully reset. You can now log in with your new PIN.
            </p>
            <Button
              onClick={() => setLocation("/login")}
              className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
            >
              Return to Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
          <div className="px-5 pt-6 pb-6 w-full">
            <button
              onClick={() => setStep("verify")}
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

            {/* Reset Button */}
            <Button
              onClick={handleResetPIN}
              disabled={newPIN.length !== 6 || confirmPIN.length !== 6 || newPIN !== confirmPIN}
              className="w-full h-12 bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-bold text-base rounded-xl"
            >
              Reset PIN
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
          <div className="px-5 pt-6 pb-6 w-full">
            <button
              onClick={() => setStep("method")}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-base font-semibold">Back</span>
            </button>
            <h1 className="text-2xl font-bold mb-1">Verify Identity</h1>
            <p className="text-white/70 text-base">Enter the code sent to your {method}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
          <div className="space-y-5">
            {/* Verification Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-base font-bold text-gray-900 mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base tracking-widest text-center text-2xl"
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
              className="w-full h-12 bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-bold text-base rounded-xl"
            >
              Verify Code
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <button className="text-primary font-bold text-base hover:underline mt-1">
                Resend Code
              </button>
            </div>
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
            onClick={() => setLocation("/login")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-1">Reset Your PIN</h1>
          <p className="text-white/70 text-base">Choose how to verify your identity</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-5">
          {/* Phone Option */}
          <button
            onClick={() => {
              setMethod("phone");
              handleSendCode();
            }}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
              method === "phone"
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-base text-gray-900">Via Phone</p>
                <p className="text-sm text-gray-500">+260 123 456 789</p>
              </div>
            </div>
          </button>

          {/* Email Option */}
          <button
            onClick={() => {
              setMethod("email");
              handleSendCode();
            }}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
              method === "email"
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-base text-gray-900">Via Email</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>
          </button>

          {/* Continue Button */}
          <Button
            onClick={handleSendCode}
            className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl mt-6"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
