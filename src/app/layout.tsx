import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";
import { BootScreen } from "@/components/boot-screen";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sourasis Karak — Build it. Question it. Make it worth trusting.",
      },
    ],
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
      <body className={`${serif.variable} ${mono.variable}`}>
        <BootScreen />
        {children}
      </body>
    </html>
  );
}
