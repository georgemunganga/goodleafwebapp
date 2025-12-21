import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

/**
 * Login Page
 * Design: Modern Financial Minimalism with Organic Warmth
 * - Email/Phone toggle input
 * - PIN input with visibility toggle
 * - Links for "Forgot PIN" and "Register/Apply Now"
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
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              onClick={() => setLocation("/apply")}
              className="font-semibold text-primary hover:underline"
            >
              Apply Now
            </button>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Login to manage your loans and applications
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Identifier Type Toggle */}
            <div className="flex gap-3 p-1 bg-slate-100 rounded-full">
              <button
                type="button"
                onClick={() => setIdentifierType("email")}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                  identifierType === "email"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setIdentifierType("phone")}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                  identifierType === "phone"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:text-slate-900"
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
                  className="pl-12 h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                PIN (4-6 digits)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="pl-12 pr-12 h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0"
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
                onClick={() => setLocation("/")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot PIN?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !identifier || !pin}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-lg h-12"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            {/* Register Link */}
            <Button
              type="button"
              onClick={() => setLocation("/apply")}
              variant="outline"
              className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 text-lg h-12"
            >
              Apply for a Loan
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-sm text-slate-600 mt-8">
            By logging in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms & Conditions
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
