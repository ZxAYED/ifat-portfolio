import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { indexingEnabled, siteOrigin } from "@/lib/indexing";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

export const viewport: Viewport = { themeColor: "#f8f7f4" };
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: profile.title, template: "%s — Ifat Ibrahim" },
  description: profile.description,
  alternates: { canonical: "/" },
  robots: { index: indexingEnabled(), follow: indexingEnabled() },
  icons: {
    icon: [{ url: "/assets/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    title: profile.title,
    description: profile.description,
    siteName: profile.name,
    url: "/",
    images: [
      {
        url: "/assets/ifat-social.png",
        width: 1200,
        height: 630,
        alt: "ifat. Graphic design. A clear point of view.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.title,
    description: profile.description,
    images: ["/assets/ifat-social.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-motion-mode="full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=document.documentElement;h.dataset.theme='light';try{if(localStorage.getItem('portfolio-theme')==='dark')h.dataset.theme='dark';}catch(e){}h.dataset.motionMode=matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full';})();`,
          }}
        />
        <link
          rel="preload"
          href="/assets/fonts/studio-sans-regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/studio-sans-bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/studio-serif-italic.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <noscript>
          <link rel="stylesheet" href="/no-script.css" />
        </noscript>
      </head>
      <body>
        <MotionProvider>
          <div id="portfolio-root">{children}</div>
        </MotionProvider>
      </body>
    </html>
  );
}
