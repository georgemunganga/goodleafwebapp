import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoanService from '@/services/LoanService';
import { Loan, LoanApplicationData } from '@/types';

interface LoanContextType {
  loans: Loan[];
  selectedLoan: Loan | null;
  isLoading: boolean;
  error: string | null;
  fetchLoans: () => Promise<Loan[]>;
  selectLoan: (loan: Loan) => void;
  clearSelectedLoan: () => void;
  createLoan: (loanData: LoanApplicationData) => Promise<Loan>;
  updateLoan: (id: string | number, loanData: Partial<Loan>) => Promise<Loan>;
  deleteLoan: (id: string | number) => Promise<void>;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

interface LoanProviderProps {
  children: ReactNode;
}

export function LoanProvider({ children }: LoanProviderProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    if (!isAuthenticated) {
      setLoans([]);
      setSelectedLoan(null);
      setError(null);
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      const loansData = await LoanService.getAllLoans();
      setLoans(loansData);
      return loansData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loans');
      console.error('Error fetching loans:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (isAuthenticated) {
      fetchLoans();
      return;
    }
    setLoans([]);
    setSelectedLoan(null);
    setError(null);
  }, [fetchLoans, isAuthenticated, isAuthLoading]);

  const selectLoan = useCallback((loan: Loan) => {
    setSelectedLoan(loan);
  }, []);

  const clearSelectedLoan = useCallback(() => {
    setSelectedLoan(null);
  }, []);

  const createLoan = useCallback(async (loanData: LoanApplicationData) => {
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }
    try {
      setIsLoading(true);
      setError(null);
      const newLoan = await LoanService.createLoan(loanData as any);
      setLoans(prevLoans => [...prevLoans, newLoan]);
      return newLoan;
    } catch (err: any) {
      setError(err.message || 'Failed to create loan');
      console.error('Error creating loan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updateLoan = useCallback(async (id: string | number, loanData: Partial<Loan>) => {
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }
    try {
      setIsLoading(true);
      setError(null);
      const updatedLoan = await LoanService.updateLoan(id.toString(), loanData);

      const normalizedId = id.toString();
      setLoans(prevLoans => prevLoans.map(loan =>
        loan.id.toString() === normalizedId ? { ...loan, ...updatedLoan } : loan
      ));
      setSelectedLoan(prevSelected =>
        prevSelected && prevSelected.id.toString() === normalizedId
          ? { ...prevSelected, ...updatedLoan }
          : prevSelected
      );
      return updatedLoan;
    } catch (err: any) {
      setError(err.message || 'Failed to update loan');
      console.error('Error updating loan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const deleteLoan = useCallback(async (id: string | number) => {
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }
    try {
      setIsLoading(true);
      setError(null);
      await LoanService.deleteLoan(id.toString());
      const normalizedId = id.toString();
      setLoans(prevLoans => prevLoans.filter(loan => loan.id.toString() !== normalizedId));
      setSelectedLoan(prevSelected =>
        prevSelected && prevSelected.id.toString() === normalizedId ? null : prevSelected
      );
    } catch (err: any) {
      setError(err.message || 'Failed to delete loan');
      console.error('Error deleting loan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    loans,
    selectedLoan,
    isLoading,
    error,
    fetchLoans,
    selectLoan,
    clearSelectedLoan,
    createLoan,
    updateLoan,
    deleteLoan
  }), [
    loans,
    selectedLoan,
    isLoading,
    error,
    fetchLoans,
    selectLoan,
    clearSelectedLoan,
    createLoan,
    updateLoan,
    deleteLoan
  ]);

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoans() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within LoanProvider');
  }
  return context;
}
