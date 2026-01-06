import { MapPin, Shield, Building2, Heart } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";

const quickLinks = [
  { label: "Cari Pusat", href: "/peta" },
  { label: "Blog", href: "/blog" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
];

const resources = [
  {
    label: "National Renal Registry (NRR)",
    href: "https://app.msn.org.my/nrr_dir/page.jsp?pageId=centre_directory",
  },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

const legal = [
  { label: "Terma & Syarat", href: "/terma-dan-syarat" },
  { label: "Polisi Privasi", href: "/polisi-privasi" },
];

const trustSignals = [
  {
    icon: Shield,
    title: "Maklumat Sahih",
    subtitle: "Sumber NRR Malaysia",
  },
  {
    icon: MapPin,
    title: "900+ Pusat",
    subtitle: "Seluruh Malaysia",
  },
  {
    icon: Building2,
    title: "Semua Sektor",
    subtitle: "Kerajaan & Swasta",
  },
  {
    icon: Heart,
    title: "Untuk Pesakit",
    subtitle: "& Keluarga",
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-sage-50 to-sage-100 pt-16 pb-8">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full text-background"
          viewBox="0 0 1440 48"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,48 C480,0 960,32 1440,8 L1440,48 L0,48 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-12 border-b border-sage-200">
          {trustSignals.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-medium text-sm text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          ))}
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <Logo className="transition-transform duration-200 group-hover:scale-105" />
              <span className="font-display text-xl font-semibold">
                Dialisis Malaysia
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Platform rasmi untuk mencari pusat dialisis di Malaysia. Kami
              membantu pesakit dan keluarga menemui pusat rawatan yang sesuai
              dengan keperluan mereka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">
              Pautan Pantas
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">
              Sumber
            </h4>
            <ul className="space-y-3">
              {resources.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-sage-200 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Dialisis.MY. Semua hak
            terpelihara.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legal.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
