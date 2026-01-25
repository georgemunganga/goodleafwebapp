import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Mail, Phone, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loading-spinner";
import { OTPVerificationModal } from "@/components/OTPVerificationModal";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";

/**
 * Login Page - Using plain useState + Zod validation
 * No React Hook Form - direct state management for reliability
 */

// Zod schemas for validation
const PinSchema = z
  .string()
  .min(4, "PIN must be 4 digits")
  .max(4, "PIN must be 4 digits")
  .regex(/^\d{4}$/, "PIN must contain only digits");

const LoginSchema = z.discriminatedUnion("identifierType", [
  z.object({
    identifierType: z.literal("phone"),
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{9}$/, "Phone number must be 9 digits"),
    pin: PinSchema,
  }),
  z.object({
    identifierType: z.literal("email"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
    pin: PinSchema,
  }),
]);

type FieldErrors = Record<string, string>;

const getEmailFromQuery = () => {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("email")?.trim() || "";
};

export default function Login() {
  const [, setLocation] = useLocation();
  const auth = useAuthContext();
  const hasPrefilledEmailRef = useRef(false);

  // Form state - simple useState
  const [identifierType, setIdentifierType] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+260");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  // UI state
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Prefill email from query params
  useEffect(() => {
    if (hasPrefilledEmailRef.current) return;
    const emailFromQuery = getEmailFromQuery();
    if (emailFromQuery) {
      hasPrefilledEmailRef.current = true;
      setIdentifierType("email");
      setEmail(emailFromQuery);
    }
  }, []);

  // Open OTP modal when otpId is set
  useEffect(() => {
    if (auth.otpId && !otpModalOpen) {
      setOtpModalOpen(true);
    }
  }, [auth.otpId, otpModalOpen]);

  // Clear field error when user types
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Validate form and return errors
  const validateForm = (): FieldErrors => {
    const result = LoginSchema.safeParse({
      identifierType,
      phoneNumber,
      countryCode,
      email,
      pin,
    });

    if (result.success) {
      return {};
    }

    const newErrors: FieldErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (typeof field === "string") {
        newErrors[field] = issue.message;
      }
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const loginPayload = identifierType === "phone"
        ? { phone: `${countryCode}${phoneNumber}`, pin }
        : { email, pin };

      const response = await auth.login(loginPayload);

      if (!response.success) {
        toast.error((response as any).message || "Login failed");
        return;
      }

      if ("otpId" in response && response.otpId) {
        setOtpModalOpen(true);
        toast.success(response.message || "OTP sent! Please check your email/SMS.");
        return;
      }

      if ("token" in response && response.token) {
        toast.success("Login successful!");
        setLocation("/dashboard");
      } else {
        toast.error((response as any).message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch identifier type
  const switchIdentifierType = (type: "phone" | "email") => {
    setIdentifierType(type);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:flex h-screen">
        {/* Left Side - Hero/Brand Section (Desktop only) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] flex-col items-center justify-center px-12 py-12 overflow-hidden flex-shrink-0">
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
                <p>Quick approvhal process</p>
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

        {/* Right Side - Form Container */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-12 py-12 overflow-y-auto">
          <div className="w-full max-w-sm lg:max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <img
                src="/images/logo-dark.svg"
                alt="Goodleaf"
                className="h-12 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900">Goodleaf Loans</h1>
              <p className="text-gray-600 text-sm mt-2">Fast, reliable loans</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identifier Type Toggle */}
              <div className="flex gap-2 lg:gap-3 p-1 bg-gray-100 rounded-lg lg:rounded-xl">
                <button
                  type="button"
                  onClick={() => switchIdentifierType("phone")}
                  className={`flex-1 py-2 lg:py-3 px-3 lg:px-4 rounded-lg font-medium text-sm transition-all ${
                    identifierType === "phone"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => switchIdentifierType("email")}
                  className={`flex-1 py-2 lg:py-3 px-3 lg:px-4 rounded-lg font-medium text-sm transition-all ${
                    identifierType === "email"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </button>
              </div>

              {/* Phone Number Input */}
              {identifierType === "phone" && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        clearError("countryCode");
                      }}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-[#2e7146]/20 outline-none bg-white text-sm lg:text-base"
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
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, "");
                        setPhoneNumber(value);
                        clearError("phoneNumber");
                      }}
                      placeholder="123456789"
                      inputMode="numeric"
                      maxLength={9}
                      autoComplete="tel"
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm lg:text-base ${
                        errors.phoneNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#2e7146] focus:ring-[#2e7146]/20"
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              )}

              {/* Email Input */}
              {identifierType === "email" && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none text-sm lg:text-base ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#2e7146] focus:ring-[#2e7146]/20"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              )}

              {/* PIN Input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => {
                      // Only allow digits, max 4
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setPin(value);
                      clearError("pin");
                    }}
                    placeholder="••••"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none pr-10 text-sm lg:text-base ${
                      errors.pin
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#2e7146] focus:ring-[#2e7146]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.pin && (
                  <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2e7146] hover:bg-[#1d4a2f] text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isLoading ? <ButtonLoader isLoading={true}>Signing In...</ButtonLoader> : "Sign In"}
              </Button>

              {/* Links */}
              <div className="text-center space-y-3">
                <a href="/forgot-pin" className="block text-sm text-[#2e7146] hover:underline">
                  Forgot PIN?
                </a>
                <p className="text-sm text-gray-600">
                  New user?{" "}
                  <a href="/apply" className="text-[#2e7146] font-semibold hover:underline">
                    Register here
                  </a>
                </p>
              </div>

              {/* Apply for Loan CTA */}
              <Button
                type="button"
                onClick={() => setLocation("/apply")}
                variant="outline"
                className="w-full border-[#2e7146] text-[#2e7146] hover:bg-[#2e7146]/5"
              >
                Apply for a Loan
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={otpModalOpen}
        onClose={() => {
          setOtpModalOpen(false);
          auth.cancelTwoFactor();
        }}
        onVerify={async (otp: string) => {
          const success = await auth.verifyOTP(otp);
          if (success) {
            setOtpModalOpen(false);
            setLocation("/dashboard");
          }
          return success;
        }}
        otpId={auth.otpId || ''}
        email={auth.loginEmail}
        phone={auth.loginPhone}
        onResendOTP={async () => {
          await auth.requestOTP(auth.loginEmail, auth.loginPhone);
        }}
      />
    </div>
  );
}
