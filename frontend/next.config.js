/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... any existing configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*', // Backend runs on port 4000
      },
    ];
  },
}

module.exports = nextConfig 