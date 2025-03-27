import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    domains: [
      'go4it-assets.fra1.digitaloceanspaces.com',
      'go4it-assets.fra1.cdn.digitaloceanspaces.com',
    ],
  },
};

export default nextConfig;
