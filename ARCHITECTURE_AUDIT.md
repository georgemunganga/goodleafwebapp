# Architectural Layers Audit

## Current Architecture Structure

```
client/src/
├── pages/              # UI Layer (Presentation)
├── components/         # UI Components Layer
├── hooks/              # Custom Hooks Layer (Business Logic)
├── contexts/           # State Management Layer
├── lib/                # Utilities & Services Layer
│   ├── api-service.ts  # API Service Layer
│   ├── api-types.ts    # Type Definitions
│   ├── validators.ts   # Business Logic
│   ├── session-manager.ts  # Session Management
│   └── audit-logger.ts # Logging
└── main.tsx            # Entry Point
```

## Layer Responsibilities

### 1. **UI Layer (pages/ & components/)**
**Responsibility:** Render UI and handle user interactions
**Should NOT contain:**
- ❌ Direct API calls
- ❌ Business logic
- ❌ State management beyond local UI state
- ❌ API types or service logic

**Current Status:** ✅ COMPLIANT
- Pages use hooks to fetch data
- Components receive props
- No direct fetch() or API calls in UI layer
- Example: `Dashboard.tsx` uses `useApi()` hook, not direct API calls

---

### 2. **Custom Hooks Layer (hooks/)**
**Responsibility:** Encapsulate business logic and data fetching
**Should contain:**
- ✅ API calls via service layer
- ✅ Data transformation
- ✅ Error handling
- ✅ Loading states
- ✅ Caching logic

**Should NOT contain:**
- ❌ UI rendering
- ❌ Direct state management (use Context instead)
- ❌ API service logic

**Current Status:** ⚠️ NEEDS REVIEW
- `useApi.ts` exists but may need to be split into domain-specific hooks
- Should have: `useAuth()`, `useLoans()`, `usePayments()`, `useProfile()`, etc.

---

### 3. **State Management Layer (contexts/)**
**Responsibility:** Global state management
**Should contain:**
- ✅ AuthContext for user state
- ✅ Global app state
- ✅ State persistence logic

**Should NOT contain:**
- ❌ Direct API calls (use hooks instead)
- ❌ UI rendering

**Current Status:** ✅ COMPLIANT
- `AuthContext.tsx` properly manages auth state
- Uses session manager for persistence
- Calls API service via hooks

---

### 4. **API Service Layer (lib/api-service.ts)**
**Responsibility:** HTTP client and API communication
**Should contain:**
- ✅ HTTP requests (fetch/axios)
- ✅ Request/response interceptors
- ✅ Error handling
- ✅ Token management
- ✅ Mock data support (VITE_USAGE_DEMO)

**Should NOT contain:**
- ❌ UI logic
- ❌ React hooks
- ❌ State management

**Current Status:** ✅ COMPLIANT
- Pure service layer with no React dependencies
- Supports mock data via flag
- Proper error handling

---

### 5. **Type Definitions Layer (lib/api-types.ts)**
**Responsibility:** API contract definitions
**Should contain:**
- ✅ Request/Response interfaces
- ✅ Error types
- ✅ Enum definitions
- ✅ API documentation

**Should NOT contain:**
- ❌ Implementation logic
- ❌ API calls

**Current Status:** ✅ COMPLIANT
- Clean type definitions
- No implementation logic

---

### 6. **Utilities Layer (lib/)**
**Responsibility:** Cross-cutting concerns
**Should contain:**
- ✅ Validators
- ✅ Session management
- ✅ Audit logging
- ✅ Formatters
- ✅ Helpers

**Should NOT contain:**
- ❌ UI components
- ❌ API calls (except service layer)
- ❌ React-specific logic (except hooks)

**Current Status:** ✅ COMPLIANT
- `form-validator.ts` - Pure validation logic
- `session-manager.ts` - Session handling
- `audit-logger.ts` - Logging utility

---

## Architectural Issues Found

### Issue 1: Missing Domain-Specific Hooks
**Severity:** Medium
**Problem:** Generic `useApi()` hook instead of domain-specific hooks
**Solution:** Create specialized hooks:
```typescript
// hooks/useAuth.ts
// hooks/useLoans.ts
// hooks/usePayments.ts
// hooks/useProfile.ts
// hooks/useKYC.ts
```

### Issue 2: API Service Could Be Better Organized
**Severity:** Low
**Problem:** All API endpoints in one file
**Solution:** Split by domain:
```typescript
lib/
├── api/
│   ├── auth.ts
│   ├── loans.ts
│   ├── payments.ts
│   ├── profile.ts
│   └── kyc.ts
└── api-service.ts (exports all)
```

### Issue 3: Pages Not Using API Integration
**Severity:** High
**Problem:** Pages still use mock data, not API calls
**Solution:** Update pages to use hooks:
```typescript
// Before
const [loans, setLoans] = useState(mockLoans);

// After
const { data: loans, loading, error } = useLoans();
```

### Issue 4: No Error Boundary at Page Level
**Severity:** Medium
**Problem:** Only global error boundary exists
**Solution:** Add error boundaries to critical pages

### Issue 5: Session Manager Not Integrated with API Service
**Severity:** High
**Problem:** Token refresh logic exists but not used by API service
**Solution:** Add interceptor to API service for token refresh

---

## Recommended Refactoring

### Phase 1: Create Domain-Specific Hooks
```
hooks/
├── useAuth.ts          # Login, logout, PIN change
├── useLoans.ts         # Loan CRUD operations
├── usePayments.ts      # Payment operations
├── useProfile.ts       # User profile operations
├── useKYC.ts           # KYC document operations
└── useNotifications.ts # Notification preferences
```

### Phase 2: Organize API Service by Domain
```
lib/api/
├── auth.ts             # Auth endpoints
├── loans.ts            # Loan endpoints
├── payments.ts         # Payment endpoints
├── profile.ts          # Profile endpoints
├── kyc.ts              # KYC endpoints
├── client.ts           # HTTP client with interceptors
└── types.ts            # API types
```

### Phase 3: Integrate API Calls into Pages
- Update all pages to use domain-specific hooks
- Remove mock data
- Add proper error handling
- Add loading states

### Phase 4: Add Token Refresh Interceptor
- Implement automatic token refresh
- Handle 401 responses
- Redirect to login on auth failure

---

## Compliance Summary

| Layer | Status | Issues |
|-------|--------|--------|
| UI (pages/components) | ✅ COMPLIANT | None |
| Custom Hooks | ⚠️ NEEDS WORK | Generic hooks, not domain-specific |
| State Management | ✅ COMPLIANT | None |
| API Service | ✅ COMPLIANT | Could be better organized |
| Type Definitions | ✅ COMPLIANT | None |
| Utilities | ✅ COMPLIANT | None |

## Overall Architecture Score: 7/10

**Strengths:**
- Clean separation of concerns
- No API calls in UI layer
- Proper type safety
- Good use of contexts and hooks

**Weaknesses:**
- Generic hooks instead of domain-specific
- API service not fully integrated into pages
- Missing token refresh interceptor
- No page-level error boundaries

## Next Steps

1. ✅ Create domain-specific hooks
2. ✅ Reorganize API service by domain
3. ✅ Integrate API calls into pages
4. ✅ Add token refresh interceptor
5. ✅ Add page-level error boundaries
