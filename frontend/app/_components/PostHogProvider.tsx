"use client";

import { PostHogProvider as Provider } from "posthog-js/react";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: false,
      session_recording: { maskInputOptions: { password: true } },
    });

    const handleRouteChange = () => {
      posthog.capture("$pageview");
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return <Provider client={posthog}>{children}</Provider>;
}
