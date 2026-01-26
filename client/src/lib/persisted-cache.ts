/**
 * Persisted Cache Utilities
 * Lightweight localStorage-backed cache for query hydration.
 */

export type PersistedCacheEntry<T> = {
  data: T;
  updatedAt: number;
};

const CACHE_PREFIX = 'goodleaf:cache';

const normalizePart = (part: string | number | null | undefined) => {
  if (part === null || part === undefined) return '';
  if (typeof part === 'string') {
    const trimmed = part.trim();
    return trimmed.length > 0 ? trimmed : '';
  }
  return String(part);
};

export const buildCacheKey = (
  namespace: string,
  parts: Array<string | number | null | undefined> = [],
) => {
  const normalizedNamespace = normalizePart(namespace) || 'global';
  const normalizedParts = parts.map(normalizePart).filter((part) => part.length > 0);
  return [CACHE_PREFIX, normalizedNamespace, ...normalizedParts].join(':');
};

export const readPersistedCache = <T>(key: string): PersistedCacheEntry<T> | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedCacheEntry<T>;
    if (typeof parsed?.updatedAt !== 'number') return null;
    return parsed;
  } catch (error) {
    console.warn('Failed to read persisted cache', error);
    return null;
  }
};

export const writePersistedCache = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        data,
        updatedAt: Date.now(),
      }),
    );
  } catch (error) {
    console.warn('Failed to write persisted cache', error);
  }
};

export const removePersistedCache = (key: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove persisted cache', error);
  }
};
