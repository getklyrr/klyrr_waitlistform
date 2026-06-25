import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Correct configuration block nesting for cross-origin or local network routing permissions
      allowedOrigins: ["localhost:3000", "192.168.31.104:3000"],
    },
  },
};

export default nextConfig;
