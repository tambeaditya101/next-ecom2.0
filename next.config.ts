import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   domains: ['images.unsplash.com'], // 👈 allow external host
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
