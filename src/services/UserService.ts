// services/UserService.ts
import { authService, userService } from '@/lib/api-service';
import { User, LoginCredentials, RegisterData } from '@/types';

class UserService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await authService.login(credentials);

      return {
        user: {
          ...response.user,
          name: response.user.name || `${response.user.firstName} ${response.user.lastName}`
        },
        token: response.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<{ user: User }> {
    try {
      const response = await authService.register(userData);

      return {
        user: {
          ...response.user,
          name: response.user.name || `${response.user.firstName} ${response.user.lastName}`
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      authService.logout();
      // Clear local storage handled by interceptor
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API fails
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await userService.getProfile();
      return {
        ...response,
        name: response.name || `${response.firstName} ${response.lastName}`
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await userService.updateProfile(profileData);
      const userData = response.user ?? response;
      return {
        ...userData,
        name: userData.name || `${userData.firstName} ${userData.lastName}`
      };
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }
}

export default new UserService();
