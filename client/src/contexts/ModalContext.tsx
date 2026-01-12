import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Modal Types
 */
export type ModalType = 'confirm' | 'alert' | 'terms' | 'custom';

export interface ModalConfig {
  id: string;
  type: ModalType;
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // For destructive actions
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  children?: ReactNode;
}

export interface ModalContextType {
  // Modal management
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Convenience methods
  confirm: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  }) => string;
  
  alert: (config: {
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
  }) => string;
  
  terms: (config: {
    title: string;
    content: ReactNode;
    confirmText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  }) => string;
  
  // State
  modals: ModalConfig[];
}

/**
 * Modal Context
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Modal Provider Component
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>) => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    const newModal: ModalConfig = { ...config, id };
    setModals((prev) => [...prev, newModal]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const confirm = useCallback(
    (config: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      isDangerous?: boolean;
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
    }) => {
      return openModal({
        type: 'confirm',
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || 'Confirm',
        cancelText: config.cancelText || 'Cancel',
        isDangerous: config.isDangerous,
        onConfirm: config.onConfirm,
        onCancel: config.onCancel,
      });
    },
    [openModal]
  );

  const alert = useCallback(
    (config: {
      title: string;
      message: string;
      confirmText?: string;
      onConfirm?: () => void;
    }) => {
      return openModal({
        type: 'alert',
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || 'OK',
        onConfirm: config.onConfirm,
      });
    },
    [openModal]
  );

  const terms = useCallback(
    (config: {
      title: string;
      content: ReactNode;
      confirmText?: string;
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
    }) => {
      return openModal({
        type: 'terms',
        title: config.title,
        content: config.content,
        confirmText: config.confirmText || 'I Agree',
        cancelText: 'Decline',
        onConfirm: config.onConfirm,
        onCancel: config.onCancel,
      });
    },
    [openModal]
  );

  const value: ModalContextType = {
    openModal,
    closeModal,
    closeAllModals,
    confirm,
    alert,
    terms,
    modals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Hook to use Modal context
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
