/**
 * Centralized API Configuration
 * Provides a single source of truth for API configuration
 */

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://admin.goodleafcapital.com/api/v1';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Create a base API configuration object
const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

type ApiErrorPayload = {
  code: string;
  message: string;
  status: number;
  details?: unknown;
};

const parseErrorResponse = async (response: Response): Promise<ApiErrorPayload> => {
  const contentType = response.headers.get('content-type') || '';
  let errorData: any = null;

  if (contentType.includes('application/json')) {
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
  } else {
    try {
      const text = await response.text();
      errorData = text ? { message: text } : null;
    } catch {
      errorData = null;
    }
  }

  return {
    code: errorData?.code || 'API_ERROR',
    message: errorData?.message || response.statusText || 'Request failed',
    status: response.status,
    details: errorData?.details ?? errorData?.errors ?? undefined,
  };
};

const handleNetworkError = (error: unknown): ApiErrorPayload => {
  return {
    code: 'NETWORK_ERROR',
    message: 'Network error. Check your internet connection and try again.',
    status: 0,
    details: error,
  };
};

/**
 * Generic API call function with centralized configuration
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const headers: Record<string, string> = {
    ...apiConfig.headers,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    throw handleNetworkError(error);
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return response.json();
}

/**
 * API call function for form data (multipart/form-data)
 */
async function apiCallFormData<T>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Don't set Content-Type header for FormData - browser will set it with boundary
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      ...options,
      headers,
      body: formData,
    });
  } catch (error) {
    throw handleNetworkError(error);
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return response.json();
}

export { apiConfig, apiCall, apiCallFormData };
