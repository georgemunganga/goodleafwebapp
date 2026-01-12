/**
 * Secure Token Storage Utility
 * Provides secure storage for authentication tokens
 * 
 * Note: True httpOnly cookies require backend support. This implementation
 * provides a secure in-memory storage with optional localStorage fallback.
 * In production, migrate to httpOnly cookies set by backend.
 */

interface StorageOptions {
  useMemory?: boolean; // Use in-memory storage (secure, lost on refresh)
  useLocalStorage?: boolean; // Use localStorage (persistent, less secure)
  encryptionKey?: string; // Optional encryption key (not implemented yet)
}

const DEFAULT_OPTIONS: StorageOptions = {
  useMemory: true,
  useLocalStorage: false,
};

/**
 * In-memory token storage (most secure, lost on page refresh)
 */
class MemoryTokenStorage {
  private tokens = new Map<string, { value: string; expiresAt?: number }>();

  set(key: string, value: string, expiresIn?: number) {
    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : undefined;
    this.tokens.set(key, { value, expiresAt });
  }

  get(key: string): string | null {
    const token = this.tokens.get(key);
    if (!token) return null;

    // Check if token has expired
    if (token.expiresAt && Date.now() > token.expiresAt) {
      this.tokens.delete(key);
      return null;
    }

    return token.value;
  }

  remove(key: string) {
    this.tokens.delete(key);
  }

  clear() {
    this.tokens.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.tokens.keys());
  }
}

/**
 * LocalStorage-based token storage (persistent, less secure)
 * Only use as fallback if in-memory storage is not available
 */
class LocalStorageTokenStorage {
  private prefix = 'goodleaf_token_';

  set(key: string, value: string, expiresIn?: number) {
    try {
      const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : undefined;
      const data = { value, expiresAt };
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to store token in localStorage:', e);
    }
  }

  get(key: string): string | null {
    try {
      const data = localStorage.getItem(this.prefix + key);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Check if token has expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return parsed.value;
    } catch (e) {
      console.error('Failed to retrieve token from localStorage:', e);
      return null;
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (e) {
      console.error('Failed to remove token from localStorage:', e);
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Failed to clear tokens from localStorage:', e);
    }
  }

  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .map((key) => key.replace(this.prefix, ''));
    } catch (e) {
      console.error('Failed to get keys from localStorage:', e);
      return [];
    }
  }
}

/**
 * Secure Token Storage Manager
 * Abstracts token storage implementation
 */
class SecureTokenStorage {
  private memoryStorage: MemoryTokenStorage;
  private localStorageStorage: LocalStorageTokenStorage;
  private useMemory: boolean;
  private useLocalStorage: boolean;

  constructor(options: StorageOptions = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.useMemory = opts.useMemory ?? true;
    this.useLocalStorage = opts.useLocalStorage ?? false;
    this.memoryStorage = new MemoryTokenStorage();
    this.localStorageStorage = new LocalStorageTokenStorage();
  }

  set(key: string, value: string, expiresIn?: number) {
    if (this.useMemory) {
      this.memoryStorage.set(key, value, expiresIn);
    }
    if (this.useLocalStorage) {
      this.localStorageStorage.set(key, value, expiresIn);
    }
  }

  get(key: string): string | null {
    // Try memory storage first (most secure)
    if (this.useMemory) {
      const value = this.memoryStorage.get(key);
      if (value) return value;
    }

    // Fallback to localStorage
    if (this.useLocalStorage) {
      return this.localStorageStorage.get(key);
    }

    return null;
  }

  remove(key: string) {
    if (this.useMemory) {
      this.memoryStorage.remove(key);
    }
    if (this.useLocalStorage) {
      this.localStorageStorage.remove(key);
    }
  }

  clear() {
    if (this.useMemory) {
      this.memoryStorage.clear();
    }
    if (this.useLocalStorage) {
      this.localStorageStorage.clear();
    }
  }

  getAllKeys(): string[] {
    const keys = new Set<string>();

    if (this.useMemory) {
      this.memoryStorage.getAllKeys().forEach((k) => keys.add(k));
    }

    if (this.useLocalStorage) {
      this.localStorageStorage.getAllKeys().forEach((k) => keys.add(k));
    }

    return Array.from(keys);
  }

  /**
   * Check if a token exists and is valid (not expired)
   */
  isValid(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get all tokens as an object (useful for debugging)
   */
  getAllTokens(): Record<string, string | null> {
    const tokens: Record<string, string | null> = {};
    this.getAllKeys().forEach((key) => {
      tokens[key] = this.get(key);
    });
    return tokens;
  }
}

// Global instance
export const secureTokenStorage = new SecureTokenStorage({
  useMemory: true,
  useLocalStorage: false, // Set to true only if in-memory is not sufficient
});

/**
 * Specific token storage for authentication
 */
export const authTokenStorage = {
  setAccessToken: (token: string, expiresIn?: number) => {
    secureTokenStorage.set('access_token', token, expiresIn);
  },

  getAccessToken: (): string | null => {
    return secureTokenStorage.get('access_token');
  },

  setRefreshToken: (token: string, expiresIn?: number) => {
    secureTokenStorage.set('refresh_token', token, expiresIn);
  },

  getRefreshToken: (): string | null => {
    return secureTokenStorage.get('refresh_token');
  },

  setIdToken: (token: string, expiresIn?: number) => {
    secureTokenStorage.set('id_token', token, expiresIn);
  },

  getIdToken: (): string | null => {
    return secureTokenStorage.get('id_token');
  },

  clearAllTokens: () => {
    secureTokenStorage.clear();
  },

  isAuthenticated: (): boolean => {
    return secureTokenStorage.isValid('access_token');
  },

  getAllTokens: () => {
    return secureTokenStorage.getAllTokens();
  },
};

/**
 * Migration helper: Move tokens from localStorage to secure storage
 */
export function migrateTokensFromLocalStorage() {
  try {
    const keys = ['access_token', 'refresh_token', 'id_token'];
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        authTokenStorage.setAccessToken(value);
        localStorage.removeItem(key);
      }
    });
    console.info('Tokens migrated from localStorage to secure storage');
  } catch (e) {
    console.error('Failed to migrate tokens:', e);
  }
}
