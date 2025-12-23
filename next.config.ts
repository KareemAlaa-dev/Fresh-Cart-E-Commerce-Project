import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance Optimizations */
  
  // Optimize images with modern formats
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react", 
      "date-fns", 
      "framer-motion",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "react-icons"
    ],
    // Optimize CSS for smaller bundles
    optimizeCss: true,
  },
  
  // Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { 
      exclude: ["error", "warn"] 
    } : false,
    // Remove React properties in production
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Ignore build errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
