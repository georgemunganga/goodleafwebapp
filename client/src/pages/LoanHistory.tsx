import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, Search, X, FileText } from "lucide-react";
import { useState } from "react";

interface Loan {
  id: string;
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

  const loans: Loan[] = [
    {
      id: "GL-2025-001",
      type: "Personal Loan",
      amount: 10000,
      status: "approved",
      date: "Dec 20, 2024",
      outstanding: 7500,
      progress: 25
    },
    {
      id: "GL-2024-012",
      type: "Personal Loan",
      amount: 5000,
      status: "repaid",
      date: "Aug 15, 2024",
      progress: 100
    },
    {
      id: "GL-2024-008",
      type: "Business Loan",
      amount: 50000,
      status: "approved",
      date: "May 10, 2024",
      outstanding: 35000,
      progress: 30
    },
    {
      id: "GL-2024-003",
      type: "Personal Loan",
      amount: 8000,
      status: "rejected",
      date: "Feb 28, 2024"
    }
  ];

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-4 sm:px-5 pt-6 pb-6 w-full">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">My Loans</h1>
          <p className="text-white/70 text-sm">View and manage your loans</p>
        </div>
      </header>

      {/* Search and Filter Card */}
      <div className="px-4 sm:px-5 -mt-3 flex-shrink-0 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 w-full">
          {/* Search Bar */}
          <div className="relative mb-3 sm:mb-4 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter Pills - Scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
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
      <main className="flex-1 px-4 sm:px-5 py-4 sm:py-6 w-full overflow-y-auto">
        {/* Results Count */}
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          {filteredLoans.length} loan{filteredLoans.length !== 1 ? "s" : ""} found
        </p>

        {/* Loans List */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredLoans.map((loan) => (
              <button
                key={loan.id}
                onClick={() => setLocation(`/loans/${loan.id}`)}
                className="w-full bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 text-left active:scale-[0.98] transition-transform shadow-sm hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{loan.type}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{loan.id}</p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${getStatusStyle(loan.status)}`}>
                      {loan.status === "approved" ? "Active" : loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-3 min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Loan Amount</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base truncate">K{loan.amount.toLocaleString()}</p>
                  </div>
                  {loan.outstanding !== undefined ? (
                    <div className="bg-primary/5 rounded-xl p-2 sm:p-3 min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Outstanding</p>
                      <p className="font-bold text-primary text-sm sm:text-base truncate">K{loan.outstanding.toLocaleString()}</p>
                    </div>
                  ) : loan.status === "repaid" ? (
                    <div className="bg-green-50 rounded-xl p-2 sm:p-3 min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Completed</p>
                      <p className="font-bold text-green-600 text-sm sm:text-base truncate">{loan.date}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-2 sm:p-3 min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Applied</p>
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{loan.date}</p>
                    </div>
                  )}
                </div>

                {loan.progress !== undefined && loan.status !== "rejected" && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden min-w-0">
                      <div 
                        className={`h-full rounded-full ${loan.status === "repaid" ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium flex-shrink-0">{loan.progress}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">No Loans Found</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
              {searchTerm ? "Try adjusting your search or filters" : "You don't have any loans yet"}
            </p>
            <Button
              onClick={() => setLocation("/apply")}
              className="rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
            >
              Apply for a Loan
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
