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
  rewrites: async () => {
    return [
      {
        source: "/ingest/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"
        }/:path*`,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
