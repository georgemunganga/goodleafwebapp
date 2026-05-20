import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeft, Upload, CheckCircle2, Copy, Info, Building2, WalletCards } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { FormRecoveryModal } from "@/components/FormRecoveryModal";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { loanService, paymentService } from "@/lib/api-service";
import * as Types from "@/lib/api-types";
import { isActiveLoanStatus } from "@/lib/loan-status";
import { useAuthContext } from "@/contexts/AuthContext";
import { applyPaymentToLoanRecords } from "@/lib/payment-cache";
import { queryKeys } from "@/hooks/query-keys";
import { buildCacheKey, writePersistedCache } from "@/lib/persisted-cache";

/**
 * Repayment Submission Page
 * Design: Mobile-native banking app style
 * - Bank details with copy functionality
 * - Payment proof upload
 * - Success confirmation
 */
export default function RepaymentSubmission() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [paymentAmount, setPaymentAmount] = useState("916.67");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [savedDataInfo, setSavedDataInfo] = useState<any>(null);
  const [loanInfo, setLoanInfo] = useState<Types.LoanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [channels, setChannels] = useState<Types.PaymentCollectionChannel[]>([]);
  const [selectedChannelCode, setSelectedChannelCode] = useState("");
  const [reference, setReference] = useState("");

  // Form persistence
  const { saveForm, restoreForm, clearForm, hasSavedData, getSavedDataInfo } =
    useFormPersistence({
      key: 'repayment-submission',
      debounceMs: 500,
    });

  useEffect(() => {
    const fetchRepaymentData = async () => {
      try {
        setIsLoading(true);
        const [loans, collectionChannels] = await Promise.all([
          loanService.getUserLoans(),
          paymentService.getCollectionChannels(),
        ]);
        const activeLoan = loans.find((loan) => isActiveLoanStatus(loan.status));
        if (!activeLoan) {
          setError("No active loan found for repayment.");
          return;
        }
        setLoanInfo(activeLoan);
        setPaymentAmount(activeLoan.monthlyPayment.toFixed(2));
        setReference(activeLoan.loanId);
        setChannels(collectionChannels);
        const firstAvailable = collectionChannels.find((channel) => channel.available) ?? collectionChannels[0];
        setSelectedChannelCode((current) => current || firstAvailable?.code || "");
        setError(null);
      } catch (err) {
        console.error("Failed to load repayment data:", err);
        setError("Failed to load repayment information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepaymentData();
  }, []);

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
        uploadedFileName,
        selectedChannelCode,
        reference,
        timestamp: Date.now(),
      });
    }
  }, [paymentAmount, uploadedFileName, selectedChannelCode, reference, isSubmitted, saveForm]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File must be 10MB or smaller.");
        return;
      }
      setUploadedFile(file);
      setUploadedFileName(file.name);
    }
  };

  const selectedChannel = channels.find((channel) => channel.code === selectedChannelCode) ?? null;
  const proofRequired = selectedChannel?.requiresProof ?? true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanInfo) return;
    if (!selectedChannel || !selectedChannel.available) {
      toast.error("Choose an available collection channel.");
      return;
    }
    if (proofRequired && !uploadedFile) {
      toast.error("Upload proof for this repayment channel.");
      return;
    }

    const amount = parseFloat(paymentAmount) || 0;
    if (!amount) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await paymentService.submitPayment({
        loanId: loanInfo.loanId,
        amount,
        paymentMethod: selectedChannel.code,
        reference: reference.trim() || uploadedFile?.name || loanInfo.loanId,
        proof: uploadedFile ?? undefined,
      });

      if (response.success) {
        if (response.status === "completed") {
          const paidAt = new Date().toISOString();
          const loansCacheKey = buildCacheKey("loans", [user?.id ?? "me"]);

          try {
            const refreshedLoans = await loanService.getUserLoans();
            queryClient.setQueryData(queryKeys.loans.list({ userId: user?.id }), refreshedLoans);
            writePersistedCache(loansCacheKey, refreshedLoans);
          } catch (refreshError) {
            const existingLoans =
              queryClient.getQueryData<Types.LoanDetails[]>(queryKeys.loans.list({ userId: user?.id })) ?? [];
            const optimisticLoans = applyPaymentToLoanRecords(existingLoans, {
              loanId: loanInfo.loanId,
              amount,
              paidAt,
            });

            queryClient.setQueryData(queryKeys.loans.list({ userId: user?.id }), optimisticLoans);
            writePersistedCache(loansCacheKey, optimisticLoans);
            console.warn("Fell back to optimistic dashboard payment update.", refreshError);
          }
        }

        queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });

        clearForm(); // Clear saved form after successful submission
        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to submit payment.");
      }
    } catch (err) {
      console.error("Payment submission failed:", err);
      const message =
        typeof (err as any)?.message === "string" && (err as any).message.trim().length > 0
          ? (err as any).message
          : "Failed to submit payment.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoveryResume = () => {
    const savedData = restoreForm();
    if (savedData) {
      setPaymentAmount(savedData.paymentAmount || "916.67");
      setSelectedChannelCode(savedData.selectedChannelCode || selectedChannelCode);
      setReference(savedData.reference || reference);
      setUploadedFile(null);
      setUploadedFileName(null);
      if (savedData.uploadedFileName) {
        toast.info("Re-upload the payment proof file before submitting.");
      }
    }
    setShowRecoveryModal(false);
  };

  const handleRecoveryStartFresh = () => {
    clearForm();
    setPaymentAmount("916.67");
    setSelectedChannelCode("");
    setReference("");
    setUploadedFile(null);
    setUploadedFileName(null);
    setShowRecoveryModal(false);
  };

  const handleRecoveryCancel = () => {
    setShowRecoveryModal(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Payment Submitted for Approval
        </h2>
        <p className="text-slate-500 text-center mb-8 max-w-xs">
          A Goodleaf staff member will verify your proof before your loan balance changes.
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
        onCancel={handleRecoveryCancel}
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
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
            <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Payment Amount */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500">Loan {loanInfo?.loanId || "Loan"}</p>
              <p className="text-slate-600 text-sm">
                Outstanding:{" "}
                <span className="font-bold text-primary">
                  K{loanInfo ? loanInfo.amountRemaining.toLocaleString() : "0"}
                </span>
              </p>
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
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 text-center">
              Suggested: K{loanInfo ? loanInfo.monthlyPayment.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        {/* Collection Channel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 mb-4">Choose Collection Channel</h3>

          {channels.length === 0 && !isLoading && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                No repayment collection channels are configured yet. Contact Goodleaf before making payment.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {channels.map((channel) => {
              const isSelected = channel.code === selectedChannelCode;
              const Icon = channel.channel === "mobile_money" ? WalletCards : Building2;

              return (
                <button
                  key={channel.code}
                  type="button"
                  disabled={!channel.available}
                  onClick={() => setSelectedChannelCode(channel.code)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 bg-white hover:border-primary/40"
                  } ${!channel.available ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{channel.name}</p>
                      <p className="text-xs text-slate-500">
                        {channel.available
                          ? channel.requiresProof
                            ? "Proof required before admin approval"
                            : "Posts immediately"
                          : "Admin has not configured account details yet"}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedChannel && (
            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3">
              {selectedChannel.account?.bankName && (
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Bank / Provider</p>
                    <p className="font-medium text-slate-900 text-sm">{selectedChannel.account.bankName}</p>
                  </div>
                </div>
              )}

              {selectedChannel.account?.accountName && (
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Account Name</p>
                    <p className="font-medium text-slate-900 text-sm">{selectedChannel.account.accountName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedChannel.account?.accountName || "", "Account name")}
                    className="p-2 hover:bg-white rounded-lg"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}

              {selectedChannel.account?.accountNumber && (
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Account Number</p>
                    <p className="font-bold text-slate-900 font-mono">{selectedChannel.account.accountNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedChannel.account?.accountNumber || "", "Account number")}
                    className="p-2 hover:bg-white rounded-lg"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}

              {selectedChannel.account?.branchCode && (
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Branch / Routing</p>
                    <p className="font-medium text-slate-900 text-sm">{selectedChannel.account.branchCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedChannel.account?.branchCode || "", "Branch/routing")}
                    className="p-2 hover:bg-white rounded-lg"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}

              {selectedChannel.instructions && (
                <p className="text-xs text-slate-600">{selectedChannel.instructions}</p>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Payment Reference
                </label>
                <Input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder={selectedChannel.account?.referenceHint || "Receipt or transfer reference"}
                  className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                />
                <p className="text-xs text-slate-500">
                  Enter the transfer receipt number or use your loan number if the channel asks for a reference.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Payment Proof */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-4">
              Upload Proof of Payment {proofRequired ? "" : "(Optional)"}
            </h3>

            <label className="block">
              <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                uploadedFile ? "border-green-300 bg-green-50" : "border-slate-200 hover:border-primary/50"
              }`}>
                {uploadedFileName ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-800 text-sm">{uploadedFileName}</p>
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
              Choose an admin-configured collection channel, upload your receipt, and Goodleaf will approve it before posting the repayment to your loan.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={(proofRequired && !uploadedFile) || !selectedChannel?.available || isSubmitting || isLoading || !loanInfo}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold h-12"
          >
            {isSubmitting ? "Submitting..." : "Submit Payment"}
          </Button>
        </form>
      </main>
    </div>
    </>
  );
}
