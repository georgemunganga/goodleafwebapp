import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Repayment Submission Page
 * Design: Mobile-first responsive with modern branding
 * - Bank details display
 * - Payment proof upload
 * - Pending confirmation status
 */
export default function RepaymentSubmission() {
  const [, setLocation] = useLocation();
  const [paymentAmount, setPaymentAmount] = useState("916.67");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const bankDetails = {
    bankName: "Zambia National Commercial Bank",
    accountName: "Goodleaf Loans Ltd",
    accountNumber: "1234567890",
    branchCode: "001",
    swiftCode: "ZNCBZAMX"
  };

  const loanInfo = {
    loanId: "GL-2025-001",
    outstanding: 7500,
    monthlyPayment: 916.67,
    nextPaymentDate: "Jan 31, 2025"
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFile) {
      setIsSubmitted(true);
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    }
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
            <ChevronLeft className="w-6 h-6 text-slate-900" />
            <span className="text-sm md:text-base font-semibold text-slate-900">Back</span>
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">Make Payment</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <div className="space-y-6 md:space-y-8">
              {/* Loan Info Card */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20">
                <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Loan ID</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {loanInfo.loanId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Outstanding Balance</p>
                    <p className="font-bold text-primary text-sm md:text-base">
                      K{loanInfo.outstanding.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Due Date</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {loanInfo.nextPaymentDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details Card */}
              <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
                <h3 className="font-bold text-slate-900 mb-6 text-lg md:text-xl">
                  Bank Details for Transfer
                </h3>
                <div className="space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Bank Name</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {bankDetails.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Account Name</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {bankDetails.accountName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Account Number</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base font-mono">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Branch Code</p>
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        {bankDetails.branchCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">SWIFT Code</p>
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        {bankDetails.swiftCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 text-lg md:text-xl">
                  Payment Amount
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Amount to Pay (ZMW)
                    </label>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="h-12 md:h-14 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-base md:text-lg font-bold"
                    />
                  </div>
                  <p className="text-xs md:text-sm text-slate-600">
                    Monthly payment: K{loanInfo.monthlyPayment.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Upload Payment Proof */}
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-6 text-lg md:text-xl">
                    Upload Payment Proof
                  </h3>

                  <div className="space-y-4">
                    <label className="block">
                      <div className="border-2 border-dashed border-primary/30 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <Upload className="w-8 h-8 md:w-12 md:h-12 text-primary mx-auto mb-3" />
                        <p className="font-semibold text-slate-900 text-sm md:text-base mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs md:text-sm text-slate-600">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                        className="hidden"
                        required
                      />
                    </label>

                    {uploadedFile && (
                      <div className="p-4 md:p-6 bg-green-50 rounded-2xl md:rounded-3xl border-2 border-green-200 flex items-start gap-3 md:gap-4">
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-900 text-sm md:text-base">
                            File uploaded
                          </p>
                          <p className="text-xs md:text-sm text-green-700 truncate">
                            {uploadedFile}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 md:p-6 bg-blue-50 rounded-2xl md:rounded-3xl border border-blue-200 flex items-start gap-3 md:gap-4">
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm md:text-base mb-1">
                      Payment Confirmation
                    </p>
                    <p className="text-xs md:text-sm text-blue-700">
                      Your payment proof will be verified by our team. Once confirmed, your loan balance will be updated automatically.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!uploadedFile}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white font-semibold py-3 h-12 md:h-14 text-base md:text-lg"
                >
                  Submit Payment Proof
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Payment Submitted!
              </h2>
              <p className="text-slate-600 text-sm md:text-base mb-8">
                Your payment proof has been received. We'll verify it shortly and update your loan balance.
              </p>
              <Button
                onClick={() => setLocation("/dashboard")}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 px-6 md:px-8 text-sm md:text-base"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
