'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
// import { FcGoogle } from 'react-icons/fc';
import { GoogleLogo } from '@phosphor-icons/react'

export default function LoginPage() {
  const router = useRouter();
  const { loading } = useAuth();

  const handleGoogleLogin = () => {
    // Clear any existing token
    localStorage.removeItem('token');
    // Redirect to Google auth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleSSOLogin = () => {
    // Clear any existing token
    localStorage.removeItem('token');
    // Redirect to SSO
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/sso`;
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <Image src="/overlay.jpg" alt="Login Background" fill className="absolute inset-0 object-cover opacity-25" />
      <Card className="w-full max-w-md z-50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to OBF Automation</CardTitle>
          <p className="text-center text-muted-foreground">
            Please sign in to continue
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-5">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-[#d5233b] hover:bg-[#d5233b]/90 hover:text-white text-white"
              onClick={handleSSOLogin}
            >
              Sign in with MLL SSO
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <GoogleLogo className="h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 