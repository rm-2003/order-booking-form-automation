'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  provider: 'local' | 'google' | 'microsoft';
  providerId?: string;
  picture?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        // If rate limited, wait with exponential backoff
        const waitTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Max retries reached');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchWithRetry(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        } else {
          // If unauthorized or other error, clear token
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        if (mounted) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchWithRetry(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 