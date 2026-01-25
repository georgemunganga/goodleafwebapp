/**
 * Audit Logger
 * Logs user actions and security events for compliance and debugging
 */

import { apiCall } from './api-config';

export enum AuditEventType {
  // Authentication events
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PIN_CHANGE = 'PIN_CHANGE',
  PIN_RESET = 'PIN_RESET',

  // Loan events
  LOAN_APPLICATION_STARTED = 'LOAN_APPLICATION_STARTED',
  LOAN_APPLICATION_SUBMITTED = 'LOAN_APPLICATION_SUBMITTED',
  LOAN_APPLICATION_APPROVED = 'LOAN_APPLICATION_APPROVED',
  LOAN_APPLICATION_REJECTED = 'LOAN_APPLICATION_REJECTED',
  LOAN_VIEWED = 'LOAN_VIEWED',
  LOAN_RESTRUCTURING_REQUESTED = 'LOAN_RESTRUCTURING_REQUESTED',

  // Payment events
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  EARLY_REPAYMENT_INITIATED = 'EARLY_REPAYMENT_INITIATED',

  // KYC events
  KYC_DOCUMENT_UPLOADED = 'KYC_DOCUMENT_UPLOADED',
  KYC_VERIFICATION_STARTED = 'KYC_VERIFICATION_STARTED',
  KYC_VERIFICATION_COMPLETED = 'KYC_VERIFICATION_COMPLETED',

  // Profile events
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',

  // Security events
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  MULTIPLE_LOGIN_ATTEMPTS = 'MULTIPLE_LOGIN_ATTEMPTS',
  SESSION_TIMEOUT = 'SESSION_TIMEOUT',
  UNAUTHORIZED_ACCESS_ATTEMPT = 'UNAUTHORIZED_ACCESS_ATTEMPT',

  // Error events
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  API_ERROR = 'API_ERROR',
}

export interface AuditLog {
  timestamp: string;
  eventType: AuditEventType;
  userId?: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

class AuditLogger {
  private logs: AuditLog[] = [];
  private maxLogs = 1000;

  /**
   * Log an event
   */
  log(
    eventType: AuditEventType,
    action: string,
    details?: Record<string, any>,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      eventType,
      action,
      details,
      userAgent: navigator.userAgent,
      severity,
    };

    // Add userId if available
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        log.userId = user.id;
      }
    } catch (e) {
      // Ignore parsing errors
    }

    this.logs.push(log);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${eventType}:`, action, details);
    }

    // Send to backend audit service
    this.sendToBackend(log);

    // Alert on critical events
    if (severity === 'critical') {
      this.alertCriticalEvent(log);
    }
  }

  /**
   * Log authentication event
   */
  logAuth(
    eventType: AuditEventType,
    identifier: string,
    success: boolean,
    reason?: string
  ): void {
    this.log(
      eventType,
      `${success ? 'Successful' : 'Failed'} authentication attempt`,
      {
        identifier: this.maskSensitiveData(identifier),
        success,
        reason,
      },
      success ? 'info' : 'warning'
    );
  }

  /**
   * Log loan event
   */
  logLoan(
    eventType: AuditEventType,
    loanId: string,
    action: string,
    details?: Record<string, any>
  ): void {
    this.log(eventType, action, { loanId, ...details }, 'info');
  }

  /**
   * Log payment event
   */
  logPayment(
    eventType: AuditEventType,
    loanId: string,
    amount: number,
    status: string,
    details?: Record<string, any>
  ): void {
    this.log(
      eventType,
      `Payment ${status}`,
      { loanId, amount, status, ...details },
      status === 'completed' ? 'info' : 'warning'
    );
  }

  /**
   * Log error event
   */
  logError(error: Error, context?: Record<string, any>): void {
    this.log(
      AuditEventType.ERROR_OCCURRED,
      error.message,
      {
        errorStack: error.stack,
        ...context,
      },
      'error'
    );
  }

  /**
   * Log security event
   */
  logSecurityEvent(
    eventType: AuditEventType,
    description: string,
    details?: Record<string, any>
  ): void {
    this.log(eventType, description, details, 'critical');
  }

  /**
   * Get all logs
   */
  getLogs(): AuditLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by event type
   */
  getLogsByEventType(eventType: AuditEventType): AuditLog[] {
    return this.logs.filter((log) => log.eventType === eventType);
  }

  /**
   * Get logs by date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
    return this.logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Mask sensitive data
   */
  private maskSensitiveData(data: string): string {
    // Mask email
    if (data.includes('@')) {
      const [local, domain] = data.split('@');
      return `${local.substring(0, 2)}***@${domain}`;
    }

    // Mask phone number
    if (/^\d{10,}$/.test(data)) {
      return `***${data.substring(data.length - 4)}`;
    }

    return data;
  }

  /**
   * Send log to backend
   */
  private sendToBackend(log: AuditLog): void {
    // Only send critical events and errors to backend immediately
    if (log.severity === 'critical' || log.severity === 'error') {
      apiCall('/audit/log', {
        method: 'POST',
        body: JSON.stringify(log),
      }).catch((error) => {
        console.error('Failed to send audit log to backend:', error);
      });
    }
  }

  /**
   * Alert on critical events
   */
  private alertCriticalEvent(log: AuditLog): void {
    console.warn(`[CRITICAL AUDIT EVENT] ${log.eventType}: ${log.action}`);

    // Could trigger notifications, alerts, etc.
    // Example: Send to monitoring service
  }
}

export const auditLogger = new AuditLogger();
