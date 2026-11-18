'use client';

import { User } from '../types/auth';
import { useRouter } from 'next/navigation';

class AuthService {
  private baseUrl = '/api/auth';

  async loginWithGoogle(): Promise<void> {
    const router = useRouter();
    router.push(`${this.baseUrl}/google`);
  }

  async loginWithMicrosoft(): Promise<void> {
    const router = useRouter();
    router.push(`${this.baseUrl}/microsoft`);
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return document.cookie.includes('token=');
  }
}

export const authService = new AuthService(); 