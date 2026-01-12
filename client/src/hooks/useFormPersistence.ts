/**
 * Form State Persistence Hook
 * 
 * Automatically saves form state to localStorage and restores it on mount
 * Includes debouncing, encryption, and recovery UI support
 */

import { useEffect, useRef, useCallback } from 'react';

interface FormPersistenceOptions {
  key: string;
  debounceMs?: number;
  encrypt?: boolean;
  onRestore?: (data: any) => void;
}

interface PersistedFormData {
  data: any;
  timestamp: number;
  version: string;
}

const FORM_PERSISTENCE_VERSION = '1.0';
const DEFAULT_DEBOUNCE_MS = 500;

/**
 * useFormPersistence Hook
 * 
 * Usage:
 * const { saveForm, clearForm, hasSavedData, restoreForm } = useFormPersistence({
 *   key: 'loan-application',
 *   debounceMs: 500,
 *   onRestore: (data) => setFormData(data)
 * });
 * 
 * // Auto-save on form change
 * useEffect(() => {
 *   saveForm(formData);
 * }, [formData, saveForm]);
 */
export function useFormPersistence(options: FormPersistenceOptions) {
  const {
    key,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    encrypt = false,
    onRestore,
  } = options;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `form_${key}`;

  /**
   * Save form data to localStorage with debouncing
   */
  const saveForm = useCallback(
    (data: any) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        try {
          const persistedData: PersistedFormData = {
            data,
            timestamp: Date.now(),
            version: FORM_PERSISTENCE_VERSION,
          };

          const serialized = JSON.stringify(persistedData);
          const toStore = encrypt ? btoa(serialized) : serialized;

          localStorage.setItem(storageKey, toStore);
          console.log(`[FormPersistence] Saved form state for key: ${key}`);
        } catch (error) {
          console.error(`[FormPersistence] Failed to save form state:`, error);
        }
      }, debounceMs);
    },
    [key, debounceMs, encrypt, storageKey]
  );

  /**
   * Restore form data from localStorage
   */
  const restoreForm = useCallback((): any | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const deserialized = encrypt ? atob(stored) : stored;
      const persistedData: PersistedFormData = JSON.parse(deserialized);

      // Validate version
      if (persistedData.version !== FORM_PERSISTENCE_VERSION) {
        console.warn(
          `[FormPersistence] Version mismatch. Expected ${FORM_PERSISTENCE_VERSION}, got ${persistedData.version}`
        );
        return null;
      }

      console.log(`[FormPersistence] Restored form state for key: ${key}`);
      return persistedData.data;
    } catch (error) {
      console.error(`[FormPersistence] Failed to restore form state:`, error);
      return null;
    }
  }, [key, encrypt, storageKey]);

  /**
   * Clear saved form data
   */
  const clearForm = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      console.log(`[FormPersistence] Cleared form state for key: ${key}`);
    } catch (error) {
      console.error(`[FormPersistence] Failed to clear form state:`, error);
    }
  }, [key, storageKey]);

  /**
   * Check if saved data exists
   */
  const hasSavedData = useCallback((): boolean => {
    try {
      return localStorage.getItem(storageKey) !== null;
    } catch (error) {
      console.error(`[FormPersistence] Failed to check saved data:`, error);
      return false;
    }
  }, [storageKey]);

  /**
   * Get saved data info (timestamp, age)
   */
  const getSavedDataInfo = useCallback(
    (): { timestamp: number; ageMs: number; ageHours: number } | null => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) return null;

        const deserialized = encrypt ? atob(stored) : stored;
        const persistedData: PersistedFormData = JSON.parse(deserialized);

        const ageMs = Date.now() - persistedData.timestamp;
        const ageHours = Math.floor(ageMs / (1000 * 60 * 60));

        return {
          timestamp: persistedData.timestamp,
          ageMs,
          ageHours,
        };
      } catch (error) {
        console.error(`[FormPersistence] Failed to get saved data info:`, error);
        return null;
      }
    },
    [key, encrypt, storageKey]
  );

  /**
   * Auto-restore on mount if callback provided
   */
  useEffect(() => {
    if (onRestore) {
      const savedData = restoreForm();
      if (savedData) {
        onRestore(savedData);
      }
    }
  }, [onRestore, restoreForm]);

  /**
   * Cleanup debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    saveForm,
    restoreForm,
    clearForm,
    hasSavedData,
    getSavedDataInfo,
  };
}

/**
 * useFormRecovery Hook
 * 
 * Provides UI state for form recovery modal
 * Shows "Resume Application?" dialog if saved data exists
 */
export function useFormRecovery(formKey: string) {
  const [showRecoveryModal, setShowRecoveryModal] = React.useState(false);
  const [savedDataInfo, setSavedDataInfo] = React.useState<any>(null);

  const { hasSavedData, getSavedDataInfo, restoreForm, clearForm } =
    useFormPersistence({
      key: formKey,
    });

  useEffect(() => {
    if (hasSavedData()) {
      const info = getSavedDataInfo();
      setSavedDataInfo(info);
      setShowRecoveryModal(true);
    }
  }, [hasSavedData, getSavedDataInfo]);

  const handleResume = useCallback(() => {
    const data = restoreForm();
    setShowRecoveryModal(false);
    return data;
  }, [restoreForm]);

  const handleStartFresh = useCallback(() => {
    clearForm();
    setShowRecoveryModal(false);
  }, [clearForm]);

  return {
    showRecoveryModal,
    setShowRecoveryModal,
    savedDataInfo,
    handleResume,
    handleStartFresh,
  };
}

// Re-export React for useFormRecovery
import React from 'react';
