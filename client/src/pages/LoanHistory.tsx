import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, Search, X, FileText, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { ListSkeletonLoader } from "@/components/ui/skeleton-loader";
import { useUserLoans } from "@/hooks/useLoanQueries";
import { useLoanApplicationGate } from "@/hooks/useLoanApplicationGate";
import * as Types from "@/lib/api-types";

interface Loan {
  id: string;
  reference: string;
  type: string;
  amount: number;
  status: "approved" | "repaid" | "rejected" | "pending";
  date: string;
  outstanding?: number;
  progress?: number;
}

/**
 * Loan History Page
 * Design: Mobile-native banking app style matching reference designs
 * - Green gradient header
 * - Search and filter functionality
 * - Loan cards with status badges
 * - Fully responsive on mobile without zoom
 */
export default function LoanHistory() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const loansQuery = useUserLoans();
  const { canApply, inProgressLoan } = useLoanApplicationGate();
  const isLoading = loansQuery.isLoading;
  const error = loansQuery.error
    ? loansQuery.error instanceof Error
      ? loansQuery.error.message
      : (loansQuery.error as { message?: string }).message || "Failed to load loans. Please try again."
    : null;

  const loans = useMemo(() => {
    const fetchedLoans = loansQuery.data ?? [];
    return fetchedLoans.map((loan) => {
      const progress = loan.loanAmount > 0 ? Math.round((loan.amountPaid / loan.loanAmount) * 100) : 0;
      const loanTypeLabel = loan.loanType === "business" ? "Business Loan" : "Personal Loan";
      return {
        id: loan.id,
        reference: loan.loanId,
        type: loanTypeLabel,
        amount: loan.loanAmount,
        status: mapLoanStatus(loan.status),
        date: new Date(loan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        outstanding: loan.amountRemaining,
        progress,
      } as Loan;
    });
  }, [loansQuery.data]);

  function mapLoanStatus(status: Types.LoanDetails["status"]): Loan["status"] {
    switch (status) {
      case "active":
        return "approved";
      case "completed":
        return "repaid";
      case "pending":
        return "pending";
      case "rejected":
      case "defaulted":
        return "rejected";
      default:
        return "pending";
    }
  }

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || loan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "repaid":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "approved", label: "Active" },
    { value: "repaid", label: "Repaid" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white px-5 py-6">
          <h1 className="text-2xl font-bold">My Loans</h1>
        </header>
        <main className="flex-1 px-5 py-6">
          <ListSkeletonLoader count={5} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-5 pt-6 pb-6 w-full">
          <h1 className="text-2xl font-bold mb-1">My Loans</h1>
          <p className="text-white/70 text-base">View and manage your loans</p>
        </div>
      </header>

      {/* Search and Filter Card */}
      <div className="px-5 -mt-3 flex-shrink-0 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-full">
          {/* Search Bar */}
          <div className="relative mb-4 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter Pills - Scrollable on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  filterStatus === filter.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        {/* Results Count */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        <p className="text-sm text-gray-500 mb-4">
          {filteredLoans.length} loan{filteredLoans.length !== 1 ? "s" : ""} found
        </p>

        {/* Loans List */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <button
                key={loan.id}
                onClick={() => setLocation(`/loans/${loan.id}`)}
                className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-left active:scale-[0.98] transition-transform shadow-sm hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{loan.type}</h3>
                    <p className="text-sm text-gray-500 truncate">{loan.reference}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${getStatusStyle(loan.status)}`}>
                      {loan.status === "approved" ? "Active" : loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4 min-w-0">
                    <p className="text-xs text-gray-500 mb-2">Loan Amount</p>
                    <p className="font-bold text-gray-900 text-base truncate">K{loan.amount.toLocaleString()}</p>
                  </div>
                  {loan.outstanding !== undefined ? (
                    <div className="bg-primary/5 rounded-xl p-4 min-w-0">
                      <p className="text-xs text-gray-500 mb-2">Outstanding</p>
                      <p className="font-bold text-primary text-base truncate">K{loan.outstanding.toLocaleString()}</p>
                    </div>
                  ) : loan.status === "repaid" ? (
                    <div className="bg-green-50 rounded-xl p-4 min-w-0">
                      <p className="text-xs text-gray-500 mb-2">Completed</p>
                      <p className="font-bold text-green-600 text-base truncate">{loan.date}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 min-w-0">
                      <p className="text-xs text-gray-500 mb-2">Applied</p>
                      <p className="font-bold text-gray-900 text-base truncate">{loan.date}</p>
                    </div>
                  )}
                </div>

                {loan.progress !== undefined && loan.status !== "rejected" && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden min-w-0">
                      <div 
                        className={`h-full rounded-full ${loan.status === "repaid" ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 font-semibold flex-shrink-0">{loan.progress}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">No Loans Found</h3>
            <p className="text-gray-500 text-base mb-6">
              {searchTerm ? "Try adjusting your search or filters" : "You don't have any loans yet"}
            </p>
            {canApply ? (
              <Button
                onClick={() => setLocation("/apply")}
                className="rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-12 px-6 text-base"
              >
                Apply for a Loan
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">You have a loan application in progress</p>
                </div>
                <Button
                  onClick={() => setLocation(`/loans/${inProgressLoan?.id}`)}
                  className="rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-12 px-6 text-base"
                >
                  View Application Status
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
