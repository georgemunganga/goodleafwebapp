# Navigation Issues Found

## Critical Issues

### 1. **Broken Link: Pay Now Button** ❌
- **Location**: Loan Details page (`/loans/:id`)
- **Issue**: "Pay Now" button navigates to `/repay` which returns 404
- **Expected**: Should navigate to `/repayment`
- **Status**: NEEDS FIX

### 2. **Missing Navigation: Register Link** ❌
- **Location**: Login page
- **Issue**: "Register here" button does nothing (no onClick handler)
- **Expected**: Should navigate to registration flow or `/apply` (since apply handles both)
- **Status**: NEEDS FIX

### 3. **Missing Navigation: Terms of Service** ❌
- **Location**: Login page footer
- **Issue**: "Terms of Service" button does nothing
- **Expected**: Should navigate to `/terms` or show modal
- **Status**: NEEDS FIX

### 4. **Missing Navigation: Privacy Policy** ❌
- **Location**: Login page footer
- **Issue**: "Privacy Policy" button does nothing
- **Expected**: Should navigate to `/privacy` or show modal
- **Status**: NEEDS FIX

## Minor Issues

### 5. **Settings Menu Item** ⚠️
- **Location**: Sidebar/Profile menu
- **Issue**: "Settings" menu item exists but no page implemented
- **Expected**: Should navigate to a settings page or be removed
- **Status**: NEEDS CLARIFICATION

### 6. **Logout Functionality** ⚠️
- **Location**: Sidebar/Profile menu
- **Issue**: "Logout" button exists but no confirmation modal
- **Expected**: Should show confirmation before logging out
- **Status**: OPTIONAL ENHANCEMENT

## Working Navigation ✓

- ✓ Forgot PIN → Back to Login
- ✓ Apply for Loan → Full wizard flow
- ✓ Dashboard → All quick action buttons
- ✓ Loans → Loan card clicks to details
- ✓ Profile → All menu items navigate correctly
- ✓ Bottom nav → Works on all app pages
- ✓ Sidebar → Works on desktop

## Summary

**Total Issues**: 6
- **Critical**: 4
- **Minor**: 2
- **Working**: 7+

**Priority Fixes**:
1. Fix Pay Now button link (`/repay` → `/repayment`)
2. Add Register link handler
3. Add Terms of Service page/modal
4. Add Privacy Policy page/modal
