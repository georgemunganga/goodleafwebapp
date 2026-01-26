import { useLocation } from "wouter";
import { ArrowLeft, Phone, Mail, CheckCircle, Lock } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api-service";
import { toast } from "sonner";

const RESEND_COOLDOWN_SECONDS = 10;
const PIN_LENGTH = 4;

type Step = "method" | "verify" | "reset" | "success";
type Method = "phone" | "email";

/**
 * Forgot PIN Page
 * Design: Desktop split-layout + Mobile responsive
 * - Phone/Email verification
 * - PIN reset
 * - Success confirmation
 */
export default function ForgotPIN() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method>("phone");
  // Phone number state (separate country code and number like Login page)
  const [countryCode, setCountryCode] = useState("+260");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Email state
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resendCountdown, setResendCountdown] = useState(0);

  // Clear field error when user types
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Validate phone number (9 digits)
  const validatePhone = useCallback((): boolean => {
    if (phoneNumber.length !== 9) {
      setFieldErrors({ phoneNumber: "Phone number must be 9 digits" });
      return false;
    }
    if (!/^\d{9}$/.test(phoneNumber)) {
      setFieldErrors({ phoneNumber: "Phone number must contain only digits" });
      return false;
    }
    return true;
  }, [phoneNumber]);

  // Validate email
  const validateEmail = useCallback((): boolean => {
    if (!email.trim()) {
      setFieldErrors({ email: "Email is required" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ email: "Invalid email address" });
      return false;
    }
    return true;
  }, [email]);

  const sendVerificationCode = useCallback(async () => {
    setFieldErrors({});
    setError(null);

    if (method === "phone") {
      if (!validatePhone()) return false;
    } else {
      if (!validateEmail()) return false;
    }

    setIsSubmitting(true);

    try {
      const fullPhone = method === "phone" ? `${countryCode}${phoneNumber}` : "";
      const response = await authService.forgotPIN({
        email: method === "email" ? email.trim() : "",
        phone: fullPhone,
      });
      setVerificationId(response.verificationId);
      setStep("verify");
      toast.success("Verification code sent.");
      setResendCountdown(RESEND_COOLDOWN_SECONDS);
      return true;
    } catch (err: any) {
      console.error("Failed to request reset code:", err);
      setError(err.message || "Failed to send verification code.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [method, countryCode, phoneNumber, email, validatePhone, validateEmail]);

  const handleSendCode = useCallback(() => {
    sendVerificationCode();
  }, [sendVerificationCode]);

  const handleResendCode = useCallback(() => {
    if (resendCountdown > 0) return;
    sendVerificationCode();
  }, [resendCountdown, sendVerificationCode]);

  const isResendDisabled = resendCountdown > 0 || isSubmitting;
  const resendLabel = resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend";

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timerId = setTimeout(() => {
      setResendCountdown(prev => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearTimeout(timerId);
  }, [resendCountdown]);

  useEffect(() => {
    if (step !== "verify" && resendCountdown !== 0) {
      setResendCountdown(0);
    }
  }, [step, resendCountdown]);

  const handleVerifyCode = useCallback(async () => {
    if (verificationCode.length !== 6 || isVerifyingOtp) return;
    if (!verificationId) {
      setError("Missing verification session. Please resend the code.");
      return;
    }
    setError(null);
    setIsVerifyingOtp(true);
    try {
      await authService.verifyOTP({ otpId: verificationId, otp: verificationCode });
      setStep("reset");
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.message || "Invalid verification code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [verificationCode, verificationId, isVerifyingOtp]);

  const handleResetPIN = async () => {
    if (newPIN !== confirmPIN || newPIN.length !== PIN_LENGTH) return;
    if (!verificationId) {
      setError("Missing verification session. Please resend the code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.resetPIN({
        verificationId,
        newPin: newPIN,
        confirmPin: confirmPIN,
      });
      if (response.success) {
        setStep("success");
      } else {
        setError(response.message || "Failed to reset PIN.");
      }
    } catch (err: any) {
      console.error("Failed to reset PIN:", err);
      setError(err.message || "Failed to reset PIN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state - both desktop and mobile
  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">PIN Reset Successful</h2>
        <p className="text-gray-600 text-center mb-8 max-w-sm">
          Your PIN has been successfully reset. You can now log in with your new PIN.
        </p>
        <Button
          onClick={() => setLocation("/login")}
          className="w-full max-w-xs h-12 bg-primary hover:bg-[#256339] text-white font-bold rounded-xl"
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout - Split screen */}
      <div className="hidden lg:flex h-screen">
        {/* Left Side - Hero/Brand Section */}
        <div className="w-1/2 bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] flex flex-col items-center justify-center px-12 py-12 overflow-hidden flex-shrink-0">
          <div className="max-w-md text-center">
            <div className="mb-12">
              <img 
                src="/images/logo-white.svg" 
                alt="Goodleaf" 
                className="h-16 mx-auto mb-8"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Goodleaf Loans
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Fast, reliable loans for your financial needs
            </p>
            <div className="space-y-4 text-white/70">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <p>Quick approval process</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <p>Competitive interest rates</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <p>Flexible repayment terms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - PIN Reset Form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-12 py-12 overflow-y-auto overflow-x-hidden flex-shrink-0">
          <div className="w-full max-w-md">
            <button
              onClick={() => setLocation("/login")}
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your PIN</h2>
              <p className="text-gray-600">Verify your identity to create a new PIN</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Step 1: Select Method */}
            {step === "method" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Verification Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "phone", label: "Phone", icon: Phone },
                      { value: "email", label: "Email", icon: Mail }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setMethod(option.value as Method)}
                          className={`p-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                            method === option.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Phone Number Input */}
                {method === "phone" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                      >
                        <option value="+260">+260</option>
                        <option value="+27">+27</option>
                        <option value="+263">+263</option>
                        <option value="+265">+265</option>
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setPhoneNumber(value);
                          clearFieldError("phoneNumber");
                        }}
                        placeholder="123456789"
                        inputMode="numeric"
                        maxLength={9}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                          fieldErrors.phoneNumber
                            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-primary focus:ring-primary/20"
                        }`}
                      />
                    </div>
                    {fieldErrors.phoneNumber && (
                      <p className="text-red-500 text-xs">{fieldErrors.phoneNumber}</p>
                    )}
                  </div>
                )}

                {/* Email Input */}
                {method === "email" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-primary focus:ring-primary/20"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs">{fieldErrors.email}</p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSendCode}
                  disabled={(method === "phone" ? !phoneNumber : !email) || isSubmitting}
                  className="w-full bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            )}

            {/* Step 2: Verify Code */}
            {step === "verify" && (
              <div className="space-y-6 animate-in fade-in">
                <button
                  onClick={() => setStep("method")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Verify Identity</h3>
                  <p className="text-gray-600 text-sm">Enter the 6-digit code sent to your {method}</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Verification Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    Didn't receive the code?
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResendDisabled}
                      className={`text-primary hover:underline transition ${isResendDisabled ? "opacity-50 cursor-not-allowed hover:underline" : ""}`}
                    >
                      {resendLabel}
                    </button>
                  </p>
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || isVerifyingOtp}
                  className="w-full bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            )}

            {/* Step 3: Reset PIN */}
            {step === "reset" && (
              <div className="space-y-6 animate-in fade-in">
                <button
                  onClick={() => setStep("verify")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Create New PIN</h3>
                  <p className="text-gray-600 text-sm">Set a 4-digit PIN for your account</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">New PIN</label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={newPIN}
                    onChange={(e) => setNewPIN(e.target.value.slice(0, PIN_LENGTH))}
                    maxLength={PIN_LENGTH}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Confirm PIN</label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={confirmPIN}
                    onChange={(e) => setConfirmPIN(e.target.value.slice(0, PIN_LENGTH))}
                    maxLength={PIN_LENGTH}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest"
                  />
                </div>

                {newPIN && confirmPIN && newPIN !== confirmPIN && (
                  <p className="text-sm text-red-500">PINs do not match</p>
                )}

                <Button
                  onClick={handleResetPIN}
                  disabled={newPIN.length !== PIN_LENGTH || confirmPIN.length !== PIN_LENGTH || newPIN !== confirmPIN || isSubmitting}
                  className="w-full bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
                >
                  {isSubmitting ? "Resetting..." : "Reset PIN"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50 flex flex-col pb-24">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white px-5 py-6">
          <button
            onClick={() => step === "method" ? setLocation("/login") : setStep("method")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{step === "method" ? "Back to Login" : "Back"}</span>
          </button>
          <h1 className="text-2xl font-bold">Reset Your PIN</h1>
        </header>

        {/* Content */}
        <main className="flex-1 px-5 py-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {step === "method" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Verify Your Identity</h2>
                <p className="text-gray-600">Choose how you want to verify your account</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Verification Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "phone", label: "Phone", icon: Phone },
                    { value: "email", label: "Email", icon: Mail }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMethod(option.value as Method)}
                        className={`p-4 rounded-xl border-2 font-semibold transition-all flex flex-col items-center justify-center gap-2 ${
                          method === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number Input */}
              {method === "phone" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm"
                    >
                      <option value="+260">+260</option>
                      <option value="+27">+27</option>
                      <option value="+263">+263</option>
                      <option value="+265">+265</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setPhoneNumber(value);
                        clearFieldError("phoneNumber");
                      }}
                      placeholder="123456789"
                      inputMode="numeric"
                      maxLength={9}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm ${
                        fieldErrors.phoneNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-primary focus:ring-primary/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="text-red-500 text-xs">{fieldErrors.phoneNumber}</p>
                  )}
                </div>
              )}

              {/* Email Input */}
              {method === "email" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm ${
                      fieldErrors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs">{fieldErrors.email}</p>
                  )}
                </div>
              )}

              <Button
                onClick={handleSendCode}
                disabled={(method === "phone" ? !phoneNumber : !email) || isSubmitting}
                className="w-full bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
              >
                {isSubmitting ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Enter Code</h2>
                <p className="text-gray-600">We sent a 6-digit code to your {method}</p>
              </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Verification Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    Didn't receive the code?
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResendDisabled}
                      className={`text-primary hover:underline transition ${isResendDisabled ? "opacity-50 cursor-not-allowed hover:underline" : ""}`}
                    >
                      {resendLabel}
                    </button>
                  </p>
                </div>

              <Button
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || isVerifyingOtp}
                className="w-full bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          )}

          {step === "reset" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Create New PIN</h2>
                <p className="text-gray-600">Set a 4-digit PIN for your account</p>
              </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">New PIN</label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={newPIN}
                    onChange={(e) => setNewPIN(e.target.value.slice(0, PIN_LENGTH))}
                    maxLength={PIN_LENGTH}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Confirm PIN</label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={confirmPIN}
                    onChange={(e) => setConfirmPIN(e.target.value.slice(0, PIN_LENGTH))}
                    maxLength={PIN_LENGTH}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest"
                  />
                </div>

              {newPIN && confirmPIN && newPIN !== confirmPIN && (
                <p className="text-sm text-red-500">PINs do not match</p>
              )}

              <Button
                onClick={handleResetPIN}
                disabled={newPIN.length !== PIN_LENGTH || confirmPIN.length !== PIN_LENGTH || newPIN !== confirmPIN || isSubmitting}
                className="w-full bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
              >
                {isSubmitting ? "Resetting..." : "Reset PIN"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
