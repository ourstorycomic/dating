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
};

export default nextConfig;

