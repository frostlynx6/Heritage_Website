import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Turbopack to leave Prisma alone and use the correct native Node version!
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;