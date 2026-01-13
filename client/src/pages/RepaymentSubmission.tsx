import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, Upload, CheckCircle2, Copy, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FormRecoveryModal } from "@/components/FormRecoveryModal";
import { useFormPersistence } from "@/hooks/useFormPersistence";

/**
 * Repayment Submission Page
 * Design: Mobile-native banking app style
 * - Bank details with copy functionality
 * - Payment proof upload
 * - Success confirmation
 */
export default function RepaymentSubmission() {
  const [, setLocation] = useLocation();
  const [paymentAmount, setPaymentAmount] = useState("916.67");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [savedDataInfo, setSavedDataInfo] = useState<any>(null);

  // Form persistence
  const { saveForm, restoreForm, clearForm, hasSavedData, getSavedDataInfo } =
    useFormPersistence({
      key: 'repayment-submission',
      debounceMs: 500,
    });

  const bankDetails = {
    bankName: "Zambia National Commercial Bank",
    accountName: "Goodleaf Loans Ltd",
    accountNumber: "1234567890",
    branchCode: "001"
  };

  const loanInfo = {
    loanId: "GL-2025-001",
    outstanding: 7500,
    monthlyPayment: 916.67
  };

  // Auto-save on mount
  useEffect(() => {
    if (hasSavedData()) {
      const info = getSavedDataInfo();
      setSavedDataInfo(info);
      setShowRecoveryModal(true);
    }
  }, [hasSavedData, getSavedDataInfo]);

  // Auto-save on change
  useEffect(() => {
    if (!isSubmitted) {
      saveForm({
        paymentAmount,
        uploadedFile,
        timestamp: Date.now(),
      });
    }
  }, [paymentAmount, uploadedFile, isSubmitted, saveForm]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
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
      clearForm(); // Clear saved form after successful submission
      setIsSubmitted(true);
    }
  };

  const handleRecoveryResume = () => {
    const savedData = restoreForm();
    if (savedData) {
      setPaymentAmount(savedData.paymentAmount || "916.67");
      setUploadedFile(savedData.uploadedFile || null);
    }
    setShowRecoveryModal(false);
  };

  const handleRecoveryStartFresh = () => {
    clearForm();
    setPaymentAmount("916.67");
    setUploadedFile(null);
    setShowRecoveryModal(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Payment Submitted!
        </h2>
        <p className="text-slate-500 text-center mb-8 max-w-xs">
          We'll verify your payment and update your balance within 24 hours.
        </p>
        <Button
          onClick={() => setLocation("/dashboard")}
          className="w-full max-w-xs rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <FormRecoveryModal
        open={showRecoveryModal}
        formName="Repayment Submission"
        savedTimestamp={savedDataInfo?.timestamp}
        onResume={handleRecoveryResume}
        onStartFresh={handleRecoveryStartFresh}
      />
      <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => setLocation("/dashboard")}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="flex-1 text-center font-bold text-slate-900">
            Make Payment
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-4">
        {/* Payment Amount */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500">Loan {loanInfo.loanId}</p>
              <p className="text-slate-600 text-sm">Outstanding: <span className="font-bold text-primary">K{loanInfo.outstanding.toLocaleString()}</span></p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Amount to Pay (ZMW)
            </label>
            <Input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="h-12 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 text-xl font-bold text-center"
            />
            <p className="text-xs text-slate-500 text-center">
              Suggested: K{loanInfo.monthlyPayment.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-4">Transfer to</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Bank</p>
                <p className="font-medium text-slate-900 text-sm">{bankDetails.bankName}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Account Name</p>
                <p className="font-medium text-slate-900 text-sm">{bankDetails.accountName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.accountName, "Account name")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Account Number</p>
                <p className="font-bold text-slate-900 font-mono">{bankDetails.accountNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.accountNumber, "Account number")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs text-slate-500">Branch Code</p>
                <p className="font-medium text-slate-900 text-sm">{bankDetails.branchCode}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.branchCode, "Branch code")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Upload Payment Proof */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-4">Upload Proof of Payment</h3>

            <label className="block">
              <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                uploadedFile ? "border-green-300 bg-green-50" : "border-slate-200 hover:border-primary/50"
              }`}>
                {uploadedFile ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-800 text-sm">{uploadedFile}</p>
                    <p className="text-xs text-green-600 mt-1">Tap to change</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-slate-700 text-sm">Tap to upload</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                className="hidden"
              />
            </label>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Upload a screenshot or receipt of your bank transfer. We'll verify and update your balance within 24 hours.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!uploadedFile}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold h-12"
          >
            Submit Payment
          </Button>
        </form>
      </main>
    </div>
    </>
  );
}
