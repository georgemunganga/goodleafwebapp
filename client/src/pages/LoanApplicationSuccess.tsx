/**
 * Loan Application Success Page
 * Displays after successful loan application submission
 * Shows loan details and next steps
 */

import { useLocation } from "wouter";
import { CheckCircle2, ChevronRight, Download, Clock, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoanApplicationSuccess() {
  const [, setLocation] = useLocation();

  const loanDetails = {
    loanId: "GL-2025-001",
    loanAmount: 10000,
    amountReceived: 9500,
    monthlyPayment: 916.67,
    repaymentMonths: 12,
    interestRate: 1.5,
    serviceFee: 500,
    approvalDate: "Jan 12, 2025",
    firstPaymentDate: "Feb 12, 2025",
    status: "approved"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white px-5 py-6">
        <h1 className="text-2xl font-bold">Application Approved</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-8 space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-in fade-in zoom-in">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
          <p className="text-gray-600">Your loan application has been approved</p>
          <p className="text-sm text-gray-500">Loan ID: {loanDetails.loanId}</p>
        </div>

        {/* Loan Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Loan Details</h3>

          {/* Amount Details */}
          <div className="space-y-3 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <span className="text-gray-600">Loan Amount</span>
              </div>
              <span className="font-bold text-gray-900">K{loanDetails.loanAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Service Fee (5%)</span>
              <span className="text-gray-700 text-sm">-K{loanDetails.serviceFee.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-900">Amount to Receive</span>
              <span className="font-bold text-primary text-lg">K{loanDetails.amountReceived.toLocaleString()}</span>
            </div>
          </div>

          {/* Repayment Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600">Monthly Payment</span>
              </div>
              <span className="font-bold text-gray-900">K{loanDetails.monthlyPayment.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Repayment Period</span>
              <span className="text-gray-700 text-sm">{loanDetails.repaymentMonths} months</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Interest Rate</span>
              <span className="text-gray-700 text-sm">{loanDetails.interestRate}% per month</span>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Important Dates</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Approval Date</p>
                <p className="font-semibold text-gray-900">{loanDetails.approvalDate}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">First Payment Due</p>
                <p className="font-semibold text-gray-900">{loanDetails.firstPaymentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Next Steps</h3>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Funds will be disbursed</p>
                <p className="text-sm text-gray-600">To your registered bank account within 24 hours</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Set up payment reminders</p>
                <p className="text-sm text-gray-600">Enable notifications to never miss a payment</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Make your first payment</p>
                <p className="text-sm text-gray-600">Payment is due on {loanDetails.firstPaymentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Agreement */}
        <Button
          onClick={() => alert("Downloading loan agreement...")}
          variant="outline"
          className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <Download className="w-5 h-5" />
          Download Loan Agreement
        </Button>
      </main>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 space-y-3">
        <Button
          onClick={() => setLocation("/dashboard")}
          className="w-full bg-primary hover:bg-[#256339] text-white font-semibold py-3 rounded-lg"
        >
          Go to Dashboard
        </Button>
        <Button
          onClick={() => setLocation("/loans")}
          variant="outline"
          className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg"
        >
          View My Loans
        </Button>
      </div>
    </div>
  );
}
