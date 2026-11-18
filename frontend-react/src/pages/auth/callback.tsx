import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get('token');
        console.log('Auth token:', token); // Debug log
        if (!token) {
          throw new Error('No authentication token received');
        }

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Get user data using the token
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to get user data');
        }

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          navigate('/');
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [setUser, navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing login...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 