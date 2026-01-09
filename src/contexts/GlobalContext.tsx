import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types
interface GlobalState {
  isLoading: boolean;
  error: string | null;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: Date;
  }>;
}

type GlobalAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' | 'warning' } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: GlobalState = {
  isLoading: false,
  error: null,
  notifications: [],
};

// Reducer function
const globalReducer = (state: GlobalState, action: GlobalAction): GlobalState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'ADD_NOTIFICATION':
      const id = Math.random().toString(36).substr(2, 9);
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id,
            message: action.payload.message,
            type: action.payload.type,
            timestamp: new Date(),
          },
        ],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    default:
      return state;
  }
};

// Context
interface GlobalContextType extends GlobalState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message, type } });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        setLoading,
        setError,
        clearError,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook
export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within GlobalProvider');
  }
  return context;
}