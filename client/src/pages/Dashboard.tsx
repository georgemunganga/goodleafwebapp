import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, CreditCard, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Dashboard Page - Post-Login User Dashboard
 * Design: Modern Financial Minimalism with Organic Warmth
 * - Welcome message
 * - Active loan summary
 * - Application status
 * - Quick actions
 * - Sidebar navigation
 */
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = "John Doe";
  const activeLoan = {
    id: "GL-2025-001",
    amount: 10000,
    outstanding: 7500,
    nextPayment: "Jan 31, 2025",
    amountDue: 916.67,
    status: "active"
  };

  const applications = [
    {
      id: "APP-2025-001",
      type: "Personal Loan",
      amount: 10000,
      status: "pending-review",
      date: "Dec 20, 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-6 border-b border-slate-200">
          <img 
            src="/logo-dark.svg" 
            alt="Goodleaf" 
            className="h-10"
          />
        </div>

        <nav className="p-6 space-y-2">
          <button
            onClick={() => {
              setLocation("/dashboard");
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-2xl bg-primary/10 text-primary font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setLocation("/loans");
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            Loan History
          </button>
          <button
            onClick={() => {
              setLocation("/apply");
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            Apply for Loan
          </button>
          <button
            onClick={() => {
              setLocation("/profile");
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-100 font-medium transition-colors flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Profile
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-white">
          <Button
            onClick={() => setLocation("/login")}
            variant="outline"
            className="w-full rounded-full border-2 border-destructive text-destructive hover:bg-destructive/5 font-semibold py-2 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="container flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 container py-8 md:py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {userName}!
            </h2>
            <p className="text-slate-600">
              Here's an overview of your loans and applications
            </p>
          </div>

          {/* Active Loan Card */}
          {activeLoan.status === "active" && (
            <div className="mb-8 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Loan</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Loan #{activeLoan.id}
                  </h3>
                </div>
                <span className="px-4 py-2 bg-secondary/20 text-secondary font-semibold rounded-full text-sm">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-xs text-slate-600 mb-2">Loan Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    K{activeLoan.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-primary">
                    K{activeLoan.outstanding.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">Next Payment</p>
                  <p className="text-lg font-bold text-slate-900">
                    {activeLoan.nextPayment}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">Amount Due</p>
                  <p className="text-2xl font-bold text-slate-900">
                    K{activeLoan.amountDue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setLocation("/loans/GL-2025-001")}
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setLocation("/repayment")}
                  variant="outline"
                  className="flex-1 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Make a Payment
                </Button>
              </div>
            </div>
          )}

          {/* Application Status */}
          {applications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Pending Applications
              </h3>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {app.type}
                        </h4>
                        <p className="text-sm text-slate-600">
                          Application ID: {app.id}
                        </p>
                        <p className="text-sm text-slate-600">
                          Amount: K{app.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent font-semibold rounded-full text-xs mb-2">
                          {app.status === "pending-review" ? "Pending Review" : "In Progress"}
                        </span>
                        <p className="text-xs text-slate-600">{app.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setLocation("/apply")}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">
                Apply for Loan
              </h4>
              <p className="text-sm text-slate-600">
                Submit a new loan application
              </p>
            </button>

            <button
              onClick={() => setLocation("/early-repayment")}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <CreditCard className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">
                Early Repayment
              </h4>
              <p className="text-sm text-slate-600">
                Calculate early settlement amount
              </p>
            </button>

            <button
              onClick={() => setLocation("/restructuring")}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">
                Request Restructuring
              </h4>
              <p className="text-sm text-slate-600">
                Request a loan tenure extension
              </p>
            </button>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
