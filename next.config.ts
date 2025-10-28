import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2j4rroqpw9llb.cloudfront.net",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
