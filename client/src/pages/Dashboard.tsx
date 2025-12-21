import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, ArrowUpRight, Clock, CheckCircle2, Bell, ChevronRight, Wallet, FileText, Calculator, CreditCard } from "lucide-react";

/**
 * Dashboard Page
 * Design: Mobile-native banking app style matching reference designs
 * - Green gradient header with user greeting
 * - Outstanding balance card with progress
 * - Quick actions grid (4 items)
 * - Active loans list
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
      color: "text-green-600 bg-green-50"
    },
    {
      id: 2,
      type: "due",
      title: "Upcoming Payment",
      amount: "K916.67",
      date: "Jan 31, 2025",
      icon: Clock,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  const quickActions = [
    { icon: Plus, label: "Apply", sublabel: "New loan", path: "/apply", color: "bg-primary" },
    { icon: Wallet, label: "Pay", sublabel: "Make payment", path: "/repayment", color: "bg-[#28ca33]" },
    { icon: Calculator, label: "Calculate", sublabel: "Early repay", path: "/early-repayment", color: "bg-blue-500" },
    { icon: FileText, label: "History", sublabel: "View loans", path: "/loans", color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-br from-[#2e7146] to-[#1d4a2f]">
        <div className="px-5 pt-6 pb-8">
          {/* Top bar with avatar and notification */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-lg font-bold text-white">JD</span>
              </div>
              <div>
                <p className="text-white/70 text-sm">Good morning,</p>
                <h1 className="text-white font-bold text-xl">John Doe</h1>
              </div>
            </div>
            <button className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center relative hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2e7146]"></span>
            </button>
          </div>

          {/* Outstanding Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Outstanding</p>
                <p className="text-white text-4xl font-bold">
                  K{activeLoans.reduce((sum, loan) => sum + loan.outstanding, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#28ca33] rounded-full transition-all"
                  style={{ width: `${activeLoans[0]?.progress || 0}%` }}
                ></div>
              </div>
              <span className="text-white text-sm font-medium">{activeLoans[0]?.progress || 0}% paid</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-2 space-y-6 pb-8">
        {/* Quick Actions Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => setLocation(action.path)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-xs">{action.label}</p>
                    <p className="text-[10px] text-gray-500 hidden sm:block">{action.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Loans */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-lg">Active Loans</h2>
            <button
              onClick={() => setLocation("/loans")}
              className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {activeLoans.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No Active Loans</h3>
                <p className="text-gray-500 text-sm mb-4">Apply for your first loan today</p>
                <Button
                  onClick={() => setLocation("/apply")}
                  className="rounded-xl bg-primary hover:bg-[#256339]"
                >
                  Apply Now
                </Button>
              </div>
            ) : (
              activeLoans.map((loan) => (
                <button
                  key={loan.id}
                  onClick={() => setLocation(`/loans/${loan.id}`)}
                  className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left active:scale-[0.98] transition-transform hover:border-primary/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{loan.type}</h3>
                      <p className="text-xs text-gray-500">{loan.id}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                      <p className="font-bold text-gray-900">K{loan.amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Outstanding</p>
                      <p className="font-bold text-primary">K{loan.outstanding.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Next Due</p>
                      <p className="font-bold text-gray-900">{loan.nextPayment.split(',')[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{loan.progress}% paid</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Payment Due Alert */}
        {activeLoans.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800">Payment Due Soon</h3>
                <p className="text-sm text-amber-700 mt-1">
                  K{activeLoans[0].amountDue.toFixed(2)} due on {activeLoans[0].nextPayment}
                </p>
                <Button
                  onClick={() => setLocation("/repayment")}
                  size="sm"
                  className="mt-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold h-10 px-5"
                >
                  Pay Now
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h2 className="font-bold text-gray-900 text-lg mb-3">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <p className="font-bold text-gray-900">{activity.amount}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
