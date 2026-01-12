# Button Functionality Audit - Goodleaf Loans App

## Audit Purpose
Verify that every button on every page functions as intended and navigates/performs the correct action.

---

## Pages to Audit

### 1. **Login Page** (`/login`)
- [ ] Phone/Email toggle button - Switches between phone and email input
- [ ] Sign In button - Navigates to dashboard on successful login
- [ ] Forgot PIN? link - Navigates to `/forgot-pin`
- [ ] Register here link - Navigates to `/apply` (loan application)
- [ ] Apply for a Loan button - Navigates to `/apply`
- [ ] Terms of Service button - Navigates to `/terms`
- [ ] Privacy Policy button - Navigates to `/privacy`

### 2. **Dashboard Page** (`/dashboard`)
- [ ] Apply for Loan button - Navigates to `/apply`
- [ ] Make Payment button - Navigates to `/repayment`
- [ ] Calculate Early Repayment button - Navigates to `/early-repayment`
- [ ] View History button - Navigates to `/loans`
- [ ] View All button (under Active Loans) - Navigates to `/loans`
- [ ] Pay Now button (on loan card) - Navigates to `/repayment`
- [ ] Bottom nav Home icon - Stays on dashboard
- [ ] Bottom nav Loans icon - Navigates to `/loans`
- [ ] Bottom nav Profile icon - Navigates to `/profile`

### 3. **Loans Page** (`/loans`)
- [ ] Search input - Filters loans by search term
- [ ] Filter pills (All, Active, Repaid, Pending, Rejected) - Filters loans by status
- [ ] Loan card - Navigates to `/loans/{loanId}`
- [ ] Bottom nav Home icon - Navigates to `/dashboard`
- [ ] Bottom nav Loans icon - Stays on loans page
- [ ] Bottom nav Profile icon - Navigates to `/profile`

### 4. **Loan Details Page** (`/loans/{loanId}`)
- [ ] Back button - Returns to previous page or `/loans`
- [ ] Pay Now button - Navigates to `/repayment`
- [ ] View Schedule button - Shows/expands repayment schedule
- [ ] Request Restructuring button - Navigates to `/restructure`
- [ ] View Payment History button - Navigates to `/loans/{loanId}/payment-history`
- [ ] Calculate Early Repayment button - Navigates to `/early-repayment`

### 5. **Loan Application Page** (`/apply`)
- [ ] Back button - Returns to previous page
- [ ] Continue button (Step 1) - Validates and moves to Step 2
- [ ] Continue button (Step 2) - Validates and moves to Step 3
- [ ] Submit button (Step 3 with PIN) - Submits application and navigates to `/apply-success`
- [ ] Progress indicator - Shows current step

### 6. **Loan Application Success Page** (`/apply-success`)
- [ ] Back to Dashboard button - Navigates to `/dashboard`
- [ ] View Loan Details button - Navigates to `/loans/{loanId}`
- [ ] Apply Again button - Navigates to `/apply`

### 7. **Repayment Submission Page** (`/repayment`)
- [ ] Back button - Returns to previous page
- [ ] Upload Proof button - Opens file upload dialog
- [ ] Submit Payment button - Submits payment with loading state
- [ ] Bottom nav icons - Navigate to respective pages

### 8. **Profile Page** (`/profile`)
- [ ] Personal Details button - Navigates to `/personal-details`
- [ ] Change PIN button - Navigates to `/change-pin`
- [ ] Notifications button - Navigates to `/notifications`
- [ ] Security Settings button - Navigates to `/security`
- [ ] Help & Support button - Navigates to `/help`
- [ ] Logout button - Shows confirmation and logs out
- [ ] Bottom nav Home icon - Navigates to `/dashboard`
- [ ] Bottom nav Loans icon - Navigates to `/loans`
- [ ] Bottom nav Profile icon - Stays on profile page

### 9. **Personal Details Page** (`/personal-details`)
- [ ] Back button - Returns to `/profile`
- [ ] Save Changes button - Saves profile updates with loading state
- [ ] Edit button (if present) - Enables form editing

### 10. **Change PIN Page** (`/change-pin`)
- [ ] Back button - Returns to `/profile`
- [ ] Change PIN button - Validates and submits with loading state

### 11. **Notifications Settings Page** (`/notifications`)
- [ ] Back button - Returns to `/profile`
- [ ] Toggle switches - Enable/disable notification types
- [ ] Save Preferences button - Saves settings with loading state

### 12. **Security Settings Page** (`/security`)
- [ ] Back button - Returns to `/profile`
- [ ] Enable 2FA button - Initiates 2FA setup
- [ ] Enable Biometric button - Initiates biometric setup
- [ ] Save Settings button - Saves security preferences

### 13. **Help & Support Page** (`/help`)
- [ ] Back button - Returns to `/profile`
- [ ] FAQ accordion items - Expand/collapse to show answers
- [ ] Contact Support button - Opens contact form or email
- [ ] Chat with Agent button - Initiates chat (if available)

### 14. **Forgot PIN Page** (`/forgot-pin`)
- [ ] Back button - Returns to `/login`
- [ ] Send Code button - Sends verification code with loading state
- [ ] Verify button - Verifies code and navigates to PIN reset
- [ ] Next button - Moves through verification steps

### 15. **Pre-Eligibility Checker Page** (`/check-eligibility`)
- [ ] Back button - Returns to previous page
- [ ] Check Eligibility button - Validates form and shows results with loading state
- [ ] Apply Now button (if eligible) - Navigates to `/apply`

### 16. **Early Repayment Calculator Page** (`/early-repayment`)
- [ ] Back button - Returns to previous page
- [ ] Calculate button - Calculates settlement amount with loading state
- [ ] Submit Early Repayment button - Submits request with loading state
- [ ] Loan selection dropdown - Changes selected loan

### 17. **Loan Restructuring Page** (`/restructure`)
- [ ] Back button - Returns to previous page
- [ ] Submit Request button - Submits restructuring request with loading state
- [ ] Tenure slider - Adjusts loan tenure

### 18. **KYC Workflow Page** (`/kyc`)
- [ ] Back button - Returns to previous page
- [ ] Upload Document button - Opens file upload
- [ ] Remove Document button - Removes uploaded file
- [ ] Submit KYC button - Submits documents with loading state
- [ ] Next Step button - Moves to next KYC step

### 19. **Payment History Page** (`/loans/{loanId}/payment-history`)
- [ ] Back button - Returns to `/loans/{loanId}`
- [ ] Filter buttons (All, Completed, Pending, Failed) - Filters transactions
- [ ] Download Statement button - Downloads payment history

### 20. **Terms of Service Page** (`/terms`)
- [ ] Back button - Returns to previous page
- [ ] Accept button (if applicable) - Accepts terms and navigates to next page

### 21. **Privacy Policy Page** (`/privacy`)
- [ ] Back button - Returns to previous page

---

## Testing Notes
- Test on both mobile (375px) and desktop (1024px+) viewports
- Verify loading states appear during async operations
- Check that disabled states work correctly
- Verify error states show appropriate messages
- Test back button behavior in different navigation contexts

---

## Issues Found
(To be filled during testing)

---

## Fixes Applied
(To be filled after fixes)
