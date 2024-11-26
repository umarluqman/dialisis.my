// import { CookieBanner } from "@/components/CookieBanner";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { OnlineStatusHandler } from "@/components/online-status";
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://dialisis.my"),
  title: {
    default: "Dialisis MY | Cari Pusat Dialisis di Malaysia",
    template: "%s | Dialisis MY",
  },
  description:
    "Cari lebih daripada 900 pusat dialisis di seluruh Malaysia. Maklumat lengkap tentang lokasi, info kontak, doktor bertugas, sektor, dan perkhidmatan dialisis.",
  keywords: [
    "dialisis malaysia",
    "dialysis malaysia",
    "pusat dialisis",
    "hemodialisis",
    "hemodialysis",
    "rawatan buah pinggang",
    "kidney treatment malaysia",
  ],
  authors: [{ name: "Dialisis MY" }],
  creator: "Dialisis MY",
  publisher: "Dialisis MY",
  openGraph: {
    type: "website",
    locale: "ms_MY",
    title: "Dialisis MY | Cari Pusat Dialisis Malaysia",
    description:
      "Cari lebih daripada 900 pusat dialisis di seluruh Malaysia. Maklumat lengkap tentang lokasi, info kontak, doktor bertugas, sektor, dan perkhidmatan dialisis.",
    siteName: "Dialisis MY",
    images: [
      {
        url: "/og-image.png",
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

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
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
        <meta name="apple-mobile-web-app-title" content="Dialisis MY" />
        <meta name="application-name" content="Dialisis MY" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dialisis MY" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col"
          // fontSans.variable
        )}
      >
        <OnlineStatusHandler />
        <NuqsAdapter>
          <Navbar />

          <main className="flex-grow">{children}</main>
          {/* <footer className="bg-primary text-primary-foreground py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <p>&copy; 2024 Dialisis Malaysia. All rights reserved.</p>
            <nav className="flex gap-4">
              <Link href="#" className="hover:underline" prefetch={false}>
                Polisi Privasi
              </Link>
            </nav>
          </div>
        </footer> */}
          <Footer />
          {/* <CookieBanner /> */}
        </NuqsAdapter>
      </body>
    </html>
  );
}
