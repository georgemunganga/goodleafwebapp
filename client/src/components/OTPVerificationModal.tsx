import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { OTPGrid } from './PINInput';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  otpId: string;
  email?: string;
  phone?: string;
  onResendOTP?: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * OTPVerificationModal Component
 * Displays OTP verification interface with:
 * - 6-digit OTP grid input
 * - Timer countdown (5 minutes)
 * - Resend OTP option
 * - Error handling
 */
export const OTPVerificationModal = React.forwardRef<
  HTMLDivElement,
  OTPVerificationModalProps
>(
  (
    {
      isOpen,
      onClose,
      onVerify,
      otpId,
      email,
      phone,
      onResendOTP,
      isLoading = false,
    },
    ref
  ) => {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [resendCount, setResendCount] = useState(0);

    // Timer countdown
    useEffect(() => {
      if (!isOpen) return;

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [isOpen]);

    // Format time display
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle OTP verification
    const handleVerify = async () => {
      if (otp.length !== 6) {
        setError('Please enter all 6 digits');
        return;
      }

      setIsVerifying(true);
      setError('');

      try {
        const success = await onVerify(otp);
        if (success) {
          toast.success('Two-factor authentication successful!');
          setOtp('');
          onClose();
        } else {
          setError('Invalid OTP. Please try again.');
          setOtp('');
        }
      } catch (err: any) {
        setError(err.message || 'Verification failed. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    // Handle resend OTP
    const handleResendOTP = async () => {
      if (!onResendOTP) return;

      try {
        await onResendOTP();
        setTimeLeft(300); // Reset timer
        setOtp('');
        setError('');
        setResendCount((prev) => prev + 1);
        toast.success('OTP sent successfully!');
      } catch (err: any) {
        setError(err.message || 'Failed to resend OTP');
      }
    };

    // Handle key press (Enter to verify)
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && otp.length === 6 && !isVerifying) {
        handleVerify();
      }
    };

    if (!isOpen) return null;

    const isExpired = timeLeft === 0;
    const displayEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';
    const displayPhone = phone ? phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1***$3') : '';

    return (
      <div
        ref={ref}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              We've sent a 6-digit code to:
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {displayEmail || displayPhone}
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-blue-600 font-medium">Code expires in</p>
              <p className="text-lg font-bold text-blue-900">{formatTime(timeLeft)}</p>
            </div>
          </div>

          {/* OTP Grid */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              Enter 6-digit code
            </label>
            <div
              onKeyDown={handleKeyDown}
              className="flex justify-center"
            >
              <OTPGrid
                value={otp}
                onChange={setOtp}
                disabled={isVerifying || isExpired}
                error={!!error}
                onComplete={() => {
                  if (otp.length === 6) {
                    handleVerify();
                  }
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Expired Message */}
          {isExpired && (
            <div className="flex items-start gap-3 px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                Code has expired. Please request a new one.
              </p>
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying || isExpired || isLoading}
            className="w-full bg-[#2e7146] hover:bg-[#1d4a2f] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </Button>

          {/* Resend OTP */}
          <div className="text-center space-y-3 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={isVerifying || !onResendOTP || resendCount >= 3}
              className="text-sm font-semibold text-[#2e7146] hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {resendCount >= 3
                ? 'Too many attempts. Try again later.'
                : `Resend Code${resendCount > 0 ? ` (${resendCount}/3)` : ''}`}
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center">
            For security, this code is valid for 5 minutes only.
          </p>
        </div>
      </div>
    );
  }
);

OTPVerificationModal.displayName = 'OTPVerificationModal';
