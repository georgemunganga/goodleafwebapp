# Goodleaf Loans - API Integration Guide

## Overview

This document outlines the API integration architecture for the Goodleaf Loans web app. The frontend is fully structured with mock data support and is ready for backend API integration.

## Architecture

### Layers

1. **API Types** (`client/src/lib/api-types.ts`)
   - Complete TypeScript interfaces for all requests/responses
   - Defines all data structures for the backend

2. **API Service** (`client/src/lib/api-service.ts`)
   - HTTP client for all API calls
   - Supports mock data via `VITE_USAGE_DEMO` environment variable
   - Organized by domain (auth, user, loan, payment, etc.)

3. **Custom Hooks** (`client/src/hooks/useApi.ts`)
   - React hooks for API calls with loading/error states
   - `useAuth()` - Authentication
   - `useLoans()` - Loan data
   - `useLoanDetails()` - Single loan
   - `useRepaymentSchedule()` - Payment schedule
   - `usePaymentHistory()` - Transaction history

4. **Context** (`client/src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - Persists user data to localStorage

## API Endpoints Required

### Authentication
- `POST /api/auth/login` - User login with email/phone + PIN
- `POST /api/auth/forgot-pin` - Forgot PIN flow
- `POST /api/auth/reset-pin` - Reset PIN

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-pin` - Change PIN

### Loans
- `POST /api/loans/check-eligibility` - Pre-eligibility check
- `POST /api/loans/apply` - Apply for loan
- `GET /api/loans` - Get user's loans
- `GET /api/loans/{loanId}` - Get loan details
- `GET /api/loans/{loanId}/repayment-schedule` - Get repayment schedule

### Payments
- `POST /api/payments/submit` - Submit payment
- `GET /api/payments/history/{loanId}` - Get payment history
- `POST /api/payments/early-repayment-calculation` - Calculate early repayment
- `POST /api/payments/early-repayment` - Submit early repayment

### Loan Restructuring
- `POST /api/loans/restructuring` - Request loan restructuring

### KYC / Documents
- `POST /api/kyc/upload` - Upload document
- `GET /api/kyc/status` - Get KYC status

### Notifications
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings` - Update notification settings

### Security
- `GET /api/security/settings` - Get security settings
- `POST /api/security/enable-2fa` - Enable two-factor authentication

## Environment Variables

```env
# API Configuration
VITE_API_URL=https://admin.goodleafcapital.com/api

# Demo Mode (uses mock data instead of real API)
VITE_USAGE_DEMO=false
```

## Request/Response Format

### Authentication Request
```typescript
{
  phone?: string;  // +260123456789
  email?: string;  // user@example.com
  pin: string;     // 6-digit PIN
}
```

### Authentication Response
```typescript
{
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}
```

### Error Response
```typescript
{
  code: string;           // Error code
  message: string;        // Error message
  details?: object;       // Additional error details
}
```

## Integration Steps

### 1. Update Environment Variables
Set `VITE_API_URL` to your backend API base URL:
```bash
VITE_API_URL=https://api.goodleaf.com/api
```

### 2. Implement Backend Endpoints
Create endpoints matching the interfaces in `api-types.ts`

### 3. Update API Service
The API service layer automatically handles:
- Authentication headers (Bearer token)
- Error handling
- Request/response serialization
- Mock data fallback (if `VITE_USAGE_DEMO=true`)

### 4. Test Integration
The app will automatically use real APIs when:
- `VITE_API_URL` is configured
- `VITE_USAGE_DEMO=false` (or not set)

## Authentication Flow

1. User enters phone/email and PIN on Login page
2. `useAuthContext().login()` is called
3. API service sends request to `/api/auth/login`
4. Response includes user data and JWT token
5. Token is stored in localStorage
6. User is redirected to dashboard
7. All subsequent requests include `Authorization: Bearer {token}` header

## Error Handling

All API errors are caught and formatted as `ApiError`:
```typescript
{
  code: string;      // Error code for UI handling
  message: string;   // User-friendly message
  status: number;    // HTTP status code
  details?: object;  // Additional error details
}
```

Errors are displayed to users via toast notifications:
```typescript
toast.error(error.message);
```

## Mock Data Mode

For development/testing without a backend:

```bash
VITE_USAGE_DEMO=true
```

When enabled:
- All API calls return realistic mock data
- No actual HTTP requests are made
- Login works with any credentials
- Loan data is pre-populated

## Pages Using API Integration

- **Login** - Authentication
- **Dashboard** - User loans and stats
- **Loans** - Loan history and filtering
- **Loan Details** - Individual loan info and repayment schedule
- **Loan Application** - New loan application
- **Payment History** - Transaction timeline
- **Profile** - User profile management
- **All Settings Pages** - User preferences

## Next Steps

1. **Create Backend Endpoints** - Implement all endpoints defined in this guide
2. **Database Schema** - Design database to match API response types
3. **Authentication** - Implement JWT token generation and validation
4. **Testing** - Test all endpoints with the frontend
5. **Deployment** - Deploy backend and update `VITE_API_URL`

## Support

For questions about the API integration, refer to:
- `client/src/lib/api-types.ts` - All type definitions
- `client/src/lib/api-service.ts` - API service implementation
- `client/src/hooks/useApi.ts` - Custom hooks
- `client/src/contexts/AuthContext.tsx` - Auth context
