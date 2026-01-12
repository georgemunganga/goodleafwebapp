import React, { createContext, useContext } from 'react';

/**
 * Currency Context
 * Provides centralized money formatting and locale rules
 * Ensures consistent money display across the app
 */

interface CurrencyContextType {
  currency: string;
  locale: string;
  formatMoney: (amount: number, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (value: number) => string;
  formatDate: (date: Date | string) => string;
  parseAmount: (value: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Zambian Kwacha settings
  const currency = 'ZMW';
  const locale = 'en-ZM';

  const formatMoney = (amount: number, options?: Intl.NumberFormatOptions) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting money:', error);
      return `K${amount.toFixed(2)}`;
    }
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  };

  const parseAmount = (value: string): number => {
    // Remove currency symbol and spaces, then parse
    const cleaned = value.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const value: CurrencyContextType = {
    currency,
    locale,
    formatMoney,
    formatPercent,
    formatDate,
    parseAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
