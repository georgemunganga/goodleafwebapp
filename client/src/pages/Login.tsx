import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loading-spinner";

/**
 * Login Page
 * Design: Responsive desktop and mobile layouts
 * - Desktop: Split layout with hero on left, form on right
 * - Mobile: Full-width centered form
 * - Email/Phone toggle
 * - PIN input with visibility toggle
 */
export default function Login() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("phone");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+260");

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
    <div className="min-h-screen bg-white">
      {/* Desktop Layout - Split screen */}
      <div className="hidden lg:flex h-screen">
        {/* Left Side - Hero/Brand Section */}
        <div className="w-1/2 bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] flex flex-col items-center justify-center px-12 py-12">
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
        <div className="w-1/2 flex flex-col items-center justify-center px-12 py-12">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Identifier Type Toggle */}
              <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIdentifierType("phone")}
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
                  onClick={() => setIdentifierType("email")}
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
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
                      placeholder="123456789"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              {identifierType === "email" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              )}

              {/* PIN Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="••••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot PIN Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setLocation("/forgot-pin")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot PIN?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <ButtonLoader isLoading={isLoading} loadingText="Signing In...">
                  Sign In
                </ButtonLoader>
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Register Link */}
              <p className="text-center text-gray-600">
                New user?{" "}
                <button
                  type="button"
                  onClick={() => setLocation("/apply")}
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Register here
                </button>
              </p>

              {/* Apply for Loan */}
              <Button
                type="button"
                onClick={() => setLocation("/apply")}
                variant="outline"
                className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-lg"
              >
                Apply for a Loan
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setLocation("/terms")}
                className="hover:text-gray-700"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setLocation("/privacy")}
                className="hover:text-gray-700"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full width */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Header with Logo */}
        <header className="px-4 pt-10 pb-8">
          <div className="flex items-center justify-center">
            <img 
              src="/images/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-12"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 flex flex-col pb-8">
          <div className="flex-1 flex flex-col">
            {/* Welcome Text */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome!
              </h1>
              <p className="text-base text-gray-500">
                Please enter your {identifierType === "phone" ? "phone number" : "email"} to login
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Identifier Type Toggle */}
              <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIdentifierType("phone")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
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
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    identifierType === "email"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Phone Number Input */}
              {identifierType === "phone" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-base font-medium"
                    >
                      <option value="+260">+260</option>
                      <option value="+27">+27</option>
                      <option value="+263">+263</option>
                      <option value="+265">+265</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="123456789"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              {identifierType === "email" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                </div>
              )}

              {/* PIN Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="••••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot PIN Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-sm text-primary hover:text-primary/80 font-semibold"
                >
                  Forgot PIN?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-[#256339] text-white font-bold py-4 rounded-lg transition-colors text-base"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600">
                New user?{" "}
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-primary hover:text-primary/80 font-bold"
                >
                  Register here
                </button>
              </p>
            </form>
          </div>

          {/* Apply for Loan Button */}
          <Button
            type="button"
            onClick={() => setLocation("/apply")}
            variant="outline"
            className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-bold py-4 rounded-lg text-base"
          >
            Apply for a Loan
          </Button>

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500">
            <button className="hover:text-gray-700">Terms</button>
            <button className="hover:text-gray-700">Privacy</button>
          </div>
        </main>
      </div>
    </div>
  );
}
