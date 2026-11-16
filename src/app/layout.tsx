import type { Metadata } from "next";
import { site } from "@/data/site";
import { BootScreen } from "@/components/boot-screen";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.siteUrl),
  title: "Sourasis Karak — machine learning, with evidence",
  description:
    "Computer science undergraduate in Kolkata building machine learning systems, scientific agents, and evaluation tools. Build it. Question it. Make it worth trusting.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Sourasis Karak — The Evidence Trail",
    description: site.tagline,
    url: "/",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

// Keep in sync with ThemeToggle: localStorage key 'sk-theme' -> data-theme.
const themeScript = `(function(){try{var t=localStorage.getItem('sk-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`.copy-email,.icon-button,.clock{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <BootScreen />
        {children}
      </body>
    </html>
  );
}
