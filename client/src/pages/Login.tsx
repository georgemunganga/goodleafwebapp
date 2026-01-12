import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loading-spinner";
import { FormField, FormFieldGroup } from "@/components/FormField";
import { toast } from "sonner";
import { authService } from "@/lib/api-service";

/**
 * Login Page
 * Design: Responsive desktop and mobile layouts with React Hook Form + Zod validation
 * - Desktop: Split layout with hero on left, form on right
 * - Mobile: Full-width centered form
 * - Email/Phone toggle
 * - PIN input with visibility toggle
 * - Real-time validation with Zod schemas
 */

// Validation schemas for different login methods
const PhoneLoginSchema = z.object({
  phoneNumber: z.string()
    .regex(/^\d{9}$/, "Phone number must be 9 digits")
    .min(1, "Phone number is required"),
  countryCode: z.string(),
  pin: z.string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only digits"),
});

const EmailLoginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  pin: z.string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only digits"),
});

type PhoneLoginForm = z.infer<typeof PhoneLoginSchema>;
type EmailLoginForm = z.infer<typeof EmailLoginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("phone");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Phone login form
  const phoneForm = useForm<PhoneLoginForm>({
    resolver: zodResolver(PhoneLoginSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      phoneNumber: "",
      countryCode: "+260",
      pin: "",
    },
  });

  // Email login form
  const emailForm = useForm<EmailLoginForm>({
    resolver: zodResolver(EmailLoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      pin: "",
    },
  });

  const currentForm = identifierType === "phone" ? phoneForm : emailForm;
  const { register: phoneRegister } = phoneForm;
  const { register: emailRegister } = emailForm;

  const handleLogin = async (data: PhoneLoginForm | EmailLoginForm) => {
    setIsLoading(true);
    try {
      // Prepare login payload based on identifier type
      const loginPayload = identifierType === "phone"
        ? {
            phoneNumber: `${(data as PhoneLoginForm).countryCode}${(data as PhoneLoginForm).phoneNumber}`,
            pin: data.pin,
          }
        : {
            email: (data as EmailLoginForm).email,
            pin: data.pin,
          };

      // Call login API
      const response = await authService.login(loginPayload);

      if (response.success) {
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

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-12 py-12 overflow-y-auto overflow-x-hidden flex-shrink-0">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={currentForm.handleSubmit(handleLogin)} className="space-y-6">
              {/* Identifier Type Toggle */}
              <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifierType("phone");
                    phoneForm.clearErrors();
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
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
                  onClick={() => {
                    setIdentifierType("email");
                    emailForm.clearErrors();
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
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
                <FormFieldGroup layout="column">
                  <FormField
                    label="Mobile Number"
                    error={phoneForm.formState.errors.phoneNumber}
                    required
                  >
                    <div className="flex gap-2">
                      <select
                        {...phoneRegister("countryCode")}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                      >
                        <option value="+260">+260</option>
                        <option value="+27">+27</option>
                        <option value="+263">+263</option>
                        <option value="+265">+265</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="123456789"
                        {...phoneRegister("phoneNumber")}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </FormField>
                </FormFieldGroup>
              )}

              {/* Email Input */}
              {identifierType === "email" && (
                <FormField
                  label="Email Address"
                  error={emailForm.formState.errors.email}
                  required
                >
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...emailRegister("email")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </FormField>
              )}

              {/* PIN Input */}
              <FormField
                label="PIN"
                error={currentForm.formState.errors.pin}
                required
              >
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="••••"
                    maxLength={4}
                    {...(identifierType === "phone" ? phoneRegister("pin") : emailRegister("pin"))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPin ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormField>

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

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <img 
              src="/images/logo.svg" 
              alt="Goodleaf" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Goodleaf Loans</h1>
            <p className="text-gray-600 text-sm mt-2">Fast, reliable loans</p>
          </div>

          <form onSubmit={currentForm.handleSubmit(handleLogin)} className="space-y-6">
            {/* Same form fields as desktop */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setIdentifierType("phone")}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                  identifierType === "phone"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setIdentifierType("email")}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                  identifierType === "email"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </button>
            </div>

            {identifierType === "phone" && (
              <FormField
                label="Mobile Number"
                error={phoneForm.formState.errors.phoneNumber}
                required
              >
                <div className="flex gap-2">
                  <select
                    {...phoneRegister("countryCode")}
                    className="px-3 py-3 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="+260">+260</option>
                    <option value="+27">+27</option>
                    <option value="+263">+263</option>
                    <option value="+265">+265</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="123456789"
                    {...phoneRegister("phoneNumber")}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </FormField>
            )}

            {identifierType === "email" && (
              <FormField
                label="Email Address"
                error={emailForm.formState.errors.email}
                required
              >
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...emailRegister("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>
            )}

            <FormField
              label="PIN"
              error={currentForm.formState.errors.pin}
              required
            >
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="••••"
                  maxLength={4}
                  {...(identifierType === "phone" ? phoneRegister("pin") : emailRegister("pin"))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2e7146] text-white py-3 rounded-lg font-semibold"
            >
              {isLoading ? <ButtonLoader isLoading={true}>Signing In...</ButtonLoader> : "Sign In"}
            </Button>

            <div className="text-center space-y-2 text-sm">
              <a href="/forgot-pin" className="block text-[#2e7146] hover:underline">
                Forgot PIN?
              </a>
              <p className="text-gray-600">
                New user?{" "}
                <a href="/apply" className="text-[#2e7146] font-semibold hover:underline">
                  Register here
                </a>
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setLocation("/apply")}
              variant="outline"
              className="w-full border-[#2e7146] text-[#2e7146]"
            >
              Apply for a Loan
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
