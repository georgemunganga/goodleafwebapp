import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, Search, Filter } from "lucide-react";
import { useState } from "react";

interface Loan {
  id: string;
  type: string;
  amount: number;
  status: "approved" | "repaid" | "rejected" | "pending";
  date: string;
  outstanding?: number;
}

/**
 * Loan History Page
 * Design: Mobile-first responsive with modern branding
 * - Loan list with filtering
 * - Search functionality
 * - Status badges
 */
export default function LoanHistory() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const loans: Loan[] = [
    {
      id: "GL-2025-001",
      type: "Personal Loan",
      amount: 10000,
      status: "approved",
      date: "Dec 20, 2025",
      outstanding: 7500
    },
    {
      id: "GL-2024-012",
      type: "Personal Loan",
      amount: 5000,
      status: "repaid",
      date: "Aug 15, 2024"
    },
    {
      id: "GL-2024-008",
      type: "Business Loan",
      amount: 50000,
      status: "approved",
      date: "May 10, 2024",
      outstanding: 35000
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
    const matchesType = filterType === "all" || loan.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-secondary/10 text-secondary";
      case "repaid":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      case "pending":
        return "bg-accent/10 text-accent";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex items-center justify-between h-14 md:h-20 px-4 md:px-6">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-8 md:h-10"
            />
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">Loan History</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search and Filter Section */}
          <div className="mb-6 md:mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Loan ID or Type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 md:py-3 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-xs md:text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="repaid">Repaid</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-xs md:text-sm bg-white"
              >
                <option value="all">All Types</option>
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterType("all");
                }}
                className="px-3 md:px-4 py-2 md:py-3 rounded-full border-2 border-slate-200 hover:bg-slate-50 transition-colors text-xs md:text-sm font-medium text-slate-700 flex items-center justify-center gap-1 md:gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Loans List */}
          {filteredLoans.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {filteredLoans.map((loan) => (
                <button
                  key={loan.id}
                  onClick={() => setLocation(`/loans/${loan.id}`)}
                  className="w-full p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm md:text-lg mb-1 truncate">
                        {loan.type}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600">
                        Loan ID: {loan.id}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(loan.status)}`}>
                      {getStatusLabel(loan.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-0">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Loan Amount</p>
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        K{loan.amount.toLocaleString()}
                      </p>
                    </div>
                    {loan.outstanding && (
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Outstanding</p>
                        <p className="font-bold text-primary text-sm md:text-base">
                          K{loan.outstanding.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Date</p>
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        {loan.date}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-end text-primary group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                No loans found
              </h3>
              <p className="text-sm md:text-base text-slate-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => setLocation("/apply")}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 px-6 md:px-8 text-sm md:text-base"
              >
                Apply for a Loan
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
