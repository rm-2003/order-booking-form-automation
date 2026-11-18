import { User } from '../types/auth';

class AuthService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

  async loginWithGoogle(): Promise<void> {
    // Redirect to Google auth through backend
    window.location.href = `${this.baseUrl}/auth/google`;
  }

  async loginWithMicrosoft(): Promise<void> {
    // Redirect to Microsoft auth through backend
    window.location.href = `${this.baseUrl}/auth/microsoft`;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login';
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    // We can't check the HTTP-only cookie directly
    // The backend will handle this via the cookie
    return true;
  }
}

export const authService = new AuthService(); 