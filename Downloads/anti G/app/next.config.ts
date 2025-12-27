import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-expect-error - optimization property exists but types are strict
  optimizeFonts: false,
};

export default nextConfig;
