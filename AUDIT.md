# Goodleaf Loans App - Page Audit

## Pages to Audit

### 1. Login Page ✅
- [x] Email/Phone toggle
- [x] PIN input
- [x] Sign In button
- [ ] "Register here" link - needs Registration page
- [ ] "Apply for a Loan" button - links to /apply (exists)
- [ ] "Forgot PIN?" link - needs Forgot PIN page

### 2. Dashboard ✅
- [x] Welcome message
- [x] Total outstanding balance
- [x] Quick action buttons
- [x] Active loans section
- [x] Payment due alert
- [x] Recent activity
- [ ] "View All" links - need to verify they navigate correctly

### 3. Loans (LoanHistory) ✅
- [x] Search bar
- [x] Filter pills
- [x] Loan cards
- [ ] Clicking a loan card should navigate to /loans/:id

### 4. Loan Details ✅
- [x] Loan overview
- [x] Repayment progress
- [x] Next payment card
- [x] Repayment schedule
- [x] Action buttons (Pay Now, Early Repayment, Restructuring)

### 5. Loan Application ✅
- [x] 3-step wizard
- [x] Form fields
- [x] Summary review
- [x] PIN verification

### 6. Pre-Eligibility Checker ✅
- [x] Loan type selection
- [x] Employment status
- [x] Monthly income input
- [x] Existing debt input
- [x] Eligibility result display

### 7. Profile ✅
- [x] User info header
- [x] Contact information
- [x] Settings menu items
- [ ] Settings items are placeholders - need actual pages:
  - [ ] Personal Details page
  - [ ] Change PIN page
  - [ ] Notifications page
  - [ ] Security page
  - [ ] Documents page
  - [ ] Help & Support page

### 8. KYC Workflow ⚠️
- [ ] Document upload interface
- [ ] File preview
- [ ] Upload status

### 9. Repayment Submission ⚠️
- [ ] Bank details display
- [ ] Payment proof upload
- [ ] Confirmation

### 10. Early Repayment Calculator ⚠️
- [ ] Settlement calculation
- [ ] Payment options

### 11. Loan Restructuring ⚠️
- [ ] Restructuring request form
- [ ] Tenure extension options

## Missing Pages to Create

1. **Registration/Sign Up Page**
   - Phone verification
   - PIN setup
   - Terms acceptance

2. **Forgot PIN Page**
   - Phone/Email verification
   - PIN reset

3. **Personal Details Page**
   - Edit name, email, phone
   - Save changes

4. **Change PIN Page**
   - Current PIN verification
   - New PIN setup
   - Confirmation

5. **Notifications Settings Page**
   - Toggle payment reminders
   - Toggle alerts
   - Notification frequency

6. **Security Page**
   - 2FA settings
   - Active sessions
   - Login history

7. **Documents Page**
   - KYC documents list
   - Upload new documents
   - Document status

8. **Help & Support Page**
   - FAQs
   - Contact form
   - Support chat

## Placeholder Features to Replace

- [ ] Profile settings items - currently show "Feature coming soon"
- [ ] Help & Support - needs actual content/form
- [ ] Logout - needs confirmation modal

## Navigation Issues to Fix

- [ ] Verify all navigation links work correctly
- [ ] Ensure back buttons work on all pages
- [ ] Test bottom nav on mobile
- [ ] Test sidebar on desktop
