"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md py-3 px-4 md:py-4 md:px-20 border-b border-border/50">
      <div className="container px-0">
        {/* Desktop View */}
        <div className="hidden items-center justify-between md:flex">
          <div className="flex items-center space-x-8">
            <Link className="flex items-center" href="/">
              <div className="flex space-x-3 items-center">
                <Logo />
                <span className="sr-only">Dialisis Malaysia</span>
                <div className="font-display text-lg font-semibold tracking-tight text-foreground">
                  Dialisis Malaysia
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-1">
              <Link className="flex items-center" href="/peta">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Lihat Peta</span>
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  <span className="text-sm font-medium">Blog</span>
                </Button>
              </Link>
              <Link href="/hubungi-kami">
                <Button variant="ghost" size="sm">
                  <span className="text-sm font-medium">Hubungi Kami</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex items-center justify-between md:hidden">
          <Link className="flex items-center" href="/">
            <div className="flex space-x-3 items-center">
              <Logo />
              <span className="sr-only">Dialisis Malaysia</span>
              <div className="font-display text-base font-semibold tracking-tight text-foreground">
                Dialisis Malaysia
              </div>
            </div>
          </Link>
          <div className="flex items-center space-x-1">
            <Link href="/peta">
              <Button variant="outline" size="sm" className="h-11 px-4">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Peta</span>
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="h-11 px-4">
                <span className="text-sm font-medium">Blog</span>
              </Button>
            </Link>
            <Link href="/hubungi-kami">
              <Button variant="ghost" size="sm" className="h-11 px-4">
                <span className="text-sm font-medium">Hubungi</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
