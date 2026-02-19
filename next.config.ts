import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-8778d571e3c5483cf5a0fed27a70cb48.r2.dev',
      },
    ],
  },
};

export default nextConfig;
