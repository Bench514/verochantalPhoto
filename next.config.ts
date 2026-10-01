import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 for grid/hero thumbnails; 85 for the full-screen lightbox, where
    // re-encoding artifacts are actually visible.
    qualities: [75, 85],
  },
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
