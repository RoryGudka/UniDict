import "@/_styles/globals.css";

import AmplifyConfigure from "@/_components/AmplifyConfigure";
import type { Metadata } from "next";
import Providers from "@/_components/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: `Uni-Dictionary`,
  description: `Uni-Dictionary is an AI powered universal dictionary for learning foreign languages`,
  keywords: [
    "dictionary",
    "language learning",
    "AI dictionary",
    "translation",
    "foreign languages",
  ],
  authors: [{ name: "Rory Gudka" }],
  metadataBase: new URL("https://www.uni-dictionary.com"),
  openGraph: {
    title: "Uni-Dictionary",
    description:
      "Uni-Dictionary is an AI powered universal dictionary for learning foreign languages",
    type: "website",
    locale: "en_US",
    siteName: "Uni-Dictionary",
    url: "https://www.uni-dictionary.com",
    images: [{ url: "https://www.uni-dictionary.com/icons/icon-512x512.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uni-Dictionary",
    description:
      "Uni-Dictionary is an AI powered universal dictionary for learning foreign languages",
    creator: "@rorygudka",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ZUssnfvapIAQTutkCM1WIlwnNVMWHSkUs3Lwwa8azaA",
    yandex: "6012121a1d4c0ecc",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-512x512.png",
    shortcut: "/icons/icon-512x512.png",
  },
  themeColor: "#2563eb",
  applicationName: "Uni-Dictionary",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "education",
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
