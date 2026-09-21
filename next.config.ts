import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Server actions default to a 1MB body limit — the photo upload form
    // submits several full-resolution JPEGs (session photos, portfolio
    // uploads) in a single multipart request, well past that default.
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
