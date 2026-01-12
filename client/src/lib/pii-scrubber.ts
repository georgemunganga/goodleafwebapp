/**
 * PII Scrubber Utility
 * Removes or masks Personally Identifiable Information from logs and analytics
 * Helps comply with data privacy regulations (GDPR, CCPA, etc.)
 */

// Patterns for detecting PII
const PII_PATTERNS = {
  // Phone numbers: +260123456789, 0123456789, (123) 456-7890
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}\d{7,14}/g,
  
  // Email addresses
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // National ID numbers (Zambian format: NNNNNNNNNNNN)
  nationalId: /\b\d{12}\b/g,
  
  // Credit/Debit card numbers
  cardNumber: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  
  // PIN codes (4-6 digits)
  pin: /\b\d{4,6}\b/g,
  
  // Names (basic pattern - words starting with capital letter)
  name: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
  
  // Passport numbers
  passport: /[A-Z]{2}\d{7}/g,
  
  // Bank account numbers
  accountNumber: /\b\d{10,20}\b/g,
};

interface ScrubbingOptions {
  scrubPhone?: boolean;
  scrubEmail?: boolean;
  scrubNationalId?: boolean;
  scrubCardNumber?: boolean;
  scrubPin?: boolean;
  scrubName?: boolean;
  scrubPassport?: boolean;
  scrubAccountNumber?: boolean;
  maskLevel?: 'full' | 'partial'; // 'full' = [REDACTED], 'partial' = show last 2 chars
}

const DEFAULT_OPTIONS: ScrubbingOptions = {
  scrubPhone: true,
  scrubEmail: true,
  scrubNationalId: true,
  scrubCardNumber: true,
  scrubPin: true,
  scrubName: false, // Usually safe to log names
  scrubPassport: true,
  scrubAccountNumber: true,
  maskLevel: 'full',
};

/**
 * Mask a string based on mask level
 */
function maskString(str: string, maskLevel: 'full' | 'partial' = 'full'): string {
  if (maskLevel === 'full') {
    return '[REDACTED]';
  }
  // Partial: show last 2 characters
  if (str.length <= 2) {
    return '[REDACTED]';
  }
  return '[REDACTED]' + str.slice(-2);
}

/**
 * Scrub PII from a string
 */
export function scrubString(text: string, options: ScrubbingOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = text;

  if (opts.scrubPhone) {
    result = result.replace(PII_PATTERNS.phone, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubEmail) {
    result = result.replace(PII_PATTERNS.email, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubNationalId) {
    result = result.replace(PII_PATTERNS.nationalId, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubCardNumber) {
    result = result.replace(PII_PATTERNS.cardNumber, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubPin) {
    result = result.replace(PII_PATTERNS.pin, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubName) {
    result = result.replace(PII_PATTERNS.name, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubPassport) {
    result = result.replace(PII_PATTERNS.passport, (match) => maskString(match, opts.maskLevel));
  }

  if (opts.scrubAccountNumber) {
    result = result.replace(PII_PATTERNS.accountNumber, (match) => maskString(match, opts.maskLevel));
  }

  return result;
}

/**
 * Scrub PII from an object (recursively)
 */
export function scrubObject(obj: any, options: ScrubbingOptions = {}): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return scrubString(obj, options);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => scrubObject(item, options));
  }

  if (typeof obj === 'object') {
    const scrubbed: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Skip sensitive keys entirely
        if (
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('apikey')
        ) {
          scrubbed[key] = '[REDACTED]';
        } else {
          scrubbed[key] = scrubObject(obj[key], options);
        }
      }
    }
    return scrubbed;
  }

  return obj;
}

/**
 * Create a safe log message with PII scrubbed
 */
export function createSafeLog(message: string, data?: any, options: ScrubbingOptions = {}): string {
  let logMessage = scrubString(message, options);

  if (data) {
    const scrubbedData = scrubObject(data, options);
    logMessage += ' ' + JSON.stringify(scrubbedData);
  }

  return logMessage;
}

/**
 * Console logging with automatic PII scrubbing
 */
export const safeConsole = {
  log: (message: string, data?: any) => {
    console.log(createSafeLog(message, data));
  },
  warn: (message: string, data?: any) => {
    console.warn(createSafeLog(message, data));
  },
  error: (message: string, data?: any) => {
    console.error(createSafeLog(message, data));
  },
  info: (message: string, data?: any) => {
    console.info(createSafeLog(message, data));
  },
};

/**
 * Audit logger - logs events with PII scrubbing
 */
export class AuditLogger {
  private logs: Array<{ timestamp: string; message: string; level: string }> = [];

  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const scrubbedMessage = createSafeLog(message, data);
    const entry = {
      timestamp: new Date().toISOString(),
      message: scrubbedMessage,
      level,
    };

    this.logs.push(entry);

    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      if (level === 'info') console.info(scrubbedMessage);
      else if (level === 'warn') console.warn(scrubbedMessage);
      else if (level === 'error') console.error(scrubbedMessage);
    }
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Global audit logger instance
export const auditLogger = new AuditLogger();
