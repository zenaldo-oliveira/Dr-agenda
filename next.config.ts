import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/deshboard",
        destination: "/dashboard",
        permanent: false, // usar false para permitir mudanças no futuro
      },
    ];
  },
};

export default nextConfig;
