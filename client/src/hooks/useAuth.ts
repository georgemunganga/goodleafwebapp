/**
 * useAuth Hook
 * Handles all authentication-related operations
 */

import { useCallback } from 'react';
import * as Types from '@/lib/api-types';
import { authService } from '@/lib/api-service';
import { useAuthContext } from '@/contexts/AuthContext';
import { auditLogger, AuditEventType } from '@/lib/audit-logger';

export function useAuth() {
  const authContext = useAuthContext();

  const login = useCallback(
    async (identifier: string, pin: string) => {
      try {
        const request: Types.LoginRequest = {
          phone: identifier.includes('@') ? undefined : identifier,
          email: identifier.includes('@') ? identifier : undefined,
          pin,
        };

        const response = await authContext.login(request);
        return { success: true, data: response };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        auditLogger.logAuth(AuditEventType.LOGIN_FAILED, identifier, false, errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [authContext]
  );

  const logout = useCallback(() => {
    authContext.logout();
    auditLogger.log(AuditEventType.LOGOUT, 'User logged out', {}, 'info');
  }, [authContext]);

  const forgotPIN = useCallback(
    async (email: string, phone: string) => {
      try {
        const request: Types.ForgotPINRequest = { email, phone };
        await authService.forgotPIN(request);
        auditLogger.log(AuditEventType.PIN_RESET, `PIN reset initiated for ${email}`, {}, 'info');
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initiate PIN reset';
        auditLogger.logError(error as Error, { action: 'forgotPIN' });
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const resetPIN = useCallback(
    async (verificationId: string, newPin: string, confirmPin: string) => {
      try {
        const request: Types.ResetPINRequest = { verificationId, newPin, confirmPin };
        await authService.resetPIN(request);
        auditLogger.log(AuditEventType.PIN_CHANGE, 'PIN reset successfully', {}, 'info');
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to reset PIN';
        auditLogger.logError(error as Error, { action: 'resetPIN' });
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const changePIN = useCallback(
    async (currentPIN: string, newPIN: string) => {
      try {
        // API call would go here - implement in api-service
        auditLogger.log(AuditEventType.PIN_CHANGE, 'PIN changed successfully', {}, 'info');
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to change PIN';
        auditLogger.logError(error as Error, { action: 'changePIN' });
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const refreshToken = useCallback(async () => {
    return authContext.refreshToken();
  }, [authContext]);

  const getSessionRemainingTime = useCallback(() => {
    return authContext.getSessionRemainingTime();
  }, [authContext]);

  return {
    // State
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    loading: authContext.loading,
    error: authContext.error,

    // Methods
    login,
    logout,
    forgotPIN,
    resetPIN,
    changePIN,
    refreshToken,
    getSessionRemainingTime,
  };
}
