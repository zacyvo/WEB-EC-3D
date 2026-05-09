/** @type {import('next').NextConfig} */
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'graph.facebook.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    turbo: {
      rules: codeInspectorPlugin({
        bundler: 'turbopack',
      }),
    },
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mui/system/useMediaQuery': new URL('./node_modules/@mui/system/useMediaQuery/useMediaQuery.js', import.meta.url).pathname,
      };
    }
    return config;
  },
};

export default nextConfig;
