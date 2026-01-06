"use client";

import { cn } from "@/lib/utils";
import { PopiconsMapDuotone } from "@popicons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-out-cubic",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm"
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="transition-transform duration-200 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold tracking-tight">
                Dialisis Malaysia
              </span>
              <span className="text-xs text-muted-foreground hidden md:block">
                Direktori Pusat Dialisis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/peta">
              <Button variant="ghost" className="text-sm font-medium">
                <PopiconsMapDuotone className="h-4 w-4 mr-1.5 text-primary" />
                Peta
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" className="text-sm font-medium">
                Blog
              </Button>
            </Link>
            <Link href="/hubungi-kami">
              <Button variant="ghost" className="text-sm font-medium">
                Hubungi Kami
              </Button>
            </Link>
            <Link href="/peta" className="ml-2">
              <Button variant="trust" size="sm">
                Cari Pusat
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link href="/peta">
              <Button variant="trust" size="sm">
                <PopiconsMapDuotone className="h-4 w-4" />
                Cari
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
