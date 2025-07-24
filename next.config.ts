import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ 빌드할 때 ESLint 무시
  }
} satisfies NextConfig;

export default nextConfig;
