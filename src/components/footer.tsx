import Link from "next/link";
import Logo from "./logo";

const boring = [
  { label: "Blog", href: "/blog" },
  { label: "Peta", href: "/peta" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
  { label: "Terma & Syarat", href: "/terma-dan-syarat" },
  { label: "Polisi Privasi", href: "/polisi-privasi" },
];

const popularLocations = [
  { label: "Selangor", href: "/lokasi/selangor" },
  { label: "Johor", href: "/lokasi/johor" },
  { label: "Pulau Pinang", href: "/lokasi/pulau-pinang" },
  { label: "Perak", href: "/lokasi/perak" },
  { label: "Kuala Lumpur", href: "/lokasi/kuala-lumpur" },
  { label: "Sabah", href: "/lokasi/sabah" },
  { label: "Pahang", href: "/lokasi/pahang" },
  { label: "Kedah", href: "/lokasi/kedah" },
];

const relatedLinks = [
  {
    label: "National Renal Registry (NRR)",
    href: "https://app.msn.org.my/nrr_dir/page.jsp?pageId=centre_directory",
  },
];

export default function Footer() {
  return (
    <footer className="bg-background-subtle py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <Logo />
              <span className="font-display text-xl font-semibold text-foreground">
                Dialisis Malaysia
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Dialisis.MY ialah platform yang membantu anda mencari pusat
              dialisis di Malaysia dengan mudah dan pantas.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
              Lokasi Popular
            </h3>
            <ul className="mt-4 space-y-3">
              {popularLocations.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
              Pautan Berkaitan
            </h3>
            <ul className="mt-4 space-y-3">
              {relatedLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dialisis.MY. Hak cipta terpelihara.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {boring.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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
