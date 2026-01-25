# API Contract (Client Integration)

This document defines the backend endpoints, request parameters, and expected responses
used by the client app (`client/`). It matches the types in `client/src/lib/api-types.ts`
and the service calls in `client/src/lib/api-service.ts`.

Base URL:
- `VITE_API_URL` (default: `http://localhost:8000/api`)

Auth:
- Protected endpoints expect `Authorization: Bearer <access_token>`.
- Content-Type: `application/json` for JSON payloads.

Error shape (recommended):
```json
{
  "code": "API_ERROR",
  "message": "Human readable message",
  "details": {}
}
```

---

## Auth

### POST /auth/login
Request:
```json
{
  "email": "user@example.com",
  "phone": "+260123456789",
  "pin": "1234"
}
```
Response:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+260123456789",
    "avatar": "https://..."
  },
  "token": "access-token",
  "refreshToken": "refresh-token"
}
```

### POST /auth/refresh
Request:
```json
{ "refreshToken": "refresh-token" }
```
Response:
```json
{ "token": "new-access-token", "refreshToken": "new-refresh-token" }
```

### POST /auth/forgot-pin
Request:
```json
{ "email": "user@example.com", "phone": "+260123456789" }
```
Response:
```json
{
  "success": true,
  "message": "Verification code sent",
  "verificationId": "verify-123"
}
```

### POST /auth/reset-pin
Request:
```json
{
  "verificationId": "verify-123",
  "newPin": "123456",
  "confirmPin": "123456"
}
```
Response:
```json
{ "success": true, "message": "PIN reset successfully" }
```

### POST /auth/request-otp
Request:
```json
{ "email": "user@example.com", "phone": "+260123456789" }
```
Response:
```json
{ "success": true, "message": "OTP sent successfully", "otpId": "otp-123" }
```

### POST /auth/verify-otp
Request:
```json
{ "otpId": "otp-123", "otp": "123456" }
```
Response:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+260123456789"
  },
  "token": "access-token",
  "refreshToken": "refresh-token"
}
```

---

## Users

### GET /users/profile
Response:
```json
{
  "id": "user-123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+260123456789",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street",
  "city": "Lusaka",
  "country": "Zambia",
  "idNumber": "ZM123456789",
  "idType": "National ID",
  "avatar": "https://...",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-10T00:00:00Z"
}
```

### PUT /users/profile
Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phone": "+260123456789",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street",
  "city": "Lusaka",
  "country": "Zambia"
}
```
Response:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "+260123456789",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-10T00:00:00Z"
  }
}
```

### POST /users/change-pin
Request:
```json
{ "oldPin": "123456", "newPin": "654321" }
```
Response:
```json
{ "success": true, "message": "PIN changed successfully" }
```

---

## Loans

### POST /loans/apply
Request:
```json
{
  "loanType": "personal",
  "loanCategory": "civil-servant",
  "institutionName": "Employer",
  "loanAmount": 10000,
  "repaymentMonths": 12,
  "purpose": "Emergency",
  "monthlyIncome": 5000,
  "employmentStatus": "employed",
  "existingDebt": 0
}
```
Response:
```json
{
  "success": true,
  "applicationId": "app-123",
  "loanId": "GL-2025-001",
  "status": "approved",
  "message": "Loan application approved",
  "loanDetails": {
    "id": "loan-123",
    "loanId": "GL-2025-001",
    "userId": "user-123",
    "loanType": "personal",
    "loanCategory": "Emergency",
    "loanAmount": 10000,
    "principalAmount": 10000,
    "interestRate": 1.5,
    "serviceCharge": 500,
    "totalRepayment": 11050,
    "repaymentMonths": 12,
    "monthlyPayment": 916.67,
    "status": "active",
    "approvalDate": "2025-01-01T00:00:00Z",
    "firstPaymentDate": "2025-02-01T00:00:00Z",
    "maturityDate": "2026-01-01T00:00:00Z",
    "nextPaymentDate": "2025-02-01T00:00:00Z",
    "amountPaid": 0,
    "amountRemaining": 10000,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### GET /loans
Response:
```json
[
  {
    "id": "loan-123",
    "loanId": "GL-2025-001",
    "userId": "user-123",
    "loanType": "personal",
    "loanCategory": "Emergency",
    "loanAmount": 10000,
    "principalAmount": 10000,
    "interestRate": 1.5,
    "serviceCharge": 500,
    "totalRepayment": 11050,
    "repaymentMonths": 12,
    "monthlyPayment": 916.67,
    "status": "active",
    "approvalDate": "2025-01-01T00:00:00Z",
    "firstPaymentDate": "2025-02-01T00:00:00Z",
    "maturityDate": "2026-01-01T00:00:00Z",
    "nextPaymentDate": "2025-02-01T00:00:00Z",
    "amountPaid": 0,
    "amountRemaining": 10000,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

### GET /loans/:id
Response: `LoanDetails` object (same shape as above).

### GET /loans/:id/repayment-schedule
Response:
```json
[
  {
    "id": "schedule-1",
    "loanId": "loan-123",
    "dueDate": "2025-02-01T00:00:00Z",
    "amount": 916.67,
    "principalAmount": 833.33,
    "interestAmount": 83.34,
    "status": "pending"
  }
]
```

### POST /loans/check-eligibility
Request:
```json
{
  "loanType": "personal",
  "monthlyIncome": 5000,
  "employmentStatus": "employed",
  "existingDebt": 0,
  "loanAmount": 10000
}
```
Response:
```json
{
  "eligible": true,
  "score": 85,
  "message": "You are eligible for a loan",
  "maxLoanAmount": 50000,
  "interestRate": 1.5
}
```

### POST /loans/restructuring
Request:
```json
{
  "loanId": "loan-123",
  "newRepaymentMonths": 24,
  "reason": "job-loss: reduced income"
}
```
Response:
```json
{
  "success": true,
  "requestId": "req-123",
  "status": "pending",
  "message": "Restructuring request submitted"
}
```

---

## Payments

### POST /payments/submit
Request:
```json
{
  "loanId": "loan-123",
  "amount": 916.67,
  "paymentMethod": "bank_transfer",
  "reference": "receipt-file-name.pdf"
}
```
Response:
```json
{
  "success": true,
  "transactionId": "txn-123",
  "status": "completed",
  "message": "Payment submitted successfully"
}
```

### GET /payments/history/:loanId
Response:
```json
[
  {
    "id": "pay-1",
    "transactionId": "txn-001",
    "loanId": "loan-123",
    "amount": 916.67,
    "paymentMethod": "bank_transfer",
    "status": "completed",
    "date": "2025-01-10T00:00:00Z",
    "reference": "GL-2025-001-001",
    "description": "Monthly Loan Payment"
  }
]
```

### POST /payments/early-repayment-calculation
Request:
```json
{ "loanId": "loan-123", "repaymentAmount": 2500 }
```
Response:
```json
{
  "loanId": "loan-123",
  "earlyPaymentAmount": 2500,
  "interestSaved": 500,
  "newMaturityDate": "2025-08-01T00:00:00Z",
  "totalPayment": 10550
}
```

### POST /payments/early-repayment
Request:
```json
{ "loanId": "loan-123", "repaymentAmount": 2500 }
```
Response:
```json
{
  "success": true,
  "message": "Early repayment submitted successfully",
  "calculation": {
    "loanId": "loan-123",
    "earlyPaymentAmount": 2500,
    "interestSaved": 500,
    "newMaturityDate": "2025-08-01T00:00:00Z",
    "totalPayment": 10550
  }
}
```

---

## KYC

### POST /kyc/upload (multipart/form-data)
Fields:
- `documentType`: `id | proof_of_income | bank_statement | utility_bill`
- `file`: binary upload
- `userId`: string

Response:
```json
{
  "success": true,
  "documentId": "doc-123",
  "url": "/documents/doc-123",
  "status": "verified",
  "message": "Document uploaded successfully"
}
```

### GET /kyc/status
Response:
```json
{
  "userId": "user-123",
  "status": "completed",
  "documents": [
    {
      "id": "doc-1",
      "type": "id",
      "status": "verified",
      "uploadedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "verificationDate": "2025-01-02T00:00:00Z"
}
```

---

## Notifications

### GET /notifications/settings
Response:
```json
{
  "userId": "user-123",
  "emailNotifications": true,
  "smsNotifications": true,
  "pushNotifications": false,
  "paymentReminders": true,
  "applicationUpdates": true,
  "promotions": false,
  "reminderFrequency": "daily"
}
```

### PUT /notifications/settings
Request:
```json
{
  "emailNotifications": true,
  "smsNotifications": true,
  "pushNotifications": false,
  "paymentReminders": true,
  "applicationUpdates": true,
  "promotions": false,
  "reminderFrequency": "weekly"
}
```
Response:
```json
{
  "userId": "user-123",
  "emailNotifications": true,
  "smsNotifications": true,
  "pushNotifications": false,
  "paymentReminders": true,
  "applicationUpdates": true,
  "promotions": false,
  "reminderFrequency": "weekly"
}
```

---

## Security

### GET /security/settings
Response:
```json
{
  "userId": "user-123",
  "twoFactorEnabled": false,
  "biometricEnabled": false,
  "lastLoginDate": "2025-01-01T00:00:00Z",
  "loginAttempts": 0,
  "accountLocked": false
}
```

### POST /security/enable-2fa
Request:
```json
{ "method": "sms" }
```
Response:
```json
{
  "success": true,
  "message": "Two-factor authentication enabled",
  "secret": "SECRET",
  "qrCode": "data:image/png;base64,..."
}
```

---

## Audit

### POST /audit/log
Request:
```json
{
  "eventType": "LOGIN_FAILED",
  "action": "User login failed",
  "details": {},
  "severity": "error",
  "timestamp": "2025-01-01T00:00:00Z"
}
```
Response:
```json
{ "success": true }
```
