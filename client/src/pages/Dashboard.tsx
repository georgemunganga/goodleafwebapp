import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { TrendingUp, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Dashboard Page
 * Design: Mobile-first responsive app dashboard
 * - Active loans overview
 * - Quick actions
 * - Recent activity
 */
export default function Dashboard() {
  const [, setLocation] = useLocation();

  const activeLoans = [
    {
      id: "GL-2025-001",
      type: "Personal Loan",
      amount: 10000,
      outstanding: 7500,
      nextPayment: "Jan 31, 2025",
      amountDue: 916.67,
      status: "active"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      description: "K916.67 received for loan GL-2025-001",
      date: "Dec 20, 2024",
      icon: CheckCircle2
    },
    {
      id: 2,
      type: "due",
      title: "Payment Due",
      description: "K916.67 due on Jan 31, 2025",
      date: "Jan 31, 2025",
      icon: Clock
    },
    {
      id: 3,
      type: "application",
      title: "Application Approved",
      description: "Your loan application GL-2025-001 was approved",
      date: "Dec 15, 2024",
      icon: CheckCircle2
    }
  ];

  const quickActions = [
    {
      label: "Apply for Loan",
      icon: Plus,
      color: "bg-primary/10 text-primary",
      action: () => setLocation("/apply")
    },
    {
      label: "Check Eligibility",
      icon: TrendingUp,
      color: "bg-secondary/10 text-secondary",
      action: () => setLocation("/check-eligibility")
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-600">Welcome back,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">John Doe</h1>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg md:text-xl font-bold text-primary">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200">
            <p className="text-xs md:text-sm text-slate-600 mb-2">Active Loans</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-900">
              {activeLoans.length}
            </p>
          </div>
          <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200">
            <p className="text-xs md:text-sm text-slate-600 mb-2">Total Outstanding</p>
            <p className="text-2xl md:text-3xl font-bold text-primary">
              K{activeLoans.reduce((sum, loan) => sum + loan.outstanding, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200">
            <p className="text-xs md:text-sm text-slate-600 mb-2">Credit Score</p>
            <p className="text-2xl md:text-3xl font-bold text-secondary">750</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.action}
                className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 border-slate-200 hover:border-primary/30 hover:shadow-md transition-all text-left group`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <p className="font-semibold text-slate-900 text-sm md:text-base">
                  {action.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Loans Section */}
        {activeLoans.length > 0 && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Active Loans
              </h2>
              <button
                onClick={() => setLocation("/loans")}
                className="text-primary hover:text-primary/80 font-medium text-sm md:text-base"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {activeLoans.map((loan) => (
                <button
                  key={loan.id}
                  onClick={() => setLocation(`/loans/${loan.id}`)}
                  className="w-full p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200 hover:border-primary/30 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4 mb-4 md:mb-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm md:text-lg mb-1">
                        {loan.type}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600">
                        {loan.id}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-secondary/20 text-secondary font-semibold rounded-full text-xs md:text-sm whitespace-nowrap flex-shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-0">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Loan Amount</p>
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        K{loan.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Outstanding</p>
                      <p className="font-bold text-primary text-sm md:text-base">
                        K{loan.outstanding.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Due Date</p>
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        {loan.nextPayment}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-end text-primary group-hover:translate-x-1 transition-transform mt-4">
                    View Details →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Payment Due Alert */}
        {activeLoans.length > 0 && (
          <div className="p-4 md:p-6 bg-accent/10 rounded-2xl md:rounded-3xl border-2 border-accent/30 flex items-start gap-3 md:gap-4">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-accent text-sm md:text-base mb-1">
                Payment Due Soon
              </h3>
              <p className="text-xs md:text-sm text-accent/80">
                K{activeLoans[0].amountDue.toFixed(2)} due on {activeLoans[0].nextPayment}
              </p>
              <Button
                onClick={() => setLocation("/repayment")}
                className="mt-3 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 text-xs md:text-sm h-8 md:h-10"
              >
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Recent Activity
          </h2>

          <div className="space-y-2 md:space-y-3">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200 flex items-start gap-3 md:gap-4"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                      {activity.title}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {activity.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
