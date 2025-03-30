/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    fontLoaders: [
      { 
        loader: '@next/font/google', 
        options: { 
          subsets: ['latin'], 
          timeout: 10000,
          display: 'swap'
        } 
      },
    ],
  },
};

module.exports = nextConfig;