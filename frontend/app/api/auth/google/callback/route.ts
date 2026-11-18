import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    // Create the response with redirect
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    
    // Set the token in an HTTP-only cookie
    redirectResponse.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return redirectResponse;
  } catch (error) {
    console.error('Google auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
} 