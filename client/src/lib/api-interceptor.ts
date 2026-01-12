import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { toastService, getErrorMessage } from './toast-service';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RetryConfig {
  retryCount: number;
}

export function createApiInterceptor(instance: AxiosInstance) {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add token to headers if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracking
      config.headers['X-Request-ID'] = generateRequestId();

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as any;
      const retryConfig = config as RetryConfig & any;

      // Initialize retry count
      if (!retryConfig.retryCount) {
        retryConfig.retryCount = 0;
      }

      // Handle 401 Unauthorized - Token expired
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Retry logic for network errors and 5xx errors
      const shouldRetry =
        !error.response || // Network error
        (error.response.status >= 500 && error.response.status < 600) || // Server error
        error.code === 'ECONNABORTED'; // Timeout

      if (shouldRetry && retryConfig.retryCount < MAX_RETRIES) {
        retryConfig.retryCount += 1;

        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, retryConfig.retryCount - 1);

        await new Promise((resolve) => setTimeout(resolve, delay));

        return instance(config);
      }

      // Show error toast
      const errorMessage = getErrorMessage(error);
      toastService.error(errorMessage);

      return Promise.reject(error);
    }
  );
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
