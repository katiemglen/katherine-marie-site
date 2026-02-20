import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-5b1b8645ad1d4a73b3f1ce9c53f6aa22.r2.dev',
      },
    ],
  },
};

export default nextConfig;
