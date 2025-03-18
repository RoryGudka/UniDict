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
    // Initialize PostHog
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: false, // We'll manually capture pageviews
      session_recording: {
        enabled: true,
        maskAllInputs: true,
        maskInputOptions: { password: true },
      },
    });

    // Capture pageview on route change
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
