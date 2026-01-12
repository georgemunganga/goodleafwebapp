# React Hook Form + Zod Integration Guide

## Overview

All forms in the Goodleaf Loans application now use **React Hook Form** with **Zod validation schemas** for type-safe, real-time form validation.

## Architecture

```
Zod Schemas (lib/validation-schemas.ts)
    ↓
React Hook Form (useForm hook)
    ↓
FormField Component (components/FormField.tsx)
    ↓
UI Components (shadcn/ui)
```

## Key Components

### 1. Validation Schemas (lib/validation-schemas.ts)
- Centralized Zod schemas for all form types
- Defines validation rules at API boundaries
- Provides TypeScript types via `z.infer<typeof Schema>`

### 2. React Hook Form Integration
- `useForm` hook with `zodResolver` for validation
- `mode: "onBlur"` for better UX (validate after user leaves field)
- Separate forms for different input types (phone vs email login)

### 3. FormField Component (components/FormField.tsx)
- Wrapper for consistent error display
- Shows validation errors inline
- Supports labels, hints, and required indicators
- Integrates with React Hook Form's error handling

### 4. Form Utilities (lib/form-utils.ts)
- Helper functions for error mapping
- Error message formatting
- Field error clearing

## Implementation Pattern

### Step 1: Define Zod Schema
```typescript
const MyFormSchema = z.object({
  email: z.string().email("Invalid email"),
  amount: z.number().min(5000, "Minimum is K5,000"),
});

type MyFormType = z.infer<typeof MyFormSchema>;
```

### Step 2: Create Form Component
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/FormField";

export function MyForm() {
  const form = useForm<MyFormType>({
    resolver: zodResolver(MyFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: MyFormType) => {
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        error={form.formState.errors.email}
        required
      >
        <input {...form.register("email")} />
      </FormField>
    </form>
  );
}
```

## Validation Modes

- **onBlur** (recommended): Validate when user leaves field - better UX
- **onChange**: Validate on every keystroke - more aggressive
- **onSubmit**: Validate only when form is submitted - less helpful

## Error Display

Errors are automatically displayed via the `FormField` component:
```
<FormField error={form.formState.errors.fieldName}>
  <input {...form.register("fieldName")} />
</FormField>
```

## Current Implementation Status

### ✅ Completed
- Login.tsx - Full Zod + React Hook Form integration

### 🔄 In Progress
- LoanApplication.tsx
- RepaymentSubmission.tsx
- KYCWorkflow.tsx

### ⏳ Pending
- Profile.tsx
- ChangePIN.tsx
- LoanRestructuring.tsx
- ForgotPIN.tsx
- PreEligibilityChecker.tsx
- EarlyRepaymentCalculator.tsx
- NotificationsSettings.tsx
- SecuritySettings.tsx

## Benefits

1. **Type Safety**: Full TypeScript support from schema to component
2. **Real-time Validation**: Immediate feedback as user types/leaves fields
3. **Consistent UX**: All forms use same validation pattern
4. **Easy Testing**: Schemas can be tested independently
5. **Reduced Boilerplate**: No manual error state management
6. **API Safety**: Schemas validate data before sending to backend

## Testing Validation

```typescript
// Test schema independently
const result = MyFormSchema.safeParse({
  email: "invalid",
  amount: 1000,
});

if (!result.success) {
  console.log(result.error.errors); // Shows validation errors
}
```

## Next Steps

1. Apply pattern to LoanApplication.tsx (CRITICAL)
2. Apply pattern to RepaymentSubmission.tsx (CRITICAL)
3. Apply pattern to KYCWorkflow.tsx (HIGH)
4. Apply pattern to remaining forms (MEDIUM/LOW)
