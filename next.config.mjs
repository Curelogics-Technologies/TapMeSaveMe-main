/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true, // Better for localhost development
  },
  experimental: {
    optimizeCss: false, // Faster builds on localhost
  },
  // Better localhost performance
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
}

export default nextConfig
