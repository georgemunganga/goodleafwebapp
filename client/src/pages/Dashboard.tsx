import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Plus, ArrowUpRight, Clock, CheckCircle2, Bell, ChevronRight, ChevronDown, Wallet, FileText, Calculator, CreditCard, AlertCircle, CheckCircle, Lightbulb, TrendingUp, DollarSign, Calendar, ShieldCheck, Circle, LifeBuoy, User } from "lucide-react";
import { PageSkeletonLoader, CardSkeletonLoader } from "@/components/ui/skeleton-loader";
import { useUserLoans } from "@/hooks/useLoanQueries";
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
  | "submitted"
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
  const [selectedLoanStatus, setSelectedLoanStatus] = useState<DisplayLoanStatus | null>(null);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const loansQuery = useUserLoans();
  const isLoading = loansQuery.isLoading;
  const error = loansQuery.error
    ? (loansQuery.error instanceof Error
        ? loansQuery.error.message
        : (loansQuery.error as { message?: string }).message || 'Failed to load loans. Please try again.')
    : null;

  const loans = useMemo(() => {
    const data = loansQuery.data ?? [];
    return data.map((loan) => ({
      ...loan,
      displayStatus: mapLoanStatus(loan.status),
    })) as DisplayLoan[];
  }, [loansQuery.data]);

  // Get notification badges
  const badges = useNotificationBadges(loansQuery.data ?? []);

  // Map API loan status to display status
  function mapLoanStatus(apiStatus: Types.LoanDetails['status']): DisplayLoanStatus {
    switch (apiStatus) {
      case 'submitted':
        return 'submitted';
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
        return 'pending_approval';
    }
  }

  const parseDate = (value?: string | null): Date | null => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (value?: string | null, options?: Intl.DateTimeFormatOptions): string => {
    const date = parseDate(value);
    if (!date) return "-";
    return date.toLocaleDateString("en-US", options);
  };

  const toNumberValue = (value?: number | string | null): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const formatCurrency = (value?: number | string | null) => {
    const numeric = toNumberValue(value);
    if (numeric === null) return "-";
    return `K${numeric.toLocaleString()}`;
  };

  const formatPercentage = (value?: number | string | null) => {
    const numeric = toNumberValue(value);
    if (numeric === null) return "-";
    return `${numeric}%`;
  };

  const formatLoanType = (value?: string | null) => {
    if (!value) return "-";
    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatTerm = (value?: number | string | null) => {
    const numeric = toNumberValue(value);
    if (numeric === null) return "-";
    return `${numeric} month${numeric === 1 ? "" : "s"}`;
  };

  if (isLoading) {
    return <PageSkeletonLoader />;
  }

  const toggleLoanDetails = (loanId: string) => {
    setExpandedLoanId((current) => (current === loanId ? null : loanId));
  };

  const displayedLoans = selectedLoanStatus 
    ? loans.filter(loan => loan.displayStatus === selectedLoanStatus)
    : loans;

  const activeLoan = loans.find(loan => loan.displayStatus === "active");
  const overdueLoan = loans.find(loan => loan.displayStatus === "overdue");
  const inProgressLoan = loans
    .filter((loan) => loan.displayStatus === "submitted" || loan.displayStatus === "pending_approval")
    .sort((a, b) => {
      const timeA = parseDate(a.createdAt)?.getTime() ?? 0;
      const timeB = parseDate(b.createdAt)?.getTime() ?? 0;
      return timeB - timeA;
    })[0];
  const hasEstablishedLoan = loans.some(
    (loan) => loan.displayStatus === "active" || loan.displayStatus === "overdue" || loan.displayStatus === "completed"
  );
  const isSubmittedOnlyUser = Boolean(inProgressLoan) && !hasEstablishedLoan;
  const totalOutstanding = loans
    .filter((loan) => loan.displayStatus === "active")
    .reduce((sum, loan) => sum + (loan.amountRemaining || 0), 0);
  const activeProgressWidth = activeLoan
    ? ((activeLoan.amountPaid || 0) / (activeLoan.loanAmount || 1)) * 100
    : 0;
  const activeProgressPercent = activeLoan
    ? Math.round(((activeLoan.amountPaid || 0) / (activeLoan.loanAmount || 1)) * 100)
    : 0;
  const applicationStage = inProgressLoan?.displayStatus === "pending_approval" ? "review" : "kyc";
  const applicationSteps = inProgressLoan
    ? [
        {
          key: "submitted",
          label: "Application Submitted",
          description: "Application received",
          state: "completed" as const,
        },
        {
          key: "kyc",
          label: "Complete KYC",
          description: "Verify your identity and documents",
          state: applicationStage === "kyc" ? ("current" as const) : ("completed" as const),
        },
        {
          key: "review",
          label: "Review",
          description: "We assess your application and affordability",
          state: applicationStage === "review" ? ("current" as const) : ("pending" as const),
        },
        {
          key: "decision",
          label: "Decision",
          description: "Approval and disbursement",
          state: "pending" as const,
        },
      ]
    : [];

  // Generate recommendations based on real loan data
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Check if user has no active or in-progress applications
    const inProgressStatuses: DisplayLoanStatus[] = ["submitted", "pending_approval"];
    const hasInProgressLoans = loans.some((loan) => inProgressStatuses.includes(loan.displayStatus));
    const hasEstablishedLoans = hasEstablishedLoan;
    if (!activeLoan && !hasInProgressLoans && !hasEstablishedLoans) {
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
    const pendingLoan = loans.find(
      (loan) => loan.displayStatus === "submitted" || loan.displayStatus === "pending_approval"
    );
    if (pendingLoan) {
      const isSubmitted = pendingLoan.displayStatus === "submitted";
      const pendingCategory = pendingLoan.loanCategory || "loan";
      const pendingTitle = isSubmitted ? "Complete Your Verification" : "Application Under Review";
      const pendingDescription =
        isSubmitted
          ? `Your ${pendingLoan.loanId} application is submitted. Complete KYC to continue.`
          : `Your ${pendingCategory} application is being processed`;
      recommendations.push({
        id: isSubmitted ? "complete-kyc" : "pending-application",
        title: pendingTitle,
        description: pendingDescription,
        icon: isSubmitted ? ShieldCheck : Clock,
        action: isSubmitted ? "Complete KYC" : "View Status",
        actionPath: isSubmitted ? "/kyc" : "/loans",
        color: isSubmitted ? "from-amber-50 to-yellow-50" : "from-blue-50 to-cyan-50",
        priority: isSubmitted ? "high" : "medium"
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
      const nextPaymentDate = parseDate(activeLoan.nextPaymentDate);
      if (nextPaymentDate) {
        const daysUntilDue = Math.ceil((nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
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
  const visibleRecommendations = isSubmittedOnlyUser
    ? recommendations.filter((rec) => rec.id !== "complete-kyc")
    : recommendations;

  const loanStatusConfig: Record<DisplayLoanStatus, { label: string; badgeClass: string }> = {
    active: { label: "Active", badgeClass: "bg-green-100 text-green-700" },
    submitted: { label: "Submitted", badgeClass: "bg-amber-100 text-amber-800" },
    pending_approval: { label: "Pending", badgeClass: "bg-blue-100 text-blue-700" },
    declined: { label: "Declined", badgeClass: "bg-red-100 text-red-700" },
    pending_kyc: { label: "Pending KYC", badgeClass: "bg-amber-100 text-amber-800" },
    kyc_rejected: { label: "KYC Rejected", badgeClass: "bg-red-100 text-red-700" },
    approved_not_disbursed: { label: "Approved", badgeClass: "bg-emerald-100 text-emerald-700" },
    overdue: { label: "Overdue", badgeClass: "bg-red-100 text-red-700" },
    completed: { label: "Completed", badgeClass: "bg-gray-100 text-gray-700" },
  };

  // Render loan list item
  const renderLoanCard = (loan: DisplayLoan) => {
    const normalizedLoanType = formatLoanType(loan.loanType);
    const loanTitle =
      loan.loanCategory || (normalizedLoanType !== "-" ? normalizedLoanType : "Loan Application");
    const statusMeta = loanStatusConfig[loan.displayStatus] ?? loanStatusConfig.pending_approval;
    const isActive = loan.displayStatus === "active" || loan.displayStatus === "overdue";
    const dateLabel = isActive ? "Next Due" : "Applied";
    const dateValue = isActive ? loan.nextPaymentDate : loan.createdAt;
    const loanKey = loan.id.toString();
    const isExpanded = expandedLoanId === loanKey;
    const detailsId = `loan-details-${loanKey}`;
    const completedPaid = (() => {
      const paidAmount = toNumberValue(loan.amountPaid);
      if (paidAmount !== null && paidAmount > 0) return paidAmount;
      return toNumberValue(loan.totalRepayment);
    })();
    const statusDetails = (() => {
      switch (loan.displayStatus) {
        case "active":
          return [
            { label: "Installment", value: formatCurrency(loan.monthlyPayment) },
            { label: "Outstanding", value: formatCurrency(loan.amountRemaining) },
            { label: "Next Payment", value: formatDate(loan.nextPaymentDate, { month: "short", day: "numeric" }) },
          ];
        case "overdue":
          return [
            { label: "Installment", value: formatCurrency(loan.monthlyPayment) },
            { label: "Outstanding", value: formatCurrency(loan.amountRemaining) },
            { label: "Due Date", value: formatDate(loan.nextPaymentDate, { month: "short", day: "numeric" }) },
          ];
        case "completed":
          return [
            { label: "Amount Paid", value: formatCurrency(completedPaid) },
            { label: "Completed On", value: formatDate(loan.maturityDate, { month: "short", day: "numeric" }) },
          ];
        default:
          return [
            { label: "Submitted On", value: formatDate(loan.createdAt, { month: "short", day: "numeric" }) },
          ];
      }
    })();
    const detailItems = [
      { label: "Loan Type", value: formatLoanType(loan.loanType) },
      { label: "Category", value: loan.loanCategory || "-" },
      { label: "Repayment Term", value: formatTerm(loan.repaymentMonths) },
      { label: "Interest Rate", value: formatPercentage(loan.interestRate) },
      { label: "Total Repayment", value: formatCurrency(loan.totalRepayment) },
      ...statusDetails,
    ];

    return (
      <div
        key={loan.id}
        className={`w-full bg-white rounded-2xl shadow-sm border ${isExpanded ? "border-primary/30" : "border-gray-100"}`}
      >
        <button
          type="button"
          onClick={() => toggleLoanDetails(loanKey)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          className="w-full p-4 text-left active:scale-[0.98] transition-transform hover:border-primary/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base capitalize">{loanTitle}</h3>
              <p className="text-sm text-gray-500">{loan.loanId}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}>
                {statusMeta.label}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Amount</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(loan.loanAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{dateLabel}</p>
              <p className="font-semibold text-gray-900">
                {formatDate(dateValue, { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
        </button>

        {isExpanded && (
          <div id={detailsId} className="border-t border-gray-100 px-4 pb-4 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detailItems.map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const defaultQuickActions = [
    { icon: Plus, label: "Apply", sublabel: "New loan", path: "/apply", color: "bg-primary" },
    { icon: Wallet, label: "Pay", sublabel: "Make payment", path: "/repayment", color: "bg-[#28ca33]" },
    { icon: Calculator, label: "Calculate", sublabel: "Early repay", path: "/early-repayment", color: "bg-blue-500" },
    { icon: FileText, label: "History", sublabel: "View loans", path: "/loans", color: "bg-purple-500" },
  ];

  const submittedQuickActions = [
    { icon: ShieldCheck, label: "KYC", sublabel: "Verify now", path: "/kyc", color: "bg-primary" },
    { icon: FileText, label: "Status", sublabel: "Track loan", path: "/loans", color: "bg-blue-500" },
    { icon: User, label: "Profile", sublabel: "Your info", path: "/profile", color: "bg-emerald-500" },
    { icon: LifeBuoy, label: "Support", sublabel: "Get help", path: "/help", color: "bg-amber-500" },
  ];

  const quickActions = isSubmittedOnlyUser ? submittedQuickActions : defaultQuickActions;

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

          {/* Hero Card */}
          {isSubmittedOnlyUser && inProgressLoan ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">
                    {applicationStage === "kyc" ? "Application Submitted" : "Application In Review"}
                  </p>
                  <p className="text-white text-2xl font-bold">{inProgressLoan.loanId}</p>
                  <p className="text-white/80 text-sm mt-1">
                    {applicationStage === "kyc"
                      ? "Complete KYC to speed up your approval."
                      : "We are reviewing your application and will notify you soon."}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {applicationStage === "kyc" ? (
                    <ShieldCheck className="w-6 h-6 text-white" />
                  ) : (
                    <Clock className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Requested</p>
                  <p className="text-white font-bold text-base">K{inProgressLoan.loanAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Submitted</p>
                  <p className="text-white font-bold text-base">
                    {formatDate(inProgressLoan.createdAt, { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {applicationStage === "kyc" ? (
                  <Button
                    onClick={() => setLocation("/kyc")}
                    className="h-11 rounded-xl bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    Complete KYC
                  </Button>
                ) : (
                  <Button
                    onClick={() => setLocation("/loans")}
                    className="h-11 rounded-xl bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    View Status
                  </Button>
                )}
                <Button
                  onClick={() => setLocation(applicationStage === "kyc" ? "/loans" : "/help")}
                  variant="outline"
                  className="h-11 rounded-xl border-white/40 text-white hover:bg-white/10"
                >
                  {applicationStage === "kyc" ? "View Status" : "Get Help"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Outstanding</p>
                  <p className="text-white text-4xl font-bold">K{totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#28ca33] rounded-full transition-all"
                    style={{ width: `${activeProgressWidth}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm font-medium">{activeProgressPercent}% paid</span>
              </div>
            </div>
          )}
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

        {/* Application Progress - Submitted Only */}
        {isSubmittedOnlyUser && inProgressLoan && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Application Progress</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {applicationStage === "kyc" ? "Next step: Complete KYC" : "We are reviewing your application"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  applicationStage === "kyc" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-700"
                }`}
              >
                {applicationStage === "kyc" ? "Action Needed" : "In Review"}
              </span>
            </div>

            <div className="space-y-3">
              {applicationSteps.map((step, index) => {
                const Icon = step.state === "completed" ? CheckCircle : step.state === "current" ? Clock : Circle;
                const iconClass =
                  step.state === "completed"
                    ? "text-primary"
                    : step.state === "current"
                      ? "text-amber-600"
                      : "text-gray-300";
                const titleClass = step.state === "pending" ? "text-gray-500" : "text-gray-900";
                const connectorClass = step.state === "completed" ? "bg-primary/30" : "bg-gray-200";
                const showConnector = index < applicationSteps.length - 1;

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <Icon className={`w-5 h-5 ${iconClass}`} />
                      {showConnector && <div className={`w-px h-8 mt-1 ${connectorClass}`} />}
                    </div>
                    <div className="pb-2">
                      <p className={`font-semibold ${titleClass}`}>{step.label}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Personalized Recommendations */}
        {visibleRecommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-gray-900 text-lg">Recommendations for You</h2>
            </div>
            <div className="space-y-3">
              {visibleRecommendations.slice(0, 3).map((rec) => {
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
            {["active", "submitted", "pending_approval", "declined", "overdue", "completed"].map((status) => {
              const count = loans.filter(l => l.displayStatus === status).length;
              if (count === 0) return null;
              
              const statusLabels: Record<string, string> = {
                active: "Active",
                submitted: "Submitted",
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
        {activeLoan && activeLoan.displayStatus === "active" && activeLoan.nextPaymentDate && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800">Payment Due Soon</h3>
                <p className="text-sm text-amber-700 mt-1">
                  K{activeLoan.monthlyPayment?.toFixed(2)} due on {formatDate(activeLoan.nextPaymentDate, { month: 'short', day: 'numeric', year: 'numeric' })}
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
