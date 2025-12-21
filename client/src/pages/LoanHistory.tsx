import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
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
 * Design: Mobile-native banking app style
 * - Clean list with status indicators
 * - Search and filter functionality
 */
export default function LoanHistory() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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
        return "bg-slate-100 text-slate-700";
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900 text-center">
            My Loans
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-0 text-sm bg-slate-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === filter.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        {/* Results Count */}
        <p className="text-xs text-slate-500 mb-3">
          {filteredLoans.length} loan{filteredLoans.length !== 1 ? "s" : ""} found
        </p>

        {/* Loans List */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-3">
            {filteredLoans.map((loan) => (
              <button
                key={loan.id}
                onClick={() => setLocation(`/loans/${loan.id}`)}
                className="w-full bg-white rounded-2xl border border-slate-100 p-4 text-left active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {loan.type}
                    </h3>
                    <p className="text-xs text-slate-500">{loan.id}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${getStatusStyle(loan.status)}`}>
                    {loan.status === "approved" ? "Active" : loan.status}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Amount</p>
                    <p className="font-bold text-slate-900">K{loan.amount.toLocaleString()}</p>
                  </div>
                  {loan.outstanding !== undefined && (
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Outstanding</p>
                      <p className="font-bold text-primary">K{loan.outstanding.toLocaleString()}</p>
                    </div>
                  )}
                  {loan.status === "repaid" && (
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Completed</p>
                      <p className="font-bold text-green-600">{loan.date}</p>
                    </div>
                  )}
                </div>

                {loan.progress !== undefined && loan.status !== "rejected" && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${loan.status === "repaid" ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{loan.progress}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">
              No loans found
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => setLocation("/apply")}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-10 px-6 text-sm"
            >
              Apply for a Loan
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
