import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface NetworkContextType {
  isLoading: boolean;
  isOffline: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setError(null);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setError('No internet connection. Please check your network.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    if (!navigator.onLine) {
      setIsOffline(true);
      setError('No internet connection. Please check your network.');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearError = () => setError(null);

  return (
    <NetworkContext.Provider
      value={{
        isLoading,
        isOffline,
        error,
        setLoading: setIsLoading,
        setError,
        clearError,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}
