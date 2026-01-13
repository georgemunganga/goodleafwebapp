import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Login Page
 * Design: Mobile-native banking app style matching reference designs
 * - Clean white background
 * - Email/Phone toggle
 * - PIN input with visibility toggle
 * - Full-width green primary button
 */
export default function Login() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("phone");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+260");

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = identifierType === "email" ? identifier : undefined;
      const phone = identifierType === "phone" ? `${countryCode}${identifier}` : undefined;

      await login({ email, phone, password: pin });

      // Show success message
      toast.success('Login successful!');

      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo */}
      <header className="px-6 pt-12 pb-8">
        <div className="flex items-center justify-center">
          <img 
            src="/images/logo-dark.svg" 
            alt="Goodleaf" 
            className="h-10"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 flex flex-col">
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome!
            </h1>
            <p className="text-gray-500">
              Please enter your {identifierType === "phone" ? "phone number" : "email"} to login to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Identifier Type Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setIdentifierType("phone")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                  identifierType === "phone"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setIdentifierType("email")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                  identifierType === "email"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Email
              </button>
            </div>

            {/* Identifier Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {identifierType === "email" ? "Email ID" : "Mobile Number"}
              </label>
              
              {identifierType === "phone" ? (
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none w-24 px-3 py-3.5 border border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none pr-8"
                    >
                      <option value="+260">+260</option>
                      <option value="+27">+27</option>
                      <option value="+263">+263</option>
                      <option value="+265">+265</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    placeholder="123456789"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    required
                  />
                </div>
              )}
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                PIN
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="******"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPin ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot PIN Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot PIN?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !identifier || !pin}
              className="w-full rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-14 text-base shadow-lg shadow-primary/30"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-500">New user? </span>
            <button
              onClick={() => setLocation("/apply")}
              className="font-semibold text-primary hover:underline"
            >
              Register here
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">or</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setLocation("/apply")}
            variant="outline"
            className="w-full rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-semibold h-14 text-base"
          >
            Apply for a Loan
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to our{" "}
            <button className="text-primary hover:underline">Terms</button>
            {" & "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </div>
      </main>
    </div>
  );
}
