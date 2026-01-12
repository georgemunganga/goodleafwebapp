import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus, ArrowUpRight, Clock, CheckCircle2, Bell, ChevronRight, Wallet, FileText, Calculator, CreditCard, AlertCircle, XCircle, CheckCircle, Lightbulb, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { PageSkeletonLoader, CardSkeletonLoader } from "@/components/ui/skeleton-loader";
import { loanService } from "@/lib/api-service";
import { useNotificationBadges } from "@/hooks/useNotificationBadges";
import * as Types from "@/lib/api-types";

/**
 * Dashboard Page - Enhanced with Loan Status Variations & Real API Integration
 * Design: Mobile-native banking app style matching reference designs
 * - Green gradient header with user greeting
 * - Outstanding balance card with progress
 * - Quick actions grid (4 items)
 * - Personalized recommendations based on real loan data
 * - Loan status cards with comprehensive variations
 * - Recent activity
 */

// Loan status types for display
type DisplayLoanStatus = 
  | "active" 
  | "pending_approval" 
  | "declined" 
  | "pending_kyc" 
  | "kyc_rejected" 
  | "approved_not_disbursed" 
  | "overdue" 
  | "completed";

interface DisplayLoan extends Types.LoanDetails {
  displayStatus: DisplayLoanStatus;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
  actionPath: string;
  color: string;
  priority: "high" | "medium" | "low";
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<DisplayLoan[]>([]);
  const [selectedLoanStatus, setSelectedLoanStatus] = useState<DisplayLoanStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch loans from API
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        const fetchedLoans = await loanService.getUserLoans();
        
        // Map API loan statuses to display statuses
        const displayLoans: DisplayLoan[] = fetchedLoans.map(loan => ({
          ...loan,
          displayStatus: mapLoanStatus(loan.status)
        }));
        
        setLoans(displayLoans);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
        setError('Failed to load loans. Please try again.');
        // Fallback to empty state
        setLoans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Get notification badges
  const badges = useNotificationBadges(loans);

  // Map API loan status to display status
  function mapLoanStatus(apiStatus: Types.LoanDetails['status']): DisplayLoanStatus {
    switch (apiStatus) {
      case 'active':
        return 'active';
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending_approval';
      case 'rejected':
        return 'declined';
      case 'defaulted':
        return 'overdue';
      default:
        return 'active';
    }
  }

  if (isLoading) {
    return <PageSkeletonLoader />;
  }

  const displayedLoans = selectedLoanStatus 
    ? loans.filter(loan => loan.displayStatus === selectedLoanStatus)
    : loans;

  const activeLoan = loans.find(loan => loan.displayStatus === "active");
  const overdueLoan = loans.find(loan => loan.displayStatus === "overdue");

  // Generate recommendations based on real loan data
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Check if user has no active loans
    if (!activeLoan && loans.filter(l => l.displayStatus !== "declined" && l.displayStatus !== "pending_approval").length === 0) {
      recommendations.push({
        id: "apply-first-loan",
        title: "Ready for Your First Loan?",
        description: "Get quick approval for personal or business loans with competitive rates",
        icon: TrendingUp,
        action: "Apply Now",
        actionPath: "/apply",
        color: "from-green-50 to-emerald-50",
        priority: "high"
      });
    }

    // Check if user has pending applications
    const pendingLoan = loans.find(l => l.displayStatus === "pending_approval");
    if (pendingLoan) {
      recommendations.push({
        id: "pending-application",
        title: "Application Under Review",
        description: `Your ${pendingLoan.loanCategory} application is being processed`,
        icon: Clock,
        action: "View Status",
        actionPath: "/loans",
        color: "from-blue-50 to-cyan-50",
        priority: "medium"
      });
    }

    // Check if user has declined applications
    const declinedLoan = loans.find(l => l.displayStatus === "declined");
    if (declinedLoan) {
      recommendations.push({
        id: "reapply-declined",
        title: "Reapply for Your Loan",
        description: `Your previous application was declined. Review requirements and reapply with updated information`,
        icon: AlertCircle,
        action: "View Details",
        actionPath: "/loans",
        color: "from-red-50 to-rose-50",
        priority: "high"
      });
    }

    // Check if user has active loan and can apply for another
    if (activeLoan && activeLoan.amountPaid && activeLoan.loanAmount) {
      const repaymentProgress = (activeLoan.amountPaid / activeLoan.loanAmount) * 100;
      if (repaymentProgress > 50) {
        recommendations.push({
          id: "increase-limit",
          title: "Increase Your Loan Limit",
          description: "You've successfully repaid 50%+ of your current loan. Eligible for a higher limit",
          icon: TrendingUp,
          action: "Increase Limit",
          actionPath: "/apply",
          color: "from-blue-50 to-cyan-50",
          priority: "medium"
        });
      }
    }

    // Check if user has overdue payment
    if (overdueLoan) {
      recommendations.push({
        id: "settle-overdue",
        title: "Settle Your Overdue Payment",
        description: `You have an overdue payment. Pay now to avoid penalties`,
        icon: AlertCircle,
        action: "Pay Now",
        actionPath: "/repayment",
        color: "from-red-50 to-pink-50",
        priority: "high"
      });
    }

    // Check if user has active loan approaching due date
    if (activeLoan && activeLoan.nextPaymentDate) {
      const daysUntilDue = Math.ceil((new Date(activeLoan.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        recommendations.push({
          id: "upcoming-payment",
          title: "Upcoming Payment Reminder",
          description: `Payment of K${activeLoan.monthlyPayment?.toFixed(2)} due in ${daysUntilDue} days`,
          icon: Calendar,
          action: "Schedule Payment",
          actionPath: "/repayment",
          color: "from-amber-50 to-yellow-50",
          priority: "medium"
        });
      }
    }

    // Early repayment suggestion
    if (activeLoan && activeLoan.amountRemaining && activeLoan.amountRemaining > 0) {
      recommendations.push({
        id: "early-repay",
        title: "Save on Interest with Early Repayment",
        description: "Calculate how much you can save by repaying early",
        icon: DollarSign,
        action: "Calculate",
        actionPath: "/early-repayment",
        color: "from-purple-50 to-pink-50",
        priority: "low"
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const recommendations = generateRecommendations();

  // Render loan status card based on status type
  const renderLoanCard = (loan: DisplayLoan) => {
    switch (loan.displayStatus) {
      case "active":
        return (
          <button
            key={loan.id}
            onClick={() => setLocation(`/loans/${loan.id}`)}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left active:scale-[0.98] transition-transform hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{loan.loanType}</h3>
                <p className="text-sm text-gray-500">{loan.loanId}</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Amount</p>
                <p className="font-bold text-gray-900 text-base">K{loan.loanAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Outstanding</p>
                <p className="font-bold text-primary text-base">K{loan.amountRemaining?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Next Due</p>
                <p className="font-bold text-gray-900 text-base">{new Date(loan.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${((loan.amountPaid || 0) / (loan.loanAmount || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 font-semibold">{Math.round(((loan.amountPaid || 0) / (loan.loanAmount || 1)) * 100)}% paid</span>
            </div>
          </button>
        );

      case "pending_approval":
        return (
          <div
            key={loan.id}
            className="w-full bg-white rounded-2xl shadow-sm border border-blue-100 p-4 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{loan.loanType}</h3>
                <p className="text-sm text-gray-500">{loan.loanId}</p>
              </div>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-bold rounded-full flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Loan Amount</p>
                <p className="font-bold text-gray-900 text-base">K{loan.loanAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Applied On</p>
                <p className="font-bold text-blue-700 text-base">{new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800">
                Your application is under review. We'll notify you once a decision is made.
              </p>
            </div>

            <Button
              onClick={() => setLocation("/loans")}
              variant="outline"
              className="w-full rounded-xl border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              View Application Status
            </Button>
          </div>
        );

      case "declined":
        return (
          <div
            key={loan.id}
            className="w-full bg-white rounded-2xl shadow-sm border border-red-100 p-4 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{loan.loanType}</h3>
                <p className="text-sm text-gray-500">{loan.loanId}</p>
              </div>
              <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Declined
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Loan Amount</p>
                <p className="font-bold text-gray-900 text-base">K{loan.loanAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Applied On</p>
                <p className="font-bold text-red-700 text-base">{new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
              <p className="text-sm font-semibold text-red-900 mb-2">Application Declined</p>
              <p className="text-sm text-red-800">
                Your application did not meet the current requirements. Please contact support for more details.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setLocation("/apply")}
                className="rounded-xl bg-primary hover:bg-[#256339]"
              >
                Reapply
              </Button>
              <Button
                onClick={() => setLocation("/help")}
                variant="outline"
                className="rounded-xl"
              >
                Get Help
              </Button>
            </div>
          </div>
        );

      case "overdue":
        return (
          <div
            key={loan.id}
            className="w-full bg-white rounded-2xl shadow-sm border border-red-100 p-4 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{loan.loanType}</h3>
                <p className="text-sm text-gray-500">{loan.loanId}</p>
              </div>
              <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Overdue
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Amount</p>
                <p className="font-bold text-gray-900 text-base">K{loan.loanAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Outstanding</p>
                <p className="font-bold text-red-700 text-base">K{loan.amountRemaining?.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <p className="font-bold text-red-700 text-base">Overdue</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
              <p className="text-sm text-red-800">
                Your payment is overdue. Penalties may apply. Please pay immediately.
              </p>
            </div>

            <Button
              onClick={() => setLocation("/repayment")}
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Pay Now
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case "completed":
        return (
          <div
            key={loan.id}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-left opacity-75"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{loan.loanType}</h3>
                <p className="text-sm text-gray-500">{loan.loanId}</p>
              </div>
              <span className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-full flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Loan Amount</p>
                <p className="font-bold text-gray-900 text-base">K{loan.loanAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Completed On</p>
                <p className="font-bold text-gray-700 text-base">{new Date(loan.maturityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 font-semibold">100% paid</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const quickActions = [
    { icon: Plus, label: "Apply", sublabel: "New loan", path: "/apply", color: "bg-primary" },
    { icon: Wallet, label: "Pay", sublabel: "Make payment", path: "/repayment", color: "bg-[#28ca33]" },
    { icon: Calculator, label: "Calculate", sublabel: "Early repay", path: "/early-repayment", color: "bg-blue-500" },
    { icon: FileText, label: "History", sublabel: "View loans", path: "/loans", color: "bg-purple-500" },
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
              {badges.totalNotifications > 0 && (
                <span className="absolute top-2.5 right-2.5 w-6 h-6 bg-red-500 rounded-full border-2 border-[#2e7146] flex items-center justify-center text-white text-xs font-bold">
                  {Math.min(badges.totalNotifications, 9)}
                </span>
              )}
            </button>
          </div>

          {/* Outstanding Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Outstanding</p>
                <p className="text-white text-4xl font-bold">
                  K{loans
                    .filter(l => l.displayStatus === "active")
                    .reduce((sum, loan) => sum + (loan.amountRemaining || 0), 0)
                    .toLocaleString()}
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
                  style={{ width: `${activeLoan ? ((activeLoan.amountPaid || 0) / (activeLoan.loanAmount || 1)) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-white text-sm font-medium">{activeLoan ? Math.round(((activeLoan.amountPaid || 0) / (activeLoan.loanAmount || 1)) * 100) : 0}% paid</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-2 space-y-6 pb-8">
        {/* Quick Actions Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => setLocation(action.path)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-sm">{action.label}</p>
                    <p className="text-xs text-gray-500 hidden sm:block">{action.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-gray-900 text-lg">Recommendations for You</h2>
            </div>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => {
                const Icon = rec.icon;
                return (
                  <button
                    key={rec.id}
                    onClick={() => setLocation(rec.actionPath)}
                    className={`w-full bg-gradient-to-r ${rec.color} rounded-2xl p-5 border border-gray-200 text-left hover:shadow-md transition-shadow active:scale-[0.98]`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">{rec.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
                        <div className="flex items-center gap-2 mt-3 text-primary font-semibold text-sm">
                          {rec.action}
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loan Status Tabs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Your Loans</h2>
            <button
              onClick={() => setLocation("/loans")}
              className="text-primary text-base font-semibold flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-5 px-5">
            <button
              onClick={() => setSelectedLoanStatus(null)}
              className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                selectedLoanStatus === null
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({loans.length})
            </button>
            {["active", "pending_approval", "declined", "overdue", "completed"].map((status) => {
              const count = loans.filter(l => l.displayStatus === status).length;
              if (count === 0) return null;
              
              const statusLabels: Record<string, string> = {
                active: "Active",
                pending_approval: "Pending",
                declined: "Declined",
                overdue: "Overdue",
                completed: "Completed"
              };

              return (
                <button
                  key={status}
                  onClick={() => setSelectedLoanStatus(status as DisplayLoanStatus)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedLoanStatus === status
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {statusLabels[status]} ({count})
                </button>
              );
            })}
          </div>

          {/* Loans List */}
          <div className="space-y-3">
            {displayedLoans.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No Loans Found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {selectedLoanStatus ? "No loans with this status" : "Apply for your first loan today"}
                </p>
                <Button
                  onClick={() => setLocation("/apply")}
                  className="rounded-xl bg-primary hover:bg-[#256339]"
                >
                  Apply Now
                </Button>
              </div>
            ) : (
              displayedLoans.map(loan => renderLoanCard(loan))
            )}
          </div>
        </div>

        {/* Payment Due Alert - Only show for active loans */}
        {activeLoan && activeLoan.displayStatus === "active" && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800">Payment Due Soon</h3>
                <p className="text-sm text-amber-700 mt-1">
                  K{activeLoan.monthlyPayment?.toFixed(2)} due on {new Date(activeLoan.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
