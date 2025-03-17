import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/define",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
