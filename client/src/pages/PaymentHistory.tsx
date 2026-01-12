/**
 * Payment History Page
 * Displays detailed payment history and transaction timeline
 */

import { useLocation } from "wouter";
import { ChevronLeft, Download, Filter, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  type: "payment" | "fee" | "interest";
  description: string;
  reference: string;
}

export default function PaymentHistory() {
  const [, setLocation] = useLocation();

  const transactions: Transaction[] = [
    {
      id: "TXN001",
      date: "Jan 12, 2025",
      amount: 916.67,
      status: "completed",
      type: "payment",
      description: "Monthly Loan Payment",
      reference: "GL-2025-001"
    },
    {
      id: "TXN002",
      date: "Dec 12, 2024",
      amount: 916.67,
      status: "completed",
      type: "payment",
      description: "Monthly Loan Payment",
      reference: "GL-2025-001"
    },
    {
      id: "TXN003",
      date: "Nov 15, 2024",
      amount: 500,
      status: "completed",
      type: "fee",
      description: "Service Fee",
      reference: "GL-2025-001"
    },
    {
      id: "TXN004",
      date: "Nov 12, 2024",
      amount: 916.67,
      status: "pending",
      type: "payment",
      description: "Monthly Loan Payment",
      reference: "GL-2025-001"
    },
    {
      id: "TXN005",
      date: "Oct 12, 2024",
      amount: 916.67,
      status: "completed",
      type: "payment",
      description: "Monthly Loan Payment",
      reference: "GL-2025-001"
    },
    {
      id: "TXN006",
      date: "Oct 10, 2024",
      amount: 150,
      status: "failed",
      type: "payment",
      description: "Monthly Loan Payment",
      reference: "GL-2025-001"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-100";
      case "pending":
        return "bg-yellow-50 border-yellow-100";
      case "failed":
        return "bg-red-50 border-red-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white px-5 py-6 flex items-center gap-3">
        <button
          onClick={() => setLocation("/loans/GL-2025-001")}
          className="hover:bg-white/20 rounded-lg p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-sm text-green-100">Loan GL-2025-001</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-2">Total Paid</p>
            <p className="text-xl font-bold text-gray-900">K5,500</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-2">Remaining</p>
            <p className="text-xl font-bold text-gray-900">K4,500</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-2">On Time</p>
            <p className="text-xl font-bold text-green-600">100%</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant="outline"
            className="border-2 border-primary text-primary bg-primary/5 font-semibold px-4 py-2 rounded-lg flex-shrink-0"
          >
            All
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg flex-shrink-0 hover:bg-gray-50"
          >
            Completed
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg flex-shrink-0 hover:bg-gray-50"
          >
            Pending
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg flex-shrink-0 hover:bg-gray-50"
          >
            Failed
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`rounded-2xl border-2 p-4 transition-all hover:shadow-md ${getStatusColor(transaction.status)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-1">{getStatusIcon(transaction.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                    <p className="text-xs text-gray-500 mt-1">Ref: {transaction.reference}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">K{transaction.amount.toLocaleString()}</p>
                  <p className={`text-xs font-semibold ${
                    transaction.status === "completed" ? "text-green-600" :
                    transaction.status === "pending" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {getStatusText(transaction.status)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download Statement */}
        <Button
          onClick={() => alert("Downloading statement...")}
          variant="outline"
          className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <Download className="w-5 h-5" />
          Download Statement
        </Button>
      </main>
    </div>
  );
}
