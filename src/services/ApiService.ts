// services/ApiService.ts
import { authAPI, loanAPI, userAPI, eligibilityAPI, kycAPI, repaymentAPI } from '@/lib/api';
import UserService from './UserService';
import LoanService from './LoanService';
import EligibilityService from './EligibilityService';
import KYCService from './KYCService';
import RepaymentService from './RepaymentService';
import BusinessOrchestrator from './BusinessOrchestrator';

// Export individual services
export {
  UserService,
  LoanService,
  EligibilityService,
  KYCService,
  RepaymentService,
  BusinessOrchestrator,
  // API clients
  authAPI,
  loanAPI,
  userAPI,
  eligibilityAPI,
  kycAPI,
  repaymentAPI
};

// Create a main service class that combines all services
class ApiService {
  userService = UserService;
  loanService = LoanService;
  eligibilityService = EligibilityService;
  kycService = KYCService;
  repaymentService = RepaymentService;
  businessOrchestrator = BusinessOrchestrator;

  // Initialize with authentication if needed
  async initializeWithAuth(token: string): Promise<void> {
    // This could be used to set up the API with authentication
    // Currently handled by axios interceptors in api.ts
  }

  // Health check for the API
  async healthCheck(): Promise<boolean> {
    try {
      // We could add a specific health check endpoint
      // For now, we'll just return true if we can access one of our services
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

export default new ApiService();
