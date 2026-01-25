/**
 * Payment History Page
 * Displays detailed payment history and transaction timeline
 */

import { useLocation, useRoute } from "wouter";
import { ChevronLeft, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { paymentService } from "@/lib/api-service";
import * as Types from "@/lib/api-types";

interface Transaction extends Types.PaymentHistory {
  type: "payment" | "fee" | "interest";
}

export default function PaymentHistory() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/:id/payment-history");
  const loanId = params?.id || "";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!loanId) {
        setIsLoading(false);
        setError("Loan not found.");
        return;
      }

      try {
        setIsLoading(true);
        const history = await paymentService.getPaymentHistory(loanId);
        const mapped = history.map((item) => ({
          ...item,
          type: "payment",
        }));
        setTransactions(mapped);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
        setError("Failed to load payment history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [loanId]);

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
          onClick={() => setLocation(`/loans/${loanId || ""}`)}
          className="hover:bg-white/20 rounded-lg p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-sm text-green-100">Loan {loanId || ""}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-500">Loading payment history...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-sm text-gray-600 mb-2">Total Paid</p>
                <p className="text-xl font-bold text-gray-900">
                  K{transactions
                    .filter((t) => t.status === "completed")
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-sm text-gray-600 mb-2">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {transactions.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-sm text-gray-600 mb-2">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {transactions.filter((t) => t.status === "pending").length}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`rounded-2xl border-2 p-4 transition-all hover:shadow-md ${getStatusColor(transaction.status)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1">{getStatusIcon(transaction.status)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
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
                ))
              ) : (
                <div className="text-center text-gray-500">No payments found.</div>
              )}
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
          </>
        )}
      </main>
    </div>
  );
}
