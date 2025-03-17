import "@/_styles/globals.css";

import AmplifyConfigure from "@/_components/AmplifyConfigure";
import type { Metadata } from "next";
import Providers from "@/_components/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: `Uni-Dictionary`,
  description: `Uni-Dictionary is an AI powered universal dictionary tool for learning foreign languages`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Only configure google analytics for production */}
        {process.env.GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AmplifyConfigure />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
