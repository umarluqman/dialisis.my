"use client";

import { PopiconsMapDuotone } from "@popicons/react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-background py-2 px-4 md:py-4 md:px-20 text-black">
      <div className="container px-0">
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
            <Link className="flex items-center space-x-2" href="/peta">
              <Button variant="outline" size="sm">
                <PopiconsMapDuotone className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Lihat Peta</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex items-center justify-between md:hidden">
          <Link className="flex items-center" href="/">
            <div className="flex space-x-3 items-center">
              <Logo />
              <span className="sr-only">Dialisis Malaysia</span>
              <div className="tracking-wide font-medium leading-none">
                <div>Dialisis Malaysia</div>
              </div>
            </div>
          </Link>
          <Link className="flex items-cente space-x-2" href="/peta">
            <Button variant="outline" size="sm">
              <PopiconsMapDuotone className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Lihat Peta</span>
            </Button>
          </Link>
          {/* <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <PopiconsBarsRightSolid className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button> */}
        </div>

        {/* Mobile Menu */}
        {/* {isOpen && (
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
              <Link className="flex items-center" href="/">
                <div className="flex space-x-3 items-center">
                  <Logo />
                  <span className="sr-only">Dialisis Malaysia</span>
                  <div className="tracking-wide font-medium leading-none">
                    <div>Dialisis Malaysia</div>
                  </div>
                </div>
              </Link>
              <Link className="flex items-center" href="/peta">
                <span className="font-medium px-4">Lihat Peta</span>
              </Link>
            </div>
          </div>
        )} */}
      </div>
    </nav>
  );
};
