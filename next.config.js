/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Supabase requires these settings
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },

  // Environment variables that are public (safe to expose)
  publicRuntimeConfig: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  },

  // API configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    }
  },

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      }
    ];
  },

  // Custom headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
