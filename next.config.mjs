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
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false,
  },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  webpack: (config) => {
    config.output.hashFunction = 'xxhash64'; // Use a modern hash function
    return config;
  },
};

export default nextConfig;