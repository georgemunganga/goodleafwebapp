import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, Leaf } from "lucide-react";

/**
 * Home Page - Landing Page for Goodleaf Online Loans
 * Design: Modern Financial Minimalism with Organic Warmth
 * - Clear value proposition
 * - Pre-eligibility checker CTA
 * - Login/Apply CTAs
 * - Feature highlights
 */
export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <img 
              src="/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-10 md:h-12"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setLocation("/")}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => setLocation("/check-eligibility")}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Check Eligibility
            </button>
            <button 
              onClick={() => setLocation("/login")}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Login
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/login")}
              className="rounded-full"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/apply")}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-secondary/10 rounded-full">
            <Leaf className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Trusted Lending Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Fast, Transparent Loans for Your Growth
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
            Get personal or business loans with simple application, quick approval, and flexible repayment terms. Whether you're a civil servant or business owner, Goodleaf has the right loan for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => setLocation("/apply")}
              className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
            >
              Apply for a Loan <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/check-eligibility")}
              className="rounded-full px-8 py-3 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary/5"
            >
              Check Eligibility
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
          Why Choose Goodleaf?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quick Application",
              description: "Complete your loan application in just 5 minutes with our simple, step-by-step process.",
              icon: "⚡"
            },
            {
              title: "Transparent Terms",
              description: "No hidden fees. See exactly what you'll pay before you apply, with clear repayment schedules.",
              icon: "📋"
            },
            {
              title: "Flexible Repayment",
              description: "Choose your repayment tenure and make early payments without penalties. Your financial freedom matters.",
              icon: "🔄"
            },
            {
              title: "Multiple Loan Types",
              description: "Personal loans for civil servants, private institution employees, or business loans with collateral.",
              icon: "🏦"
            },
            {
              title: "Fast Approval",
              description: "Get approved in days, not weeks. Funds disbursed quickly once your KYC is verified.",
              icon: "✅"
            },
            {
              title: "24/7 Support",
              description: "Need help? Our support team is available round the clock to assist you with any questions.",
              icon: "💬"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loan Products Section */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
          Our Loan Products
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Loans */}
          <div className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-primary/20">
            <h3 className="text-2xl font-bold text-primary mb-4">Personal Loans</h3>
            <p className="text-slate-600 mb-6">
              Designed for civil servants and private institution employees. Get up to K50,000 with flexible terms.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">For civil servants (GRZ) and private employees</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Repayment tenure: 6-36 months</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Minimal documentation required</span>
              </li>
            </ul>
            <Button
              onClick={() => setLocation("/apply")}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
            >
              Apply for Personal Loan
            </Button>
          </div>

          {/* Business Loans */}
          <div className="p-8 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl border border-secondary/20">
            <h3 className="text-2xl font-bold text-secondary mb-4">Business Loans</h3>
            <p className="text-slate-600 mb-6">
              Grow your business with collateral-backed loans. Get up to K200,000 for expansion and operations.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Vehicle or property collateral options</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Repayment tenure: 12-60 months</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Comprehensive KYC and documentation</span>
              </li>
            </ul>
            <Button
              onClick={() => setLocation("/apply")}
              className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3"
            >
              Apply for Business Loan
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Check your eligibility in seconds, then apply for your loan. The entire process takes just a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/check-eligibility")}
              className="rounded-full bg-white text-primary hover:bg-slate-100 px-8 py-3 text-lg font-semibold"
            >
              Check Eligibility
            </Button>
            <Button
              size="lg"
              onClick={() => setLocation("/apply")}
              className="rounded-full bg-secondary hover:bg-secondary/90 text-white px-8 py-3 text-lg font-semibold"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/logo-dark.svg" 
                alt="Goodleaf" 
                className="h-8 mb-4"
              />
              <p className="text-sm text-slate-600">
                Fast, transparent loans for your growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button onClick={() => setLocation("/apply")} className="hover:text-primary">Personal Loans</button></li>
                <li><button onClick={() => setLocation("/apply")} className="hover:text-primary">Business Loans</button></li>
                <li><button onClick={() => setLocation("/check-eligibility")} className="hover:text-primary">Check Eligibility</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2025 Goodleaf Online Loans. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
