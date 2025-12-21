import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, ArrowRight, Clock, CheckCircle2, Bell, ChevronRight } from "lucide-react";

/**
 * Dashboard Page
 * Design: Mobile-native banking app style
 * - Clean header with greeting
 * - Balance/Outstanding card
 * - Quick actions grid
 * - Active loans list
 * - Recent activity timeline
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
      status: "active",
      progress: 25
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      amount: "K916.67",
      date: "Dec 20, 2024",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      type: "due",
      title: "Upcoming Payment",
      amount: "K916.67",
      date: "Jan 31, 2025",
      icon: Clock,
      color: "text-amber-600 bg-amber-100"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Mobile native style */}
      <header className="bg-primary pt-safe">
        <div className="px-5 pt-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-base font-bold text-white">JD</span>
              </div>
              <div>
                <p className="text-white/70 text-xs">Good morning,</p>
                <h1 className="text-white font-bold text-lg">John Doe</h1>
              </div>
            </div>
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Outstanding Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
            <p className="text-white/70 text-xs mb-1">Total Outstanding</p>
            <p className="text-white text-3xl font-bold mb-4">
              K{activeLoans.reduce((sum, loan) => sum + loan.outstanding, 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${100 - (activeLoans[0]?.progress || 0)}%` }}
                ></div>
              </div>
              <span className="text-white/70 text-xs">75% remaining</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-2 space-y-6 pb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocation("/apply")}
              className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 text-sm">Apply</p>
                <p className="text-xs text-slate-500">New loan</p>
              </div>
            </button>
            <button
              onClick={() => setLocation("/repayment")}
              className="flex items-center gap-3 p-4 bg-secondary/5 hover:bg-secondary/10 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 text-sm">Pay</p>
                <p className="text-xs text-slate-500">Make payment</p>
              </div>
            </button>
          </div>
        </div>

        {/* Active Loans */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">Active Loans</h2>
            <button
              onClick={() => setLocation("/loans")}
              className="text-primary text-sm font-medium flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {activeLoans.map((loan) => (
              <button
                key={loan.id}
                onClick={() => setLocation(`/loans/${loan.id}`)}
                className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{loan.type}</h3>
                    <p className="text-xs text-slate-500">{loan.id}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Amount</p>
                    <p className="font-bold text-slate-900 text-sm">K{loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Outstanding</p>
                    <p className="font-bold text-primary text-sm">K{loan.outstanding.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Next Due</p>
                    <p className="font-bold text-slate-900 text-sm">{loan.nextPayment.split(',')[0]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${loan.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{loan.progress}% paid</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Due Alert */}
        {activeLoans.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800 text-sm">Payment Due Soon</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  K{activeLoans[0].amountDue.toFixed(2)} due on {activeLoans[0].nextPayment}
                </p>
                <Button
                  onClick={() => setLocation("/repayment")}
                  size="sm"
                  className="mt-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-8 px-4 text-xs"
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h2 className="font-bold text-slate-900 mb-3">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-4"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{activity.amount}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
