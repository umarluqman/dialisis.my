"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { PopiconsMapDuotone } from "@popicons/react";
import { useLocale, useTranslations } from "next-intl";
import Logo from "./logo";
import { Button } from "./ui/button";

export const Navbar = () => {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  };

  return (
    <nav className="w-full bg-background py-2 px-4 md:py-4 md:px-20 text-black">
      <div className="container px-0">
        {/* Desktop View */}
        <div className="hidden items-center justify-between md:flex">
          <div className="flex items-center space-x-6">
            <Link className="flex items-center" href="/">
              <div className="flex space-x-3 items-center">
                <Logo />
                <span className="sr-only">{t("brand")}</span>
                <div className="tracking-wide font-medium leading-none">
                  <div>{t("brand")}</div>
                </div>
              </div>
            </Link>
            <Link className="flex items-center" href="/peta">
              <Button variant="outline" size="sm">
                <PopiconsMapDuotone className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t("map")}</span>
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                <span className="text-sm font-medium">Blog</span>
              </Button>
            </Link>
            <Link href="/hubungi-kami">
              <Button variant="ghost" size="sm">
                <span className="text-sm font-medium">{t("contact")}</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {t("languageLabel")}
            </span>
            <div className="flex items-center gap-1 bg-muted/60 rounded-full p-1">
              <Button
                variant={locale === "ms" ? "default" : "ghost"}
                size="sm"
                className="px-3"
                onClick={() => handleLocaleChange("ms")}
              >
                BM
              </Button>
              <Button
                variant={locale === "en" ? "default" : "ghost"}
                size="sm"
                className="px-3"
                onClick={() => handleLocaleChange("en")}
              >
                EN
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex items-center justify-between md:hidden">
          <Link className="flex items-center" href="/">
            <div className="flex space-x-3 items-center">
              <Logo />
              <span className="sr-only">{t("brand")}</span>
              <div className="tracking-wide font-medium leading-none">
                <div>{t("brand")}</div>
              </div>
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/peta">
              <Button variant="outline" size="sm">
                <PopiconsMapDuotone className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t("map")}</span>
              </Button>
            </Link>
            <Link href="/hubungi-kami">
              <Button variant="ghost" size="sm">
                <span className="text-sm font-medium">{t("contact")}</span>
              </Button>
            </Link>
            <div className="flex items-center gap-1 bg-muted/60 rounded-full p-1">
              <Button
                variant={locale === "ms" ? "default" : "ghost"}
                size="icon"
                className="px-3"
                onClick={() => handleLocaleChange("ms")}
              >
                BM
              </Button>
              <Button
                variant={locale === "en" ? "default" : "ghost"}
                size="icon"
                className="px-3"
                onClick={() => handleLocaleChange("en")}
              >
                EN
              </Button>
            </div>
          </div>
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
