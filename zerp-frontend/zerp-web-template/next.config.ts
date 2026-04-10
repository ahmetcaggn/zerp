import type { NextConfig } from 'next'

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || 'http://gateway:8080'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: `${INTERNAL_API_URL}/ws/:path*`,
      },
    ]
  },
}

export default nextConfig
