import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonLoader, LoadingSpinner } from '@/components/ui/loading-spinner';
import { FormField } from '@/components/FormField';
import { authService } from '@/lib/api-service';
import { PIN_SCHEMA } from '@/lib/validation-schemas';
import { toast } from 'sonner';

const SetPinSchema = z.object({
  pin: PIN_SCHEMA,
  confirmPin: PIN_SCHEMA,
}).superRefine(({ pin, confirmPin }, ctx) => {
  if (pin !== confirmPin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'PINs do not match',
      path: ['confirmPin'],
    });
  }
});

type SetPinForm = z.infer<typeof SetPinSchema>;

const getTokenFromUrl = () => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('token')?.trim() || '';
};

export default function SetPin() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SetPinForm>({
    resolver: zodResolver(SetPinSchema),
    mode: 'onBlur',
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  useEffect(() => {
    const runValidation = async () => {
      const urlToken = getTokenFromUrl();
      setToken(urlToken);

      if (!urlToken) {
        setIsTokenValid(false);
        setTokenMessage('This link is missing a token. Please use the email link again.');
        setIsValidatingToken(false);
        return;
      }

      setIsValidatingToken(true);
      try {
        const response = await authService.validatePinToken(urlToken);
        setIsTokenValid(!!response.success);
        setTokenMessage(response.message || null);
        if (response.email) {
          setEmail(response.email);
        }
      } catch (err: any) {
        setIsTokenValid(false);
        setTokenMessage(err.message || 'This link is invalid or has expired.');
      } finally {
        setIsValidatingToken(false);
      }
    };

    runValidation();
  }, []);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!token) {
      toast.error('Missing token. Please open the email link again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.setPin({
        token,
        pin: values.pin,
        confirmPin: values.confirmPin,
      });
      if (!response.success) {
        toast.error(response.message || 'Failed to set PIN. Please try again.');
        return;
      }

      toast.success(response.message || 'PIN set successfully. Please log in.');
      const loginPath = email ? `/login?email=${encodeURIComponent(email)}` : '/login';
      setTimeout(() => setLocation(loginPath), 800);
    } catch (err: any) {
      toast.error(err.message || 'Failed to set PIN. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-center gap-4">
          <LoadingSpinner variant="spinner" size="lg" color="primary" />
          <p className="text-gray-600 font-medium">Validating your link...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Link unavailable</h1>
          <p className="text-sm text-gray-600">
            {tokenMessage || 'This link is invalid or has expired. Please request a new one.'}
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setLocation('/apply')} className="flex-1">
              Apply Again
            </Button>
            <Button onClick={() => setLocation('/login')} className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <button
          type="button"
          onClick={() => setLocation('/login')}
          className="flex items-center gap-2 text-sm font-medium text-[#2e7146] hover:text-[#1d4a2f]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Set your PIN</h1>
          <p className="text-sm text-gray-600">
            Create a 4-digit PIN to secure your account{email ? ` for ${email}` : ''}.
          </p>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 flex items-start gap-2 text-sm text-emerald-700">
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Your secure link has been verified. Set your PIN to continue.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="PIN" error={form.formState.errors.pin} required>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="0000"
                maxLength={4}
                {...form.register('pin')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none pr-10 tracking-widest text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm PIN" error={form.formState.errors.confirmPin} required>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="0000"
                maxLength={4}
                {...form.register('confirmPin')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none pr-10 tracking-widest text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2e7146] hover:bg-[#1d4a2f]"
          >
            <ButtonLoader isLoading={isSubmitting}>Set PIN</ButtonLoader>
          </Button>
        </form>
      </div>
    </div>
  );
}
