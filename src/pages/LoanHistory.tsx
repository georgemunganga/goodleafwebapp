import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, Search, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useLoans } from "@/contexts/LoanContext";
import { Loan } from "@/types";

/**
 * Loan History Page
 * Design: Mobile-native banking app style matching reference designs
 * - Green gradient header
 * - Search and filter functionality
 * - Loan cards with status badges
 */
export default function LoanHistory() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { loans, isLoading, error, fetchLoans } = useLoans();

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const filteredLoans = loans.filter((loan: Loan) => {
    const matchesSearch = 
      loan.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = loan.status === "paid" ? "repaid" : loan.status;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && normalizedStatus === "active") ||
      normalizedStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-700";
      case "paid":
      case "repaid":
        return "bg-blue-100 text-blue-700";
      case "restructuring_requested":
        return "bg-purple-100 text-purple-700";
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
    { value: "active", label: "Active" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Processing" },
    { value: "repaid", label: "Repaid" },
    { value: "rejected", label: "Declined" }
  ];

  const getStatusLabel = (status: Loan["status"]) => {
    if (status === "approved") return "Approved";
    if (status === "active") return "Active";
    if (status === "paid" || status === "repaid") return "Repaid";
    if (status === "pending") return "Processing";
    if (status === "rejected") return "Declined";
    if (status === "restructuring_requested") return "Restructuring";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white">
        <div className="px-5 pt-6 pb-6">
          <h1 className="text-2xl font-bold mb-1">My Loans</h1>
          <p className="text-white/70">View and manage your loans</p>
        </div>
      </header>

      {/* Search and Filter Card */}
      <div className="px-5 -mt-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by loan ID or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
      <main className="px-5 py-6">
        {/* Results Count */}
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
                className="w-full bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-[0.98] transition-transform shadow-sm hover:border-primary/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{loan.type}</h3>
                    <p className="text-sm text-gray-500">{loan.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(loan.status)}`}>
                      {getStatusLabel(loan.status)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                    <p className="font-bold text-gray-900">K{loan.amount.toLocaleString()}</p>
                  </div>
                  {loan.outstanding !== undefined ? (
                    <div className="bg-primary/5 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                      <p className="font-bold text-primary">K{loan.outstanding.toLocaleString()}</p>
                    </div>
                  ) : loan.status === "repaid" ? (
                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Completed</p>
                      <p className="font-bold text-green-600">{loan.date}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Applied</p>
                      <p className="font-bold text-gray-900">{loan.date}</p>
                    </div>
                  )}
                </div>

                {loan.progress !== undefined && loan.status !== "rejected" && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${loan.status === "repaid" ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{loan.progress}% paid</span>
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
            <h3 className="font-bold text-gray-900 mb-1">No Loans Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchTerm ? "Try adjusting your search or filters" : "You don't have any loans yet"}
            </p>
            <Button
              onClick={() => setLocation("/apply")}
              className="rounded-xl bg-primary hover:bg-[#256339] text-white font-semibold h-12 px-6"
            >
              Apply for a Loan
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
