import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:3001/api', // Backend runs on port 3001
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - maybe redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (credentials: { email?: string; phone?: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', userData),
  logout: () =>
    api.post('/auth/logout'),
  getCurrentUser: () =>
    api.get('/auth/me'),
};

export const loanAPI = {
  getLoans: () => 
    api.get('/loans'),
  getLoanById: (id: string) => 
    api.get(`/loans/${id}`),
  getLoanSchedule: (id: string) =>
    api.get(`/loans/${id}/schedule`),
  createLoan: (loanData: any) => 
    api.post('/loans', loanData),
  updateLoan: (id: string, loanData: any) => 
    api.put(`/loans/${id}`, loanData),
  deleteLoan: (id: string) => 
    api.delete(`/loans/${id}`),
  submitRepayment: (loanId: string | number, repaymentData: any) => 
    api.post(`/repayments`, { loanId, ...repaymentData }),
};

export const userAPI = {
  getProfile: () => 
    api.get('/users/profile'),
  updateProfile: (profileData: any) => 
    api.put('/users/profile', profileData),
};

export const eligibilityAPI = {
  checkEligibility: (eligibilityData: any) => 
    api.post('/eligibility/check', eligibilityData),
  calculateTerms: (termsData: any) =>
    api.post('/eligibility/terms', termsData),
};

export const kycAPI = {
  submitKYC: (kycData: any) => 
    api.post('/kyc', kycData),
  getKYCStatus: () => 
    api.get('/kyc/status'),
};

export const repaymentAPI = {
  getRepayments: () =>
    api.get('/repayments'),
  getBankDetails: () =>
    api.get('/repayments/bank-details'),
  submitRepayment: (loanId: string | number, repaymentData: any) =>
    api.post('/repayments', { loanId, ...repaymentData }),
};
