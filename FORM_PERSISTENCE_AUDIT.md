# Form State Persistence Audit

## Multi-Step Forms (Need Persistence)

### 1. LoanApplication.tsx
- **Type**: 3-step wizard (Define Loan → Review → Confirm)
- **Form Fields**: Loan type, amount, term, purpose, registration (for new users)
- **Persistence Needed**: YES - Users may close browser mid-application
- **Status**: ⏳ TODO

### 2. KYCWorkflow.tsx
- **Type**: Multi-step KYC verification
- **Form Fields**: Document type, document number, file upload
- **Persistence Needed**: YES - Document uploads are time-consuming
- **Status**: ⏳ TODO

### 3. RepaymentSubmission.tsx
- **Type**: Payment form with multiple steps
- **Form Fields**: Amount, payment method, confirmation
- **Persistence Needed**: YES - User may cancel and retry
- **Status**: ⏳ TODO

## Single-Step Forms (Optional Persistence)

### 4. Login.tsx
- **Type**: Single-step authentication
- **Form Fields**: Phone/Email, PIN
- **Persistence Needed**: NO - Security risk to store credentials
- **Status**: ✅ SKIP

### 5. ForgotPIN.tsx
- **Type**: Single-step PIN recovery
- **Form Fields**: Email, phone
- **Persistence Needed**: NO - Short process
- **Status**: ✅ SKIP

### 6. Profile.tsx / PersonalDetails.tsx
- **Type**: User profile update
- **Form Fields**: Name, email, phone, address
- **Persistence Needed**: MAYBE - Long form, but not critical
- **Status**: ⏳ OPTIONAL

### 7. ChangePIN.tsx
- **Type**: Single-step PIN change
- **Form Fields**: Old PIN, new PIN, confirm PIN
- **Persistence Needed**: NO - Security risk
- **Status**: ✅ SKIP

### 8. PreEligibilityChecker.tsx
- **Type**: Single-step eligibility check
- **Form Fields**: Loan type, amount, income, employment
- **Persistence Needed**: MAYBE - Helps user retry with different values
- **Status**: ⏳ OPTIONAL

### 9. EarlyRepaymentCalculator.tsx
- **Type**: Single-step calculator
- **Form Fields**: Loan ID, repayment amount
- **Persistence Needed**: NO - Calculation, not submission
- **Status**: ✅ SKIP

### 10. LoanRestructuring.tsx
- **Type**: Restructuring request form
- **Form Fields**: New term, new amount, reason
- **Persistence Needed**: MAYBE - Complex decision form
- **Status**: ⏳ OPTIONAL

### 11. NotificationsSettings.tsx
- **Type**: Settings form
- **Form Fields**: Notification preferences
- **Persistence Needed**: NO - Settings saved immediately
- **Status**: ✅ SKIP

### 12. SecuritySettings.tsx
- **Type**: Security settings
- **Form Fields**: 2FA toggle, recovery codes
- **Persistence Needed**: NO - Security-sensitive
- **Status**: ✅ SKIP

## Summary

| Category | Count | Forms |
|----------|-------|-------|
| Critical (Implement) | 3 | LoanApplication, KYCWorkflow, RepaymentSubmission |
| Optional (Consider) | 3 | Profile, PreEligibilityChecker, LoanRestructuring |
| Skip (Security/UX) | 7 | Login, ForgotPIN, ChangePIN, EarlyRepaymentCalculator, NotificationsSettings, SecuritySettings, Terms/Privacy |

## Implementation Plan

1. **Create Form Persistence Utility** (`useFormPersistence` hook)
   - Auto-save form state to localStorage on change
   - Debounce saves (500ms) to reduce writes
   - Restore state on component mount
   - Clear state after successful submission

2. **Implement in Critical Forms**
   - LoanApplication: Save all 3 steps
   - KYCWorkflow: Save document info (not file itself)
   - RepaymentSubmission: Save payment details

3. **Add Recovery UI**
   - Show "Resume Application?" modal on page load if saved state exists
   - Allow user to continue or start fresh
   - Show timestamp of last save

4. **Add Clear Button**
   - Let users manually clear saved form data
   - Useful for testing and privacy
