import { CookieBanner } from "@/components/CookieBanner";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col"
          // fontSans.variable
        )}
      >
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
