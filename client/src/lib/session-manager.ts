/**
 * Session Manager
 * Handles authentication tokens, session timeouts, and token refresh
 */

import { apiCall } from './api-config';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const SESSION_TIMEOUT_KEY = 'sessionTimeout';
const SESSION_TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

let sessionTimeoutId: NodeJS.Timeout | null = null;
let refreshTimeoutId: NodeJS.Timeout | null = null;

export const sessionManager = {
  /**
   * Save tokens to localStorage
   */
  saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.resetSessionTimeout();
    this.scheduleTokenRefresh();
  },

  /**
   * Get access token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Save user data
   */
  saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get user data
   */
  getUser(): any | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },

  /**
   * Clear all session data
   */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.clearSessionTimeout();
    this.clearTokenRefreshTimeout();
  },

  /**
   * Reset session timeout on user activity
   */
  resetSessionTimeout(): void {
    this.clearSessionTimeout();

    sessionTimeoutId = setTimeout(() => {
      this.handleSessionTimeout();
    }, SESSION_TIMEOUT_DURATION);

    localStorage.setItem(SESSION_TIMEOUT_KEY, Date.now().toString());
  },

  /**
   * Clear session timeout
   */
  clearSessionTimeout(): void {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      sessionTimeoutId = null;
    }
  },

  /**
   * Handle session timeout
   */
  handleSessionTimeout(): void {
    this.clearSession();
    window.dispatchEvent(new CustomEvent('sessionTimeout'));
  },

  /**
   * Schedule token refresh before expiration
   * Assumes JWT tokens expire in 1 hour, refresh 5 minutes before expiration
   */
  scheduleTokenRefresh(): void {
    this.clearTokenRefreshTimeout();

    // Refresh token 55 minutes after login (1 hour - 5 minutes)
    refreshTimeoutId = setTimeout(() => {
      this.refreshToken();
    }, 55 * 60 * 1000);
  },

  /**
   * Clear token refresh timeout
   */
  clearTokenRefreshTimeout(): void {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearSession();
        return false;
      }

      // Call refresh endpoint using centralized API config
      const data = await apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      this.saveTokens(data.token, data.refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearSession();
      return false;
    }
  },

  /**
   * Get session remaining time in milliseconds
   */
  getSessionRemainingTime(): number {
    const lastActivityTime = localStorage.getItem(SESSION_TIMEOUT_KEY);
    if (!lastActivityTime) return 0;

    const elapsed = Date.now() - parseInt(lastActivityTime);
    const remaining = SESSION_TIMEOUT_DURATION - elapsed;

    return Math.max(0, remaining);
  },

  /**
   * Setup activity listeners to reset session timeout
   */
  setupActivityListeners(): () => void {
    const resetOnActivity = () => {
      if (this.isAuthenticated()) {
        this.resetSessionTimeout();
      }
    };

    // Listen for user activity
    document.addEventListener('mousedown', resetOnActivity);
    document.addEventListener('keydown', resetOnActivity);
    document.addEventListener('touchstart', resetOnActivity);
    document.addEventListener('click', resetOnActivity);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', resetOnActivity);
      document.removeEventListener('keydown', resetOnActivity);
      document.removeEventListener('touchstart', resetOnActivity);
      document.removeEventListener('click', resetOnActivity);
    };
  },
};
