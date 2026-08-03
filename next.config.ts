import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize image delivery
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },

  // Tree-shake heavy icon/animation libraries — reduces JS bundle by ~30-40%
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@react-three/fiber",
      "@react-three/drei",
      "canvas-confetti",
    ],
  },
  turbopack: {},

  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^node:/,
      })
    );
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;

