import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { NextPathsMeta } from "@/components/next-paths-meta";
import { OnlineStatusHandler } from "@/components/online-status";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { notFound } from "next/navigation";

import "../globals.css";

const KEYWORDS = [
  "dialisis malaysia",
  "dialysis malaysia",
  "pusat dialisis",
  "hemodialisis",
  "hemodialysis",
  "rawatan buah pinggang",
  "kidney treatment malaysia",
  "pusat hemodialisis",
  "pusat rawatan dialisis",
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "layout" });
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";

  return {
    metadataBase: new URL("https://dialisis.my"),
    title: {
      default: t("titleDefault"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: KEYWORDS,
    authors: [{ name: t("siteName") }],
    creator: t("siteName"),
    publisher: t("siteName"),
    openGraph: {
      type: "website",
      locale: ogLocale,
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://dialisis.my",
      siteName: t("siteName"),
      images: [
        {
          url: "https://dialisis.my/og-image.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages();

  // Validate locale
  if (!["ms", "en"].includes(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
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
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/site.webmanifest" />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col"
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OnlineStatusHandler />
          <NuqsAdapter>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6347723914725237"
        crossOrigin="anonymous"
      ></script>
    </html>
  );
}






