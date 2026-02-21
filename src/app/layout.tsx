import Footer from "@/components/footer";
import { GaEventTracker } from "@/components/ga-event-tracker";
import { Navbar } from "@/components/navbar";
import { NextPathsMeta } from "@/components/next-paths-meta";
import { OnlineStatusHandler } from "@/components/online-status";
import { jsonLdGlobal } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dialisis.my"),
  title: {
    default: "Cari Pusat Dialisis Berdekatan Dengan Mudah",
    template: "%s | Dialisis MY",
  },
  description:
    "Dapatkan maklumat lengkap tentang pusat dialisis di Malaysia mengikut negeri, bandar, dan jenis rawatan dengan mudah.",
  keywords: [
    "dialisis malaysia",
    "dialysis malaysia",
    "pusat dialisis",
    "hemodialisis",
    "hemodialysis",
    "rawatan buah pinggang",
    "kidney treatment malaysia",
    "pusat hemodialisis",
    "pusat rawatan dialisis",
  ],
  authors: [{ name: "Dialisis MY" }],
  creator: "Dialisis MY",
  publisher: "Dialisis MY",
  openGraph: {
    type: "website",
    locale: "ms_MY",
    title: "Dialisis MY | Cari Pusat Dialisis Malaysia | Direktori Lengkap",
    description:
      "Direktori lengkap dengan lebih 900 pusat dialisis di seluruh Malaysia. Maklumat tentang lokasi, kontak, doktor, sektor, dan perkhidmatan dialisis.",
    url: "https://dialisis.my",
    siteName: "Dialisis MY",
    images: [
      {
        url: "https://dialisis.my/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dialisis MY - Cari Pusat Dialisis Malaysia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dialisis MY | Cari Pusat Dialisis Malaysia",
    description: "Cari lebih daripada 900 pusat dialisis di seluruh Malaysia.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <head>
        <NextPathsMeta />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-6347723914725237"
        ></meta>
        <meta name="apple-mobile-web-app-title" content="Dialisis MY" />
        <meta name="application-name" content="Dialisis MY" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dialisis MY" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FDFBF7" />
        <meta name="theme-color" content="#FDFBF7" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col"
        )}
      >
        <GaEventTracker />
        <OnlineStatusHandler />
        <NuqsAdapter>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NuqsAdapter>
      </body>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6347723914725237"
        crossOrigin="anonymous"
      ></script>
    </html>
  );
}
