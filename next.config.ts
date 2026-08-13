import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'verses.quran.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'api.quran.com' },
    ],
  },
  experimental: {},
  // Add an empty turbopack configuration to silence the Next.js 16 error
  // since we disabled Serwist in development mode anyway.
  turbopack: {}
};

export default withSerwist(nextConfig);
