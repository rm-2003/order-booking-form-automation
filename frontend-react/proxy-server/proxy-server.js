const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.REACT_APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Proxy middleware for all routes except auth callback
app.use('/api', createProxyMiddleware({
  target: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyRes: (proxyRes, req, res) => {
    // Forward cookies from the backend
    const cookies = proxyRes.headers['set-cookie'];
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }
  }
}));

// Special handler for Google OAuth callback
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect('/login?error=no_code');
    }

    // Exchange code for token with backend
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/google/callback?code=${code}`
    );
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    // Get the token from the response
    const data = await response.json();
    
    // Set both access and refresh tokens in HTTP-only cookies
    res.cookie('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    if (data.refresh_token) {
      res.cookie('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    // Redirect to frontend
    res.redirect('/');
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 