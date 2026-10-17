import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.43.40"],
  // Bisa diarahkan ke folder lain lewat env, supaya server dev dan build
  // tidak berebut folder .next yang sama saat dikerjakan bersamaan.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
