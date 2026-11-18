'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.push('/login?error=no_token');
      return;
    }

    // Store token in localStorage
    localStorage.setItem('token', token);

    // Fetch user data using the token
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get user data');
      }
      return res.json();
    })
    .then(data => {
      if (data.user) {
        setUser(data.user);
        router.push('/');
      } else {
        throw new Error('No user data received');
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      router.push('/login?error=auth_failed');
    });
  }, [router, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing login...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 