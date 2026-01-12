import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const toastService = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      action: options?.action,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 3000,
      action: options?.action,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 3000,
      action: options?.action,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

// Error message mapping for common API errors
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.status === 401) {
    return 'Session expired. Please log in again.';
  }

  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error?.response?.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error?.response?.status === 409) {
    return 'This resource already exists or there is a conflict.';
  }

  if (error?.response?.status === 422) {
    return 'Please check your input and try again.';
  }

  if (error?.response?.status === 429) {
    return 'Too many requests. Please try again later.';
  }

  if (error?.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (error?.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }

  if (error?.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  return error?.message || 'An error occurred. Please try again.';
};
