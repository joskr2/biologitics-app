import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  compiler: {
    reactCompiler: true, 
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
