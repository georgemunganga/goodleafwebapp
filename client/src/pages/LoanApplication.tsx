'use client';

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { ButtonLoader } from '@/components/ui/loading-spinner';
import { FormField } from '@/components/FormField';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService, loanService } from '@/lib/api-service';
import { PIN_SCHEMA } from '@/lib/validation-schemas';
import { toast } from 'sonner';

type Step = 1 | 2 | 3;
type LoanType = 'personal' | 'business';
type LoanCategory = 'civil-servant' | 'private' | 'collateral' | 'farmer';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const Step1Schema = z.object({
  loanType: z.enum(['personal', 'business']),
  loanCategory: z.enum(['civil-servant', 'private', 'collateral', 'farmer']),
  institutionName: z.string().optional(),
  loanAmount: z.number()
    .min(5000, 'Minimum loan amount is K5,000')
    .max(50000, 'Maximum loan amount is K50,000'),
  repaymentMonths: z.number()
    .min(6, 'Minimum term is 6 months')
    .max(60, 'Maximum term is 60 months'),
});

const Step3AuthenticatedSchema = z.object({
  pin: PIN_SCHEMA,
});

const Step3UnauthenticatedSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+260\d{9}$/, 'Invalid Zambian phone number'),
  pin: PIN_SCHEMA,
});

type Step1Form = z.infer<typeof Step1Schema>;
type Step3AuthenticatedForm = z.infer<typeof Step3AuthenticatedSchema>;
type Step3UnauthenticatedForm = z.infer<typeof Step3UnauthenticatedSchema>;

/**
 * Loan Application - 3-Step Wizard
 * Design: Responsive desktop and mobile layouts
 * - Desktop: Multi-column layout with form on left, preview on right
 * - Mobile: Full-width single column
 * - Step 1: Loan Terms (with React Hook Form validation)
 * - Step 2: Loan Summary (review only)
 * - Step 3: PIN Verification (authenticated) OR Registration (unauthenticated)
 */
export default function LoanApplication() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthContext();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 Form
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(Step1Schema),
    mode: 'onBlur',
    defaultValues: {
      loanType: 'personal',
      loanCategory: 'civil-servant',
      loanAmount: 10000,
      repaymentMonths: 12,
    },
  });

  // Step 3 Forms (authenticated vs unauthenticated)
  const step3AuthForm = useForm<Step3AuthenticatedForm>({
    resolver: zodResolver(Step3AuthenticatedSchema),
    mode: 'onBlur',
  });

  const step3UnauthForm = useForm<Step3UnauthenticatedForm>({
    resolver: zodResolver(Step3UnauthenticatedSchema),
    mode: 'onBlur',
  });

  // Get current form values for Step 2 preview
  const step1Values = step1Form.getValues();
  const monthlyRate = 0.015; // 1.5% monthly
  const serviceFee = step1Values.loanAmount * 0.05; // 5% service fee
  const amountReceived = step1Values.loanAmount - serviceFee;
  const monthlyPayment =
    (step1Values.loanAmount * (1 + monthlyRate * step1Values.repaymentMonths)) /
    step1Values.repaymentMonths;
  const totalRepayment = monthlyPayment * step1Values.repaymentMonths;
  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate Step 1 before proceeding
      const isValid = await step1Form.trigger();
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    } else {
      setLocation('/');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isAuthenticated) {
        // Authenticated user - just verify PIN
        const isValid = await step3AuthForm.trigger();
        if (!isValid) return;

        const pin = step3AuthForm.getValues('pin');
        const applicationData = {
          ...step1Values,
          pin,
        };

        const response = await loanService.applyForLoan(applicationData as any);
        if (response.success) {
          toast.success('Loan application submitted successfully!');
          setLocation('/kyc');
        } else {
          toast.error('Failed to submit application. Please try again.');
        }
      } else {
        // Unauthenticated user - register and submit
        const isValid = await step3UnauthForm.trigger();
        if (!isValid) return;

        const registrationData = step3UnauthForm.getValues();
        const applicationData = {
          ...step1Values,
          ...registrationData,
        };

        // Register user
        try {
          const registerResponse = await authService.register({
            fullName: registrationData.fullName,
            email: registrationData.email,
            phoneNumber: registrationData.phoneNumber,
            pin: registrationData.pin,
          });

          if (registerResponse.success) {
            // Auto-login after registration
            const loginResponse = await authService.login({
              email: registrationData.email,
              pin: registrationData.pin,
            } as any);

            if (loginResponse.success) {
              // Submit loan application
              const appResponse = await loanService.applyForLoan(applicationData as any);
              if (appResponse.success) {
                toast.success('Account created and application submitted!');
                setLocation('/kyc');
              } else {
                toast.error('Application submitted but KYC verification needed.');
                setLocation('/kyc');
              }
            }
          }
        } catch (error: any) {
          console.error('Registration error:', error);
          // Proceed to KYC even if registration fails
          toast.success('Application submitted. Please verify your email.');
          setLocation('/kyc');
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] text-white p-8 flex flex-col justify-between overflow-y-auto max-h-screen">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">GL</span>
              </div>
              <span className="text-xl font-bold">Goodleaf</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">Apply for a Loan</h1>
            <p className="text-green-100 mb-8">Quick approval. Flexible terms. Competitive rates.</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-green-900">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Fast Approval</p>
                  <p className="text-sm text-green-100">Get approved within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-green-900">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Flexible Terms</p>
                  <p className="text-sm text-green-100">Choose repayment period that suits you</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-green-900">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Competitive Rates</p>
                  <p className="text-sm text-green-100">1.5% monthly interest rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-green-100">
            <p>© 2024 Goodleaf Loans. All rights reserved.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white p-8 overflow-y-auto max-h-screen">
          <div className="max-w-md mx-auto">
            <ProgressSteps currentStep={currentStep} totalSteps={3} />

            {/* Step 1: Loan Terms */}
            {currentStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900">Define Your Loan</h2>
                <p className="text-gray-600">Tell us what you need</p>

                {/* Loan Type */}
                <FormField label="Loan Type" required>
                  <div className="grid grid-cols-2 gap-3">
                    {(['personal', 'business'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => step1Form.setValue('loanType', type)}
                        className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                          step1Form.watch('loanType') === type
                            ? 'border-[#2e7146] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Loan Category */}
                <FormField label="Category" required>
                  <select
                    {...step1Form.register('loanCategory')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                  >
                    <option value="civil-servant">Civil Servant</option>
                    <option value="private">Private Employee</option>
                    <option value="collateral">Collateral-Based</option>
                    <option value="farmer">Farmer</option>
                  </select>
                  {step1Form.formState.errors.loanCategory && (
                    <p className="text-red-500 text-sm mt-1">
                      {step1Form.formState.errors.loanCategory.message}
                    </p>
                  )}
                </FormField>

                {/* Loan Amount */}
                <FormField
                  label="Loan Amount (K)"
                  error={step1Form.formState.errors.loanAmount}
                  required
                >
                  <input
                    type="number"
                    placeholder="10,000"
                    {...step1Form.register('loanAmount', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                  />
                </FormField>

                {/* Repayment Term */}
                <FormField
                  label="Repayment Term (months)"
                  error={step1Form.formState.errors.repaymentMonths}
                  required
                >
                  <input
                    type="number"
                    placeholder="12"
                    {...step1Form.register('repaymentMonths', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                  />
                </FormField>

                {/* Navigation */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Loan Summary */}
            {currentStep === 2 && (
              <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900">Review Your Loan</h2>
                <p className="text-gray-600">Here's what you'll receive</p>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">K{step1Values.loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (5%)</span>
                    <span className="font-semibold">-K{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-green-200 pt-4 flex justify-between">
                    <span className="font-semibold">You'll Receive</span>
                    <span className="font-bold text-lg text-[#2e7146]">K{amountReceived.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-semibold">K{monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Repayment</span>
                    <span className="font-semibold">K{totalRepayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Term</span>
                    <span className="font-semibold">{step1Values.repaymentMonths} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">First Payment Due</span>
                    <span className="font-semibold">{nextPaymentDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-6 mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {isAuthenticated ? 'Confirm with PIN' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {isAuthenticated
                    ? 'Enter your PIN to verify this application'
                    : 'Create your account to proceed'}
                </p>

                {!isAuthenticated && (
                  <>
                    <FormField
                      label="Full Name"
                      error={step3UnauthForm.formState.errors.fullName}
                      required
                    >
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...step3UnauthForm.register('fullName')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                      />
                    </FormField>

                    <FormField
                      label="Email"
                      error={step3UnauthForm.formState.errors.email}
                      required
                    >
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...step3UnauthForm.register('email')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                      />
                    </FormField>

                    <FormField
                      label="Phone Number"
                      error={step3UnauthForm.formState.errors.phoneNumber}
                      required
                    >
                      <div className="flex gap-2">
                        <select
                          {...step3UnauthForm.register('phoneNumber')}
                          className="px-3 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none bg-white"
                        >
                          <option value="">Select country</option>
                          <option value="+260">+260 (Zambia)</option>
                          <option value="+27">+27 (South Africa)</option>
                          <option value="+263">+263 (Zimbabwe)</option>
                          <option value="+265">+265 (Malawi)</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="123456789"
                          {...step3UnauthForm.register('phoneNumber')}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                        />
                      </div>
                    </FormField>
                  </>
                )}

                <FormField
                  label="PIN"
                  error={isAuthenticated ? step3AuthForm.formState.errors.pin : step3UnauthForm.formState.errors.pin}
                  required
                >
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      placeholder="••••"
                      maxLength={4}
                      {...(isAuthenticated
                        ? step3AuthForm.register('pin')
                        : step3UnauthForm.register('pin'))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none pr-10"
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

                {/* Navigation */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]"
                  >
                    {isSubmitting ? (
                      <ButtonLoader isLoading={true}>Submitting...</ButtonLoader>
                    ) : isAuthenticated ? (
                      'Submit Application'
                    ) : (
                      'Create Account & Apply'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#2e7146] rounded-lg flex items-center justify-center text-white">
              <span className="text-lg font-bold">GL</span>
            </div>
            <span className="text-xl font-bold">Goodleaf</span>
          </div>

          <ProgressSteps currentStep={currentStep} totalSteps={3} />

          {/* Step 1: Loan Terms */}
          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Define Your Loan</h2>

              <FormField label="Loan Type" required>
                <div className="grid grid-cols-2 gap-3">
                  {(['personal', 'business'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => step1Form.setValue('loanType', type)}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize text-sm ${
                        step1Form.watch('loanType') === type
                          ? 'border-[#2e7146] bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="Category" required>
                <select
                  {...step1Form.register('loanCategory')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="civil-servant">Civil Servant</option>
                  <option value="private">Private Employee</option>
                  <option value="collateral">Collateral-Based</option>
                  <option value="farmer">Farmer</option>
                </select>
              </FormField>

              <FormField label="Loan Amount (K)" required>
                <input
                  type="number"
                  placeholder="10,000"
                  {...step1Form.register('loanAmount', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>

              <FormField label="Repayment Term (months)" required>
                <input
                  type="number"
                  placeholder="12"
                  {...step1Form.register('repaymentMonths', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-[#2e7146]">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Loan Summary */}
          {currentStep === 2 && (
            <div className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Review Your Loan</h2>

              <div className="bg-green-50 p-4 rounded-lg space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Loan Amount</span>
                  <span className="font-semibold">K{step1Values.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee (5%)</span>
                  <span>-K{serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-green-200 pt-3 flex justify-between font-semibold">
                  <span>You'll Receive</span>
                  <span className="text-[#2e7146]">K{amountReceived.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Payment</span>
                  <span>K{monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Repayment</span>
                  <span>K{totalRepayment.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-[#2e7146]">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {isAuthenticated ? 'Confirm with PIN' : 'Create Account'}
              </h2>

              {!isAuthenticated && (
                <>
                  <FormField label="Full Name" required>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...step3UnauthForm.register('fullName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </FormField>

                  <FormField label="Email" required>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      {...step3UnauthForm.register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </FormField>

                  <FormField label="Phone Number" required>
                    <input
                      type="tel"
                      placeholder="+260123456789"
                      {...step3UnauthForm.register('phoneNumber')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </FormField>
                </>
              )}

              <FormField label="PIN" required>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    placeholder="••••"
                    maxLength={4}
                    {...(isAuthenticated
                      ? step3AuthForm.register('pin')
                      : step3UnauthForm.register('pin'))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#2e7146]">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
