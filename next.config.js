/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ 빌드할 때 ESLint 무시
  }
};

module.exports = nextConfig;
