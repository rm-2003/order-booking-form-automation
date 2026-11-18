'use client';

import { useRouter } from 'next/navigation';
import { User } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const SSO_CLIENT_ID = process.env.NEXT_PUBLIC_SSO_CLIENT_ID;
const SSO_SERVER_URL = process.env.NEXT_PUBLIC_SSO_SERVER_URL;

if (!SSO_CLIENT_ID || !SSO_SERVER_URL) {
  throw new Error('SSO environment variables are not configured');
}

export function useAuth() {
  const router = useRouter();

  const login = () => {
    window.location.href = `${SSO_SERVER_URL}/sso/login?client_id=${SSO_CLIENT_ID}`;
  };

  const logout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      // Clear token from cookies
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const token = getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  };

  const isAuthenticated = (): boolean => {
    return !!getToken();
  };

  const getToken = (): string | null => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
  };
} 