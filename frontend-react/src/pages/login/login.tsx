import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { GoogleLogo } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleSSOLogin = () => {
    authService.loginWithMicrosoft();
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const error = searchParams.get('error');

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <img src="/overlay.jpg" alt="Login Background" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <Card className="w-full max-w-md z-50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to OBF Automation</CardTitle>
          <p className="text-center text-muted-foreground">
            Please sign in to continue
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error === 'no_token' && 'Authentication failed: No token received'}
              {error === 'auth_failed' && 'Authentication failed: Please try again'}
            </div>
          )}
          <div className="space-y-4">
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