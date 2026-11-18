import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, fetchWithRetry } from '../config/api';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          `${API_URL}/auth/me`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          console.log('User after /me:', data.user);
          if (data.user) {
            setUser(data.user);
          } else {
            setUser(null);
            localStorage.removeItem('token');
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
          `${API_URL}/auth/logout`,
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
      window.location.href = '/login';
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