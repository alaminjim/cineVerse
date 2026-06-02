import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.alphacoders.com",
      },
    ],
  },
  // Ensure Tailwind CSS is properly loaded
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
