import { CookieBanner } from "@/components/CookieBanner";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import FilterLayout from "@/components/filter-layout";
import { cn } from "@/lib/utils";
import Link from "next/link";
// FIXME: change this
export const metadata = {
  title: "pSEO next template",
  description: "A template for programmatic SEO",
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
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontSans.variable
        )}
      >
        <header className="bg-primary text-primary-foreground py-4 px-6">
          <div className="container mx-auto flex justify-end items-center">
            <nav className="flex gap-4">
              <Link href="#" className="hover:underline" prefetch={false}>
                Home
              </Link>
              <Link href="#" className="hover:underline" prefetch={false}>
                About
              </Link>
              <Link href="#" className="hover:underline" prefetch={false}>
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <FilterLayout params={{ state: "", district: "" }}>
            {children}
          </FilterLayout>
        </main>
        <footer className="bg-primary text-primary-foreground py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <p>&copy; 2024 Dialisis Malaysia. All rights reserved.</p>
            <nav className="flex gap-4">
              <Link href="#" className="hover:underline" prefetch={false}>
                Polisi Privasi
              </Link>
            </nav>
          </div>
        </footer>
        <CookieBanner />
      </body>
    </html>
  );
}
