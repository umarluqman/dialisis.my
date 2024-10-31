import { CookieBanner } from "@/components/CookieBanner";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Dialisis Malaysia",
  description: "Cari pusat dialisis yang berdekatan dengan anda",
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
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col"
          // fontSans.variable
        )}
      >
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
        <CookieBanner />
      </body>
    </html>
  );
}
