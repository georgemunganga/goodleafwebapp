// services/UserService.ts
import { authAPI, userAPI } from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/types';

class UserService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await authAPI.login(credentials);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ user: User }> {
    try {
      const response = await authAPI.register(userData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      return {
        user: response.data.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await authAPI.logout();
      // Clear local storage handled by interceptor
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API fails
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await userAPI.getProfile();
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await userAPI.updateProfile(profileData);
      return response.data.user ?? response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }
}

export default new UserService();
