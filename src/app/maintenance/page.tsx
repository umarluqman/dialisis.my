import Logo from "@/components/logo";
import { Mail, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Penyelenggaraan",
  description:
    "Dialisis MY sedang dalam penyelenggaraan. Kami akan kembali sebentar lagi.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <Wrench className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Kami sedang dalam penyelenggaraan
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Maaf atas kesulitan. Sistem kami sedang dikemas kini dan akan kembali
          dalam masa terdekat. Terima kasih atas kesabaran anda.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <Link
            href="mailto:joharidialisis.my@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            joharidialisis.my@gmail.com
          </Link>
        </div>
      </div>
    </div>
  );
}
