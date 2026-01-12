# Navigation Audit Checklist

## Pages to Audit
- [ ] Login Page
- [ ] Dashboard
- [ ] Loans (LoanHistory)
- [ ] Loan Details
- [ ] Apply (LoanApplication)
- [ ] Check Eligibility (PreEligibilityChecker)
- [ ] KYC Workflow
- [ ] Repayment Submission
- [ ] Early Repayment Calculator
- [ ] Loan Restructuring
- [ ] Profile
- [ ] Personal Details
- [ ] Change PIN
- [ ] Notifications Settings
- [ ] Security Settings
- [ ] Help & Support
- [ ] Forgot PIN

## Navigation Issues Found

### Login Page
- [ ] "Forgot PIN?" link → /forgot-pin ✓
- [ ] "Apply for a Loan" button → /apply ✓
- [ ] "Register here" link → needs implementation
- [ ] Bottom nav should NOT appear on login page ✓

### Dashboard
- [ ] "Apply" button → /apply
- [ ] "Pay" button → /repayment
- [ ] "Calculate" button → /early-repayment
- [ ] "History" button → /loans
- [ ] Loan cards click → /loans/:id
- [ ] Bottom nav: Home (active), Loans, Profile
- [ ] Desktop sidebar visible

### Loans (LoanHistory)
- [ ] Search/Filter functionality
- [ ] Loan card clicks → /loans/:id
- [ ] Bottom nav: Home, Loans (active), Profile
- [ ] Desktop sidebar visible

### Loan Details
- [ ] Back button → /loans
- [ ] "Pay Now" button → /repayment
- [ ] "Early Repayment" button → /early-repayment
- [ ] "Restructure" button → /restructuring
- [ ] Bottom nav visible
- [ ] Desktop sidebar visible

### Apply (LoanApplication)
- [ ] Step 1: Loan Terms form
- [ ] Step 2: Summary review
- [ ] Step 3: PIN verification
- [ ] "Apply" button → success/error handling
- [ ] Back button → /dashboard or /loans
- [ ] No bottom nav (full screen wizard)

### Check Eligibility
- [ ] Form inputs working
- [ ] "Check Eligibility" button → shows result
- [ ] Back button → /dashboard
- [ ] Bottom nav visible
- [ ] Desktop sidebar visible

### KYC Workflow
- [ ] Document upload functionality
- [ ] Progress tracking
- [ ] Back button functionality
- [ ] Submit button → success/error handling

### Repayment Submission
- [ ] Bank details display
- [ ] Upload proof of payment
- [ ] Submit button → success/error handling
- [ ] Back button → /loans/:id or /dashboard

### Early Repayment Calculator
- [ ] Loan selection dropdown
- [ ] Calculation functionality
- [ ] "Proceed" button → /repayment
- [ ] Back button → /loans/:id or /dashboard

### Loan Restructuring
- [ ] Form inputs working
- [ ] "Submit Request" button → success/error handling
- [ ] Back button → /loans/:id or /dashboard

### Profile
- [ ] Profile info display
- [ ] Edit button → /personal-details
- [ ] Menu items navigation:
  - [ ] Personal Details → /personal-details
  - [ ] Change PIN → /change-pin
  - [ ] Notifications → /notifications
  - [ ] Security → /security
  - [ ] Documents → /kyc
  - [ ] Help & Support → /help
- [ ] Logout button → /login
- [ ] Bottom nav: Home, Loans, Profile (active)
- [ ] Desktop sidebar visible

### Personal Details
- [ ] Form inputs working
- [ ] "Save Changes" button → success/error handling
- [ ] Back button → /profile

### Change PIN
- [ ] Current PIN input
- [ ] New PIN input
- [ ] Confirm PIN input
- [ ] "Update PIN" button → success/error handling
- [ ] Back button → /profile

### Notifications Settings
- [ ] Toggle switches working
- [ ] Frequency selection working
- [ ] "Save Settings" button → success/error handling
- [ ] Back button → /profile

### Security Settings
- [ ] 2FA toggle working
- [ ] Active sessions display
- [ ] Logout other sessions button
- [ ] "Save Settings" button → success/error handling
- [ ] Back button → /profile

### Help & Support
- [ ] FAQ accordion working
- [ ] Contact options clickable
- [ ] Message form inputs working
- [ ] "Send Message" button → success/error handling
- [ ] Back button → /profile

### Forgot PIN
- [ ] Verification method selection (Phone/Email)
- [ ] "Continue" button → next step
- [ ] Back button → /login

## Bottom Navigation Status
- [ ] Mobile: Shows on all app pages (Dashboard, Loans, Profile)
- [ ] Mobile: Hidden on auth pages (Login, Forgot PIN)
- [ ] Mobile: Hidden on full-screen wizards (Apply, KYC)
- [ ] Desktop: Sidebar visible on all app pages
- [ ] Desktop: No bottom nav on auth pages

## Missing Links to Add
- [ ] Register/Sign Up flow
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Logout confirmation modal

## Broken Links Found
(To be filled during audit)

## Navigation Fixes Applied
(To be filled as fixes are made)
