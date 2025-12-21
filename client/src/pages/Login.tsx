import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

/**
 * Login Page
 * Design: Mobile-native banking app style
 * - Full-screen mobile experience
 * - Email/Phone toggle
 * - PIN input with visibility toggle
 */
export default function Login() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo */}
      <header className="pt-safe px-6 pt-8 pb-6">
        <div className="flex items-center justify-center">
          <img 
            src="/logo-dark.svg" 
            alt="Goodleaf" 
            className="h-10"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 flex flex-col">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to manage your loans
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Identifier Type Toggle */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setIdentifierType("email")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  identifierType === "email"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setIdentifierType("phone")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  identifierType === "phone"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Phone
              </button>
            </div>

            {/* Identifier Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {identifierType === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {identifierType === "email" ? (
                    <Mail className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </div>
                <Input
                  type={identifierType === "email" ? "email" : "tel"}
                  placeholder={
                    identifierType === "email"
                      ? "your@email.com"
                      : "+260 123 456 789"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                PIN
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="pl-12 pr-12 h-12 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 bg-slate-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                className="text-sm font-medium text-primary"
              >
                Forgot PIN?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !identifier || !pin}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12 text-base"
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
        </div>

        {/* Bottom Section */}
        <div className="py-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">New to Goodleaf?</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setLocation("/apply")}
            variant="outline"
            className="w-full rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-semibold h-12 text-base"
          >
            Apply for a Loan
          </Button>

          <p className="text-center text-xs text-slate-400">
            By continuing, you agree to our{" "}
            <button className="text-primary">Terms</button>
            {" & "}
            <button className="text-primary">Privacy Policy</button>
          </p>
        </div>
      </main>
    </div>
  );
}
