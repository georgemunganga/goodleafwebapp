// hooks/useAuth.ts
import { useAuth } from '@/contexts/AuthContext';
import { useApiCall } from './useApiCall';
import UserService from '@/services/UserService';
import { LoginCredentials, RegisterData } from '@/types';

export function useAuthOperations() {
  const { login: contextLogin, register: contextRegister, logout: contextLogout } = useAuth();
  const loginCall = useApiCall();
  const registerCall = useApiCall();
  const profileCall = useApiCall();

  const login = async (credentials: LoginCredentials) => {
    return loginCall.execute(async () => {
      const result = await UserService.login(credentials);
      // Update context after successful login
      await contextLogin(credentials);
      return result;
    });
  };

  const register = async (userData: RegisterData) => {
    return registerCall.execute(async () => {
      const result = await UserService.register(userData);
      // Auto-login after registration
      await contextLogin({ email: userData.email, phone: userData.phone, password: userData.password });
      return result;
    });
  };

  const logout = async () => {
    try {
      await UserService.logout();
      contextLogout();
    } catch (error) {
      console.error('Logout error:', error);
      contextLogout();
    }
  };

  const fetchProfile = async () => {
    return profileCall.execute(async () => {
      return await UserService.getCurrentUser();
    });
  };

  return {
    login: login,
    register: register,
    logout: logout,
    fetchProfile: fetchProfile,
    ...loginCall,
    ...registerCall,
    ...profileCall
  };
}
