"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./logo";
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-background p-4 md:px-20 text-black">
      <div className="container px-2">
        {/* Desktop View */}
        <div className="hidden items-center justify-between md:flex">
          <div className="flex items-center space-x-12">
            <Link className="flex items-center" href="/">
              <div className="flex space-x-3 items-center">
                <Logo />
                <span className="sr-only">Dialisis Malaysia</span>
                <div className="tracking-wide font-medium leading-none">
                  <div>Dialisis Malaysia</div>
                  {/* <div>Mode</div> */}
                </div>
              </div>
            </Link>
            <Link className="flex items-center" href="/peta">
              {" "}
              <span className="text-sm font-medium">Peta</span>
            </Link>
          </div>
          {/* <Link
            href="https://chromewebstore.google.com/detail/focus-mode-stay-focused-b/ollmdedpknmlcdmpehclmgbogpifahdc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="flex items-center gap-2">
              <Image
                src="/chrome.png"
                alt="chrome logo"
                width={24}
                height={24}
              />
              Add to Chrome
            </Button>
          </Link> */}
        </div>

        {/* Mobile View */}
        <div className="flex items-center justify-between md:hidden">
          {/* <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">LOGO</div>
            <span className="text-sm font-medium">PRO version</span>
          </div> */}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-white p-4 md:hidden">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="flex flex-col items-start space-y-6">
              <div className="text-xl font-bold">LOGO</div>
              <span className="text-sm font-medium">PRO version</span>
              {/* <div className="w-full pt-4">
                <Button className="w-full" variant="outline">
                  Add to Chrome
                </Button>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
