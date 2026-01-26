'use client';

import { useState, useEffect, useRef, ChangeEvent, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { ButtonLoader } from '@/components/ui/loading-spinner';
import { OTPVerificationModal } from '@/components/OTPVerificationModal';
import { FormField } from '@/components/FormField';
import { FormRecoveryModal } from '@/components/FormRecoveryModal';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { authService, loanService } from '@/lib/api-service';
import * as Types from '@/lib/api-types';
import { PIN_SCHEMA } from '@/lib/validation-schemas';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useLoanConfig, useUserLoans } from '@/hooks/useLoanQueries';
import { queryKeys } from '@/hooks/query-keys';
import { toast } from 'sonner';

type Step = 1 | 2 | 3;

// ============================================
// VALIDATION SCHEMAS
// ============================================

const Step1Schema = z.object({
  loanTypeId: z.number().int().positive('Select a loan type'),
  loanCategoryId: z.number().int().positive('Select a category'),
  loanProductId: z.number().int().positive('Select a product'),
  institutionName: z.string().optional(),
  loanAmount: z.number().positive('Enter a loan amount'),
  repaymentMonths: z.number().int().positive('Enter a repayment term'),
});

const Step3AuthenticatedSchema = z.object({
  pin: PIN_SCHEMA,
});

const Step3UnauthenticatedSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z.string()
    .regex(/^\d{9}$/, 'Phone number must be 9 digits'),
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

type Step1Form = z.infer<typeof Step1Schema>;
type Step3AuthenticatedForm = z.infer<typeof Step3AuthenticatedSchema>;
type Step3UnauthenticatedForm = z.infer<typeof Step3UnauthenticatedSchema>;

interface DefaultSelection {
  loanTypeId: number;
  loanCategoryId: number;
  loanProductId: number;
}

interface ProductConstraints {
  principalMin: number;
  principalMax: number;
  principalDefault: number;
  durationMin: number;
  durationMax: number;
  durationDefault: number;
  durationPeriod: string;
  interestRate: number;
  ratePeriod: string;
  methodName: string;
  isFlatRate: boolean;
  repaymentCycleName: string;
}

const FALLBACK_CONSTRAINTS: ProductConstraints = {
  principalMin: 5000,
  principalMax: 50000,
  principalDefault: 10000,
  durationMin: 6,
  durationMax: 60,
  durationDefault: 12,
  durationPeriod: 'month',
  interestRate: 1.5,
  ratePeriod: 'per-month',
  methodName: 'Flat Rate',
  isFlatRate: true,
  repaymentCycleName: 'Monthly',
};

const BLOCKED_APPLICATION_STATUSES: Types.LoanDetails['status'][] = ['submitted', 'pending'];

const parseDateSafe = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatShortDate = (value?: string | null) => {
  const parsed = parseDateSafe(value);
  if (!parsed) return '-';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '-';
  }
  return `K${value.toLocaleString()}`;
};

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
  const auth = useAuthContext();
  const { isAuthenticated } = auth;
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [savedDataInfo, setSavedDataInfo] = useState<any>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{ email?: string; phone?: string; pin: string } | null>(null);
  const loanConfigQuery = useLoanConfig();
  const [recoveryDecisionMade, setRecoveryDecisionMade] = useState(false);
  const [amountRangePulse, setAmountRangePulse] = useState(0);
  const hasInitializedDefaultsRef = useRef(false);
  const loanConfig = loanConfigQuery.data ?? [];
  const configLoading = loanConfigQuery.isLoading;
  const configError = loanConfigQuery.error
    ? loanConfigQuery.error instanceof Error
      ? loanConfigQuery.error.message
      : 'Failed to load loan products. Please try again.'
    : null;
  const configErrorMessage =
    configError ?? (!configLoading && loanConfig.length === 0 ? 'No loan products are available right now.' : null);

  // Form persistence
  const { saveForm, restoreForm, clearForm, hasSavedData, getSavedDataInfo } =
    useFormPersistence({
      key: 'loan-application',
      debounceMs: 500,
    });

  // Step 1 Form
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(Step1Schema),
    mode: 'onBlur',
    defaultValues: {
      loanTypeId: 0,
      loanCategoryId: 0,
      loanProductId: 0,
      loanAmount: 0,
      repaymentMonths: 0,
      institutionName: '',
    },
  });

  // Register fields driven by buttons instead of native inputs
  useEffect(() => {
    step1Form.register('loanTypeId', { valueAsNumber: true });
  }, [step1Form]);

  const toNumberSafe = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return undefined;
      }
      const parsed = Number(trimmed);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    if (value == null) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const clampToRange = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const ensurePositive = (value: number | undefined, fallback: number) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      return fallback;
    }
    return value;
  };

  const buildRange = (
    minRaw: number | undefined,
    maxRaw: number | undefined,
    defaultRaw: number | undefined,
    fallback: number,
  ) => {
    const seed = ensurePositive(defaultRaw, ensurePositive(minRaw, ensurePositive(maxRaw, fallback)));
    let min = ensurePositive(minRaw, seed);
    let max = ensurePositive(maxRaw, seed);
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    const defaultValue = clampToRange(seed, min, max);
    return { min, max, defaultValue };
  };

  const matchByName = <T extends { name: string }>(items: T[], name?: string): T | undefined => {
    if (!name) return undefined;
    const normalized = name.trim().toLowerCase();
    if (normalized.length === 0) return undefined;
    return (
      items.find((item) => item.name.trim().toLowerCase() === normalized) ||
      items.find((item) => item.name.trim().toLowerCase().includes(normalized))
    );
  };

  const formatPeriodLabel = (period: string, value: number) => {
    const normalized = period.trim().toLowerCase();
    if (value === 1) return normalized;
    return normalized.endsWith('s') ? normalized : `${normalized}s`;
  };

  const formatRatePeriod = (period: string) => {
    const trimmed = period.trim();
    if (trimmed.startsWith('per-')) {
      return `per ${trimmed.slice(4)}`;
    }
    return trimmed;
  };

  const getCyclesPerMonth = (cycleName: string) => {
    const normalized = cycleName.trim().toLowerCase();
    if (normalized.includes('week')) return 4.345;
    if (normalized.includes('day')) return 30.437;
    return 1;
  };

  const getPeriodsPerMonth = (period: string) => {
    const normalized = period.trim().toLowerCase();
    if (normalized.includes('week')) return 4.345;
    if (normalized.includes('day')) return 30.437;
    if (normalized.includes('year')) return 1 / 12;
    return 1;
  };

  const getRatePerMonth = (ratePercent: number, ratePeriod: string) => {
    const ratePerPeriod = ratePercent / 100;
    return ratePerPeriod * getPeriodsPerMonth(ratePeriod);
  };

  const getNextPaymentDate = (cycleName: string) => {
    const date = new Date();
    const normalized = cycleName.trim().toLowerCase();
    if (normalized.includes('week')) {
      date.setDate(date.getDate() + 7);
      return date;
    }
    if (normalized.includes('day')) {
      date.setDate(date.getDate() + 1);
      return date;
    }
    date.setMonth(date.getMonth() + 1);
    return date;
  };


  const calculateRepayment = (
    principal: number,
    perCycleRate: number,
    numberOfPayments: number,
    isFlatRate: boolean,
  ) => {
    const payments = Math.max(1, Math.round(numberOfPayments));
    if (!Number.isFinite(principal) || principal <= 0) {
      return { paymentPerCycle: 0, totalRepayment: 0, payments };
    }

    const rate = Number.isFinite(perCycleRate) && perCycleRate > 0 ? perCycleRate : 0;
    if (rate === 0) {
      const paymentPerCycle = principal / payments;
      return {
        paymentPerCycle,
        totalRepayment: paymentPerCycle * payments,
        payments,
      };
    }

    if (isFlatRate) {
      const totalRepayment = principal * (1 + rate * payments);
      return {
        paymentPerCycle: totalRepayment / payments,
        totalRepayment,
        payments,
      };
    }

    const factor = Math.pow(1 + rate, payments);
    const denominator = factor - 1;
    if (Math.abs(denominator) < 1e-9) {
      const paymentPerCycle = principal / payments;
      return {
        paymentPerCycle,
        totalRepayment: paymentPerCycle * payments,
        payments,
      };
    }

    const paymentPerCycle = (principal * rate * factor) / denominator;
    return {
      paymentPerCycle,
      totalRepayment: paymentPerCycle * payments,
      payments,
    };
  };

  const getValidLoanTypes = () => {
    return loanConfig.filter((loanType) =>
      loanType.categories.some((category) => category.products.length > 0),
    );
  };

  const getLoanTypeById = (id: number) => {
    return getValidLoanTypes().find((loanType) => loanType.id === id);
  };

  const getValidCategories = (loanType?: Types.LoanConfigLoanType | null) => {
    if (!loanType) return [];
    return loanType.categories.filter((category) => category.products.length > 0);
  };

  const getValidProducts = (category?: Types.LoanConfigCategory | null) => {
    if (!category) return [];
    return category.products.filter((product) => product.id > 0);
  };

  const getDefaultSelection = (): DefaultSelection | null => {
    const loanType = getValidLoanTypes()[0];
    if (!loanType) return null;
    const category = getValidCategories(loanType)[0];
    if (!category) return null;
    const product = getValidProducts(category)[0];
    if (!product) return null;
    return {
      loanTypeId: loanType.id,
      loanCategoryId: category.id,
      loanProductId: product.id,
    };
  };

  const getProductByIds = (loanTypeId: number, loanCategoryId: number, loanProductId: number) => {
    const loanType = getLoanTypeById(loanTypeId);
    const category = getValidCategories(loanType).find((item) => item.id === loanCategoryId);
    const product = getValidProducts(category).find((item) => item.id === loanProductId);
    return product ?? null;
  };

  const getProductConstraints = (product?: Types.LoanConfigProduct | null): ProductConstraints => {
    if (!product) return FALLBACK_CONSTRAINTS;

    const principalRange = buildRange(
      product.terms.principal.min,
      product.terms.principal.max,
      product.terms.principal.default,
      FALLBACK_CONSTRAINTS.principalDefault,
    );

    const durationRange = buildRange(
      product.terms.duration.min,
      product.terms.duration.max,
      product.terms.duration.default,
      FALLBACK_CONSTRAINTS.durationDefault,
    );

    const durationPeriodRaw =
      typeof product.terms.duration.period === 'string' ? product.terms.duration.period.trim() : '';
    const durationPeriod = durationPeriodRaw.length > 0 ? durationPeriodRaw : FALLBACK_CONSTRAINTS.durationPeriod;

    const interestRateRaw = product.rates.default ?? product.rates.min ?? FALLBACK_CONSTRAINTS.interestRate;
    const interestRate = interestRateRaw > 0 ? interestRateRaw : FALLBACK_CONSTRAINTS.interestRate;

    const ratePeriodRaw = typeof product.rates.period === 'string' ? product.rates.period.trim() : '';
    const ratePeriod = ratePeriodRaw.length > 0 ? ratePeriodRaw : FALLBACK_CONSTRAINTS.ratePeriod;

    const methodNameRaw = product.rates.methods[0]?.name ?? '';
    const methodName = methodNameRaw.trim().length > 0 ? methodNameRaw : FALLBACK_CONSTRAINTS.methodName;
    const isFlatRate = methodName.toLowerCase().includes('flat');

    const repaymentCycleName =
      product.repaymentCycles.find((cycle) => typeof cycle.name === 'string' && cycle.name.trim().length > 0)?.name ??
      FALLBACK_CONSTRAINTS.repaymentCycleName;

    return {
      principalMin: principalRange.min,
      principalMax: principalRange.max,
      principalDefault: principalRange.defaultValue,
      durationMin: durationRange.min,
      durationMax: durationRange.max,
      durationDefault: durationRange.defaultValue,
      durationPeriod,
      interestRate,
      ratePeriod,
      methodName,
      isFlatRate,
      repaymentCycleName,
    };
  };

  const applyConstraintsToForm = (constraints: ProductConstraints) => {
    const currentAmount = step1Form.getValues('loanAmount');
    const currentTerm = step1Form.getValues('repaymentMonths');

    const nextAmount =
      Number.isFinite(currentAmount) && currentAmount > 0
        ? clampToRange(currentAmount, constraints.principalMin, constraints.principalMax)
        : constraints.principalDefault;

    const nextTerm =
      Number.isFinite(currentTerm) && currentTerm > 0
        ? clampToRange(Math.round(currentTerm), constraints.durationMin, constraints.durationMax)
        : constraints.durationDefault;

    if (nextAmount !== currentAmount) {
      step1Form.setValue('loanAmount', nextAmount, { shouldValidate: true });
    }
    if (nextTerm !== currentTerm) {
      step1Form.setValue('repaymentMonths', nextTerm, { shouldValidate: true });
    }
  };

  const resetToConfigDefaults = (institutionName = '', selection?: DefaultSelection) => {
    const defaultSelection = selection ?? getDefaultSelection();
    if (!defaultSelection) return;
    const product = getProductByIds(
      defaultSelection.loanTypeId,
      defaultSelection.loanCategoryId,
      defaultSelection.loanProductId,
    );
    if (!product) return;

    const constraints = getProductConstraints(product);
    step1Form.reset({
      loanTypeId: defaultSelection.loanTypeId,
      loanCategoryId: defaultSelection.loanCategoryId,
      loanProductId: defaultSelection.loanProductId,
      institutionName,
      loanAmount: constraints.principalDefault,
      repaymentMonths: constraints.durationDefault,
    });
    hasInitializedDefaultsRef.current = true;
  };

  const mapSavedStep1Data = (saved: any): Step1Form | null => {
    const raw = saved?.data ?? saved;
    if (!raw) return null;

    const defaultSelection = getDefaultSelection();
    if (!defaultSelection) return null;

    const validLoanTypes = getValidLoanTypes();
    if (validLoanTypes.length === 0) return null;

    const savedLoanTypeId = toNumberSafe(raw.loanTypeId);
    const savedLoanTypeName = typeof raw.loanType === 'string' ? raw.loanType : undefined;
    const resolvedLoanType =
      validLoanTypes.find((loanType) => loanType.id === savedLoanTypeId) ??
      matchByName(validLoanTypes, savedLoanTypeName) ??
      validLoanTypes.find((loanType) => loanType.id === defaultSelection.loanTypeId) ??
      validLoanTypes[0];

    const categories = getValidCategories(resolvedLoanType);
    if (categories.length === 0) return null;

    const savedCategoryId = toNumberSafe(raw.loanCategoryId);
    const savedCategoryName = typeof raw.loanCategory === 'string' ? raw.loanCategory : undefined;
    const defaultCategory =
      categories.find((category) => category.id === defaultSelection.loanCategoryId) ?? categories[0];
    const resolvedCategory =
      categories.find((category) => category.id === savedCategoryId) ??
      matchByName(categories, savedCategoryName) ??
      defaultCategory;

    const products = getValidProducts(resolvedCategory);
    if (products.length === 0) return null;

    const savedProductId = toNumberSafe(raw.loanProductId);
    const defaultProduct =
      products.find((product) => product.id === defaultSelection.loanProductId) ?? products[0];
    const resolvedProduct =
      products.find((product) => product.id === savedProductId) ?? defaultProduct;

    const constraints = getProductConstraints(resolvedProduct);

    const savedAmount = toNumberSafe(raw.loanAmount);
    const loanAmount =
      savedAmount && savedAmount > 0
        ? clampToRange(savedAmount, constraints.principalMin, constraints.principalMax)
        : constraints.principalDefault;

    const savedTerm = toNumberSafe(raw.repaymentMonths);
    const repaymentMonths =
      savedTerm && savedTerm > 0
        ? clampToRange(Math.round(savedTerm), constraints.durationMin, constraints.durationMax)
        : constraints.durationDefault;

    const institutionName = typeof raw.institutionName === 'string' ? raw.institutionName : '';

    return {
      loanTypeId: resolvedLoanType.id,
      loanCategoryId: resolvedCategory.id,
      loanProductId: resolvedProduct.id,
      institutionName,
      loanAmount,
      repaymentMonths,
    };
  };

  const userLoansQuery = useUserLoans();
  const applicationCheckLoading = isAuthenticated && userLoansQuery.isLoading;
  const applicationCheckError = isAuthenticated && userLoansQuery.error
    ? userLoansQuery.error instanceof Error
      ? userLoansQuery.error.message
      : (userLoansQuery.error as { message?: string }).message || 'Unable to confirm your loan status.'
    : null;

  const existingApplication = useMemo(() => {
    if (!isAuthenticated) return null;
    const loans = userLoansQuery.data ?? [];
    const inProgressLoans = loans.filter((loan) =>
      BLOCKED_APPLICATION_STATUSES.includes(loan.status),
    );
    if (inProgressLoans.length === 0) return null;
    return [...inProgressLoans].sort((a, b) => {
      const timeA = parseDateSafe(a.createdAt)?.getTime() ?? 0;
      const timeB = parseDateSafe(b.createdAt)?.getTime() ?? 0;
      return timeB - timeA;
    })[0];
  }, [isAuthenticated, userLoansQuery.data]);

  useEffect(() => {
    if (existingApplication) {
      setShowRecoveryModal(false);
      setRecoveryDecisionMade(true);
    }
  }, [existingApplication]);

  // Check for saved data on mount
  useEffect(() => {
    if (hasSavedData()) {
      const info = getSavedDataInfo();
      setSavedDataInfo(info);
      setShowRecoveryModal(true);
      setRecoveryDecisionMade(false);
      return;
    }
    setRecoveryDecisionMade(true);
  }, [hasSavedData, getSavedDataInfo]);

  const loanTypeId = step1Form.watch('loanTypeId');
  const loanCategoryId = step1Form.watch('loanCategoryId');
  const loanProductId = step1Form.watch('loanProductId');

  // Auto-save Step 1 on change once recovery decision is made and config is ready
  useEffect(() => {
    const subscription = step1Form.watch((data) => {
      if (!recoveryDecisionMade || configLoading || loanConfig.length === 0) {
        return;
      }
      saveForm({
        step: 1,
        data,
        timestamp: Date.now(),
      });
    });
    return () => subscription.unsubscribe();
  }, [step1Form, saveForm, recoveryDecisionMade, configLoading, loanConfig]);

  // Initialize defaults after config loads (without overwriting recovered data)
  useEffect(() => {
    if (!recoveryDecisionMade || configLoading || loanConfig.length === 0) return;
    if (hasInitializedDefaultsRef.current) return;

    const defaultSelection = getDefaultSelection();
    if (!defaultSelection) {
      return;
    }

    const savedForm = restoreForm();
    const savedStep1Data = savedForm?.data ?? savedForm;
    const savedInstitutionName =
      savedStep1Data && typeof savedStep1Data.institutionName === 'string'
        ? savedStep1Data.institutionName
        : '';

    resetToConfigDefaults(savedInstitutionName, defaultSelection);
  }, [recoveryDecisionMade, configLoading, loanConfig, restoreForm]);

  // Keep loan type selection valid
  useEffect(() => {
    if (!recoveryDecisionMade || configLoading || loanConfig.length === 0) return;

    const validLoanTypes = getValidLoanTypes();
    if (validLoanTypes.length === 0) return;

    const isValid = validLoanTypes.some((loanType) => loanType.id === loanTypeId);
    if (isValid) return;

    const fallbackSelection = getDefaultSelection();
    const fallbackLoanTypeId = fallbackSelection?.loanTypeId ?? validLoanTypes[0].id;
    if (fallbackLoanTypeId !== loanTypeId) {
      step1Form.setValue('loanTypeId', fallbackLoanTypeId, { shouldValidate: true });
    }
  }, [recoveryDecisionMade, configLoading, loanConfig, loanTypeId, step1Form]);

  // Keep category selection valid for the selected loan type
  useEffect(() => {
    if (!recoveryDecisionMade || configLoading || loanConfig.length === 0) return;

    const loanType = getLoanTypeById(loanTypeId) ?? getValidLoanTypes()[0];
    if (!loanType) return;

    const categories = getValidCategories(loanType);
    if (categories.length === 0) return;

    const isValid = categories.some((category) => category.id === loanCategoryId);
    const nextCategoryId = isValid ? loanCategoryId : categories[0].id;
    if (nextCategoryId !== loanCategoryId) {
      step1Form.setValue('loanCategoryId', nextCategoryId, { shouldValidate: true });
    }
  }, [recoveryDecisionMade, configLoading, loanConfig, loanTypeId, loanCategoryId, step1Form]);

  // Keep product selection valid for the selected category
  useEffect(() => {
    if (!recoveryDecisionMade || configLoading || loanConfig.length === 0) return;

    const loanType = getLoanTypeById(loanTypeId);
    if (!loanType) return;

    const categories = getValidCategories(loanType);
    const category = categories.find((item) => item.id === loanCategoryId) ?? categories[0];
    if (!category) return;

    const products = getValidProducts(category);
    if (products.length === 0) return;

    const isValid = products.some((product) => product.id === loanProductId);
    const nextProductId = isValid ? loanProductId : products[0].id;
    if (nextProductId !== loanProductId) {
      step1Form.setValue('loanProductId', nextProductId, { shouldValidate: true });
    }
  }, [recoveryDecisionMade, configLoading, loanConfig, loanTypeId, loanCategoryId, loanProductId, step1Form]);

  // Clamp amount and term to the selected product constraints
  useEffect(() => {
    if (!recoveryDecisionMade || configLoading || loanConfig.length === 0) return;
    const product = getProductByIds(loanTypeId, loanCategoryId, loanProductId);
    if (!product) return;
    applyConstraintsToForm(getProductConstraints(product));
    hasInitializedDefaultsRef.current = true;
  }, [recoveryDecisionMade, configLoading, loanConfig, loanTypeId, loanCategoryId, loanProductId, step1Form]);

  // Step 3 Forms (authenticated vs unauthenticated)
  const step3AuthForm = useForm<Step3AuthenticatedForm>({
    resolver: zodResolver(Step3AuthenticatedSchema),
    mode: 'onBlur',
    defaultValues: {
      pin: '',
    },
  });

  const step3UnauthForm = useForm<Step3UnauthenticatedForm>({
    resolver: zodResolver(Step3UnauthenticatedSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+260',
      phoneNumber: '',
      pin: '',
      confirmPin: '',
    },
  });

  // Get current form values for Step 2 preview
  const step1Values = step1Form.getValues();
  const availableLoanTypes = getValidLoanTypes();
  const selectedLoanType = availableLoanTypes.find((loanType) => loanType.id === loanTypeId) ?? null;
  const availableCategories = getValidCategories(selectedLoanType);
  const selectedCategory = availableCategories.find((category) => category.id === loanCategoryId) ?? null;
  const availableProducts = getValidProducts(selectedCategory);
  const selectedProduct = availableProducts.find((product) => product.id === loanProductId) ?? null;

  const activeConstraints = getProductConstraints(selectedProduct);
  const cyclesPerMonth = getCyclesPerMonth(activeConstraints.repaymentCycleName);
  const numberOfPayments = Math.max(1, Math.round(step1Values.repaymentMonths * cyclesPerMonth));
  const ratePerMonth = getRatePerMonth(activeConstraints.interestRate, activeConstraints.ratePeriod);
  const perCycleRate = cyclesPerMonth > 0 ? ratePerMonth / cyclesPerMonth : ratePerMonth;
  const repaymentResult = calculateRepayment(
    step1Values.loanAmount,
    perCycleRate,
    numberOfPayments,
    activeConstraints.isFlatRate,
  );

  const paymentPerCycle = repaymentResult.paymentPerCycle;
  const totalRepayment = repaymentResult.totalRepayment;
  const paymentsCount = repaymentResult.payments;
  const durationLabel = formatPeriodLabel(activeConstraints.durationPeriod, step1Values.repaymentMonths);
  const ratePeriodLabel = formatRatePeriod(activeConstraints.ratePeriod);
  const interestRateLabel = `${activeConstraints.interestRate}% ${ratePeriodLabel}`;
  const productContextLabel = [selectedCategory?.name, selectedLoanType?.name].filter(Boolean).join(' • ');
  const nextPaymentDate = getNextPaymentDate(activeConstraints.repaymentCycleName);
  const showLoadingState = configLoading && loanConfig.length === 0;
  const showErrorState = !showLoadingState && loanConfig.length === 0 && Boolean(configErrorMessage);
  const showNoProductsState = !showLoadingState && !showErrorState && availableLoanTypes.length === 0;
  const showApplyGate =
    isAuthenticated && (applicationCheckLoading || Boolean(applicationCheckError) || Boolean(existingApplication));
  const gateTitle = existingApplication
    ? 'Loan Application Status'
    : applicationCheckError
      ? 'Unable to Confirm Status'
      : 'Checking Loan Status';
  const gateDescription = existingApplication
    ? 'You already have a loan application in progress. We will update you once a decision is made.'
    : applicationCheckError
      ? 'We could not confirm your current loan status. Please retry or return to your dashboard.'
      : 'We are verifying whether you have an active loan application.';
  const applicationStatusLabel =
    existingApplication?.status === 'submitted' ? 'Submitted' : 'Under Review';
  const applicationBadgeClass =
    existingApplication?.status === 'submitted'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-blue-100 text-blue-700';
  const applicationMessage =
    existingApplication?.status === 'submitted'
      ? 'Your application is submitted and waiting for review. Complete KYC to speed up approval.'
      : 'Your application is under review. We will notify you once a decision is made.';

  const getAmountStep = (min: number, max: number) => {
    const range = max - min;
    if (!Number.isFinite(range) || range <= 0) return 1000;
    if (range <= 5000) return 500;
    if (range <= 20000) return 1000;
    if (range <= 100000) return 5000;
    return 10000;
  };

  const amountStep = getAmountStep(activeConstraints.principalMin, activeConstraints.principalMax);
  const termStep = 1;

  const adjustLoanAmount = (direction: 'inc' | 'dec') => {
    const rawValue = step1Form.getValues('loanAmount');
    const minValue = activeConstraints.principalMin;
    const maxValue = activeConstraints.principalMax;
    const fallbackValue = activeConstraints.principalDefault;
    const safeValue = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : fallbackValue;
    const delta = direction === 'inc' ? amountStep : -amountStep;
    const nextValue = safeValue + delta;
    const clampedValue = clampToRange(nextValue, minValue, maxValue);

    if (clampedValue !== rawValue) {
      step1Form.setValue('loanAmount', clampedValue, { shouldValidate: true });
    }

    if (nextValue !== clampedValue) {
      setAmountRangePulse((value) => value + 1);
    }
  };

  const adjustRepaymentTerm = (direction: 'inc' | 'dec') => {
    const rawValue = step1Form.getValues('repaymentMonths');
    const minValue = activeConstraints.durationMin;
    const maxValue = activeConstraints.durationMax;
    const fallbackValue = activeConstraints.durationDefault;
    const safeValue = Number.isFinite(rawValue) && rawValue > 0 ? Math.round(rawValue) : fallbackValue;
    const delta = direction === 'inc' ? termStep : -termStep;
    const nextValue = safeValue + delta;
    const clampedValue = clampToRange(nextValue, minValue, maxValue);

    if (clampedValue !== rawValue) {
      step1Form.setValue('repaymentMonths', clampedValue, { shouldValidate: true });
    }
  };

  const applyLoanAmountClamp = (
    rawValue: number,
    options: { pulseOnClamp: boolean; allowFallback: boolean },
  ) => {
    const minValue = activeConstraints.principalMin;
    const maxValue = activeConstraints.principalMax;
    const fallbackValue = activeConstraints.principalDefault;

    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      if (options.allowFallback) {
        step1Form.setValue('loanAmount', fallbackValue, { shouldValidate: true });
      }
      return;
    }

    const clampedValue = clampToRange(rawValue, minValue, maxValue);
    if (clampedValue !== rawValue) {
      step1Form.setValue('loanAmount', clampedValue, { shouldValidate: true });
      if (options.pulseOnClamp) {
        setAmountRangePulse((value) => value + 1);
      }
    }
  };

  const applyRepaymentTermClamp = (rawValue: number, allowFallback: boolean) => {
    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      if (allowFallback) {
        step1Form.setValue('repaymentMonths', activeConstraints.durationDefault, { shouldValidate: true });
      }
      return;
    }

    const minValue = activeConstraints.durationMin;
    const maxValue = activeConstraints.durationMax;
    const roundedValue = Math.round(rawValue);
    const clampedValue = clampToRange(roundedValue, minValue, maxValue);

    if (clampedValue !== rawValue) {
      step1Form.setValue('repaymentMonths', clampedValue, { shouldValidate: true });
    }
  };

  const handleLoanAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.valueAsNumber;
    if (Number.isNaN(rawValue)) return;
    applyLoanAmountClamp(rawValue, { pulseOnClamp: true, allowFallback: false });
  };

  const handleRepaymentTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.valueAsNumber;
    if (Number.isNaN(rawValue)) return;
    applyRepaymentTermClamp(rawValue, false);
  };

  const clampLoanAmountInput = () => {
    const rawValue = step1Form.getValues('loanAmount');
    applyLoanAmountClamp(rawValue, { pulseOnClamp: false, allowFallback: true });
  };

  const clampRepaymentTermInput = () => {
    const rawValue = step1Form.getValues('repaymentMonths');
    applyRepaymentTermClamp(rawValue, true);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (configLoading) {
        toast.info('Loading loan products...');
        return;
      }
      if (configErrorMessage && loanConfig.length === 0) {
        toast.error(configErrorMessage);
        return;
      }

      const isValid = await step1Form.trigger();
      if (!isValid) return;

      if (!selectedProduct) {
        step1Form.setError('loanProductId', {
          type: 'manual',
          message: 'Select a loan product',
        });
        return;
      }

      step1Form.clearErrors(['loanProductId', 'loanAmount', 'repaymentMonths']);

      const constraints = getProductConstraints(selectedProduct);
      const amount = step1Form.getValues('loanAmount');
      const term = step1Form.getValues('repaymentMonths');

      if (!Number.isFinite(amount)) {
        step1Form.setError('loanAmount', {
          type: 'manual',
          message: 'Enter a valid loan amount',
        });
        return;
      }

      if (!Number.isFinite(term)) {
        step1Form.setError('repaymentMonths', {
          type: 'manual',
          message: 'Enter a valid repayment term',
        });
        return;
      }

      let hasDynamicError = false;
      if (amount < constraints.principalMin || amount > constraints.principalMax) {
        step1Form.setError('loanAmount', {
          type: 'manual',
          message: `Enter an amount between K${constraints.principalMin.toLocaleString()} and K${constraints.principalMax.toLocaleString()}`,
        });
        hasDynamicError = true;
      }

      if (term < constraints.durationMin || term > constraints.durationMax) {
        const periodLabel = formatPeriodLabel(constraints.durationPeriod, constraints.durationMax);
        step1Form.setError('repaymentMonths', {
          type: 'manual',
          message: `Enter a term between ${constraints.durationMin} and ${constraints.durationMax} ${periodLabel}`,
        });
        hasDynamicError = true;
      }

      if (hasDynamicError) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const refreshLoanCache = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
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
    const institutionNameRaw = step1Values.institutionName?.trim() ?? '';
    const institutionName = institutionNameRaw.length > 0 ? institutionNameRaw : null;

    const mapLoanTypeNameToApi = (name?: string): Types.LoanApplicationRequest['loanType'] => {
      const normalized = name?.trim().toLowerCase() ?? '';
      return normalized.includes('business') ? 'business' : 'personal';
    };

    try {
      if (configLoading || loanConfig.length === 0) {
        toast.error('Loan products are still loading. Please try again.');
        return;
      }

      if (!selectedProduct) {
        toast.error('Please select a loan product.');
        setCurrentStep(1);
        return;
      }

      const loanProductId = selectedProduct.id;
      const baseApplicationData: Types.LoanApplicationRequest = {
        loanType: mapLoanTypeNameToApi(selectedLoanType?.name),
        loanCategory: selectedCategory?.name ?? selectedProduct.name ?? 'General',
        institutionName: institutionName ?? undefined,
        loanProductId,
        loanAmount: step1Values.loanAmount,
        repaymentMonths: step1Values.repaymentMonths,
      };

      if (isAuthenticated) {
        // Authenticated user - just verify PIN
        const isValid = await step3AuthForm.trigger();
        if (!isValid) return;

        const pin = step3AuthForm.getValues('pin');
        const applicationData = {
          ...baseApplicationData,
          pin,
        };

        const response = await loanService.applyForLoan(applicationData as any);
        if (response.success) {
          toast.success('Loan application submitted successfully!');
          clearForm(); // Clear saved form after successful submission
          refreshLoanCache();
          setLocation('/kyc');
        } else {
          toast.error('Failed to submit application. Please try again.');
        }
      } else {
        // Unauthenticated user - register and submit
        const isValid = await step3UnauthForm.trigger();
        if (!isValid) return;

        const { confirmPin, countryCode, phoneNumber, ...rest } = step3UnauthForm.getValues();
        const registrationData = {
          ...rest,
          phone: `${countryCode}${phoneNumber}`,
        };
        const applicationData = {
          ...baseApplicationData,
          ...registrationData,
        };

        // Register user
        try {
          const registerResponse = await authService.register({
            firstName: registrationData.firstName,
            lastName: registrationData.lastName,
            email: registrationData.email,
            phone: registrationData.phone,
            pin: registrationData.pin,
            loanProductId,
            loanType: baseApplicationData.loanType,
            loanCategory: baseApplicationData.loanCategory,
            institutionName,
            loanAmount: baseApplicationData.loanAmount,
            repaymentMonths: baseApplicationData.repaymentMonths,
          });

          const registerMessage =
            typeof registerResponse?.message === 'string' ? registerResponse.message : '';

          if (!registerResponse?.success) {
            toast.error(registerMessage || 'Registration failed. Please try again.');
            return;
          }

          if (registerResponse?.otpId) {
            auth.seedOtp(registerResponse.otpId, registrationData.email, registrationData.phone);
            toast.success(registerMessage || 'Registration successful. Please log in to complete your application.');
            setPendingLogin({
              email: registrationData.email,
              phone: registrationData.phone,
              pin: registrationData.pin,
            });
            setOtpModalOpen(true);
            return;
          }

          const alreadyExists =
            registerMessage.toLowerCase().includes('already exists') ||
            registerMessage.toLowerCase().includes('log in');

          if (alreadyExists) {
            toast.info(registerMessage || 'Loan application already exists. Please log in to continue.');
            clearForm();
            setLocation('/login');
            return;
          }

          // Auto-login after registration
          const loginResponse = await auth.login({
            email: registrationData.email,
            pin: registrationData.pin,
          });

          if (!loginResponse.success) {
            toast.error('Login failed. Please log in to continue.');
            setLocation('/login');
            return;
          }

          if ('otpId' in loginResponse && loginResponse.otpId) {
            toast.success(loginResponse.message || 'OTP sent. Please verify to continue.');
            setLocation('/login');
            return;
          }

          const registrationHasApplication =
            !!registerResponse?.loanId || !!registerResponse?.applicationId || !!registerResponse?.status;

          if (registrationHasApplication) {
            toast.success(registerMessage || 'Account created and application submitted!');
            clearForm();
            refreshLoanCache();
            setLocation('/kyc');
            return;
          }

          // Submit loan application if registration did not create one
          const appResponse = await loanService.applyForLoan(applicationData as any);
          if (appResponse.success) {
            toast.success('Account created and application submitted!');
            clearForm(); // Clear saved form after successful submission
            refreshLoanCache();
            setLocation('/kyc');
          } else {
            toast.error('Application submitted but KYC verification needed.');
            clearForm();
            refreshLoanCache();
            setLocation('/kyc');
          }
        } catch (error: any) {
          console.error('Registration error:', error);
          // Proceed to KYC even if registration fails
          toast.success('Application submitted. Please verify your email.');
          clearForm();
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

  const handleRecoveryResume = () => {
    if (configLoading) {
      toast.info('Loan products are still loading. Please wait.');
      return;
    }

    if (loanConfig.length === 0) {
      toast.error(configErrorMessage || 'Loan products are not available right now.');
      return;
    }

    const savedForm = restoreForm();
    const savedStep1Data = savedForm?.data ?? savedForm;
    const mappedData = mapSavedStep1Data(savedStep1Data);

    if (mappedData) {
      hasInitializedDefaultsRef.current = true;
      step1Form.reset(mappedData);
    } else {
      toast.error('We could not restore your saved application. Starting fresh instead.');
      hasInitializedDefaultsRef.current = false;
      resetToConfigDefaults('');
    }

    setCurrentStep(1);
    setRecoveryDecisionMade(true);
    setShowRecoveryModal(false);
  };

  const handleRecoveryStartFresh = () => {
    clearForm();
    hasInitializedDefaultsRef.current = false;
    if (!configLoading && loanConfig.length > 0) {
      resetToConfigDefaults('');
    } else {
      step1Form.reset();
    }
    setCurrentStep(1);
    setRecoveryDecisionMade(true);
    setShowRecoveryModal(false);
  };

  return (
    <>
      <FormRecoveryModal
        open={showRecoveryModal}
        formName="Loan Application"
        savedTimestamp={savedDataInfo?.timestamp}
        onResume={handleRecoveryResume}
        onStartFresh={handleRecoveryStartFresh}
      />
      <OTPVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={async (otp: string) => {
          const success = await auth.verifyOTP(otp);
          if (success) {
            clearForm();
            setLocation('/kyc');
          }
          return success;
        }}
        otpId={auth.otpId || ''}
        email={pendingLogin?.email}
        phone={pendingLogin?.phone}
        onResendOTP={
          pendingLogin
            ? async () => {
                const response = await authService.login({
                  email: pendingLogin.email,
                  phone: pendingLogin.phone,
                  pin: pendingLogin.pin,
                });
                if (!response?.success || !response.otpId) {
                  throw new Error(response?.message || 'Failed to resend OTP');
                }
                auth.seedOtp(response.otpId, pendingLogin.email, pendingLogin.phone);
              }
            : undefined
        }
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex bg-gradient-to-br from-[#2e7146] to-[#1d4a2f] text-white p-8 flex-col justify-between overflow-y-auto max-h-screen">
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
                  <p className="text-sm text-green-100">Rates and terms based on your selected product</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-green-100">
            <p>© 2024 Goodleaf Loans. All rights reserved.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white p-4 lg:p-8 overflow-y-auto min-h-screen lg:min-h-screen">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-[#2e7146] rounded-lg flex items-center justify-center text-white">
                <span className="text-lg font-bold">GL</span>
              </div>
              <span className="text-xl font-bold">Goodleaf</span>
            </div>
            {showApplyGate ? (
              <div className="space-y-6 mt-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{gateTitle}</h2>
                  <p className="text-gray-600">{gateDescription}</p>
                </div>

                {applicationCheckLoading && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600 animate-pulse">
                    Checking your current loan status...
                  </div>
                )}

                {applicationCheckError && (
                  <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-700">{applicationCheckError}</p>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => userLoansQuery.refetch()}
                        className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]"
                      >
                        Retry
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation('/dashboard')}
                        className="flex-1"
                      >
                        Dashboard
                      </Button>
                    </div>
                  </div>
                )}

                {existingApplication && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500">Loan ID</p>
                          <p className="font-semibold text-gray-900">{existingApplication.loanId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${applicationBadgeClass}`}>
                          {applicationStatusLabel}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Requested</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(existingApplication.loanAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Submitted</p>
                          <p className="font-semibold text-gray-900">
                            {formatShortDate(existingApplication.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
                        {applicationMessage}
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Button
                        type="button"
                        onClick={() => setLocation(`/loans/${existingApplication.id}`)}
                        className="w-full bg-[#2e7146] hover:bg-[#1d4a2f]"
                      >
                        View Loan Status
                      </Button>
                      {existingApplication.status === 'submitted' ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation('/kyc')}
                          className="w-full"
                        >
                          Complete KYC
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation('/dashboard')}
                          className="w-full"
                        >
                          Back to Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <ProgressSteps currentStep={currentStep} totalSteps={3} />

            {/* Step 1: Loan Terms */}
            {currentStep === 1 && showLoadingState && (
              <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900">Loading Loan Products</h2>
                <p className="text-gray-600">We are preparing the latest loan options for you.</p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  Please wait a moment while we load the loan configuration.
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="button" disabled className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]">
                    Loading...
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 1 && showErrorState && (
              <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900">Loan Products Unavailable</h2>
                <p className="text-gray-600">We could not load loan products right now.</p>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {configErrorMessage}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="button" onClick={() => loanConfigQuery.refetch()} className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]">
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 1 && showNoProductsState && (
              <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900">No Loan Products</h2>
                <p className="text-gray-600">There are no loan products available at the moment.</p>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="button" onClick={() => loanConfigQuery.refetch()} className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]">
                    Refresh
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 1 && !showLoadingState && !showErrorState && !showNoProductsState && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="space-y-6 mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900">Define Your Loan</h2>
                <p className="text-gray-600">Choose a product and set your preferred terms</p>

                {/* Loan Type */}
                <FormField label="Loan Type" required error={step1Form.formState.errors.loanTypeId}>
                  <div className="grid grid-cols-2 gap-3">
                    {availableLoanTypes.map((loanType) => (
                      <button
                        key={loanType.id}
                        type="button"
                        onClick={() =>
                          step1Form.setValue('loanTypeId', loanType.id, {
                            shouldValidate: true,
                          })
                        }
                        className={`rounded-lg border-2 p-3 text-left transition-colors ${
                          loanTypeId === loanType.id
                            ? 'border-[#2e7146] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-semibold text-gray-900">{loanType.name}</span>
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Loan Category */}
                <FormField label="Category" required error={step1Form.formState.errors.loanCategoryId}>
                  <select
                    {...step1Form.register('loanCategoryId', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2e7146] focus:ring-2 focus:ring-green-100"
                  >
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Loan Product */}
                <FormField label="Loan Product" required error={step1Form.formState.errors.loanProductId}>
                  <select
                    {...step1Form.register('loanProductId', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2e7146] focus:ring-2 focus:ring-green-100"
                  >
                    {availableProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                {selectedProduct && (
                  <div className="space-y-3 rounded-lg border border-green-100 bg-green-50 p-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
                      {productContextLabel && (
                        <p className="text-sm text-gray-600">{productContextLabel}</p>
                      )}
                      {selectedProduct.description && (
                        <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate</span>
                        <span className="font-semibold text-[#2e7146]">{interestRateLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calculation Method</span>
                        <span className="font-semibold text-gray-900">{activeConstraints.methodName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment Cycle</span>
                        <span className="font-semibold text-gray-900">{activeConstraints.repaymentCycleName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loan Amount */}
                <FormField
                  label="Loan Amount (K)"
                  error={step1Form.formState.errors.loanAmount}
                  hint={
                    <span
                      key={amountRangePulse}
                      className={amountRangePulse > 0 ? 'range-hint-alert' : undefined}
                    >
                      Range: K{activeConstraints.principalMin.toLocaleString()} - K
                      {activeConstraints.principalMax.toLocaleString()}
                    </span>
                  }
                  required
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustLoanAmount('dec')}
                      className="h-12 w-12 shrink-0 rounded-lg bg-primary text-white hover:bg-[#256339] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Decrease loan amount"
                    >
                      <Minus className="h-4 w-4 mx-auto" />
                    </button>
                    <input
                      type="number"
                      min={activeConstraints.principalMin}
                      max={activeConstraints.principalMax}
                      placeholder={activeConstraints.principalDefault.toString()}
                      {...step1Form.register('loanAmount', {
                        valueAsNumber: true,
                        onChange: handleLoanAmountChange,
                        onBlur: clampLoanAmountInput,
                      })}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2e7146] focus:ring-2 focus:ring-green-100"
                    />
                    <button
                      type="button"
                      onClick={() => adjustLoanAmount('inc')}
                      className="h-12 w-12 shrink-0 rounded-lg bg-primary text-white hover:bg-[#256339] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Increase loan amount"
                    >
                      <Plus className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </FormField>

                {/* Repayment Term */}
                <FormField
                  label="Repayment Term"
                  error={step1Form.formState.errors.repaymentMonths}
                  hint={`Range: ${activeConstraints.durationMin} - ${activeConstraints.durationMax} ${formatPeriodLabel(activeConstraints.durationPeriod, activeConstraints.durationMax)}`}
                  required
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustRepaymentTerm('dec')}
                      className="h-12 w-12 shrink-0 rounded-lg bg-primary text-white hover:bg-[#256339] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Decrease repayment term"
                    >
                      <Minus className="h-4 w-4 mx-auto" />
                    </button>
                    <input
                      type="number"
                      min={activeConstraints.durationMin}
                      max={activeConstraints.durationMax}
                      placeholder={activeConstraints.durationDefault.toString()}
                      {...step1Form.register('repaymentMonths', {
                        valueAsNumber: true,
                        onChange: handleRepaymentTermChange,
                        onBlur: clampRepaymentTermInput,
                      })}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2e7146] focus:ring-2 focus:ring-green-100"
                    />
                    <button
                      type="button"
                      onClick={() => adjustRepaymentTerm('inc')}
                      className="h-12 w-12 shrink-0 rounded-lg bg-primary text-white hover:bg-[#256339] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Increase repayment term"
                    >
                      <Plus className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </FormField>

                {/* Navigation */}
                <div className="flex gap-3 pt-6">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" disabled={!selectedProduct} className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f]">
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
                <p className="text-gray-600">
                  These estimates are based on the selected product configuration.
                </p>

                <div className="space-y-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Selected Product</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedProduct?.name}</p>
                    {productContextLabel && (
                      <p className="text-sm text-gray-600">{productContextLabel}</p>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-semibold text-[#2e7146]">{interestRateLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calculation Method</span>
                      <span className="font-semibold text-gray-900">{activeConstraints.methodName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repayment Cycle</span>
                      <span className="font-semibold text-gray-900">{activeConstraints.repaymentCycleName}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-green-100 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">K{step1Values.loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Repayment Term</span>
                    <span className="font-semibold">
                      {step1Values.repaymentMonths} {durationLabel}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number of Payments</span>
                    <span className="font-semibold">{paymentsCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Payment Per Cycle</span>
                    <span className="font-semibold">K{paymentPerCycle.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Total Repayment</span>
                    <span className="font-semibold text-[#2e7146]">K{totalRepayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">First Payment Due</span>
                    <span className="font-semibold">{nextPaymentDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Final repayment amounts will be confirmed after your application is reviewed.
                </p>

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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="First Name"
                        error={step3UnauthForm.formState.errors.firstName}
                        required
                      >
                        <input
                          type="text"
                          placeholder="John"
                          {...step3UnauthForm.register('firstName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                        />
                      </FormField>

                      <FormField
                        label="Last Name"
                        error={step3UnauthForm.formState.errors.lastName}
                        required
                      >
                        <input
                          type="text"
                          placeholder="Doe"
                          {...step3UnauthForm.register('lastName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none"
                        />
                      </FormField>
                    </div>

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
                          {...step3UnauthForm.register('countryCode')}
                          className="px-3 py-3 border border-gray-300 rounded-lg focus:border-[#2e7146] focus:ring-2 focus:ring-green-100 outline-none bg-white"
                        >
                          <option value="+260">+260</option>
                          <option value="+27">+27</option>
                          <option value="+263">+263</option>
                          <option value="+265">+265</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="123456789"
                          inputMode="numeric"
                          maxLength={9}
                          minLength={9}
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

                {!isAuthenticated && (
                  <FormField
                    label="Confirm PIN"
                    error={step3UnauthForm.formState.errors.confirmPin}
                    required
                  >
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        placeholder="Confirm PIN"
                        maxLength={4}
                        {...step3UnauthForm.register('confirmPin')}
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
                )}

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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
