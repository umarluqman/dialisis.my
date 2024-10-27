import Link from "next/link";
import Logo from "./logo";

const boring = [
  { label: "Terma & Syarat", href: "/terms" },
  { label: "Polisi Privasi", href: "/privacy" },
];

const more = [
  { label: "Guna Bitcoin", href: "https://www.gunabitcoin.my" },
  { label: "Semak Hadis", href: "https://www.semahadis.com" },
];

const relatedLinks = [
  {
    label: "National Renal Registry (NRR)",
    href: "https://app.msn.org.my/nrr_dir/page.jsp?pageId=centre_directory",
  },
];

export default function Footer() {
  return (
    <footer className="bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold">Dialisis Malaysia</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Dialisis.MY ialah platform yang membantu anda mencari pusat
              dialisis di Malaysia.
            </p>
            {/* <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
            </div> */}
          </div>
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              {["Overview", "Pricing", "Marketplace", "Features"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div> */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Berkaitan
            </h3>
            <ul className="mt-4 space-y-4">
              {relatedLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Tambahan
            </h3>
            <ul className="mt-4 space-y-4">
              {more.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between">
          <p className="text-base text-gray-400">
            &copy; 2024 Dialysis.MY - All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Terma & Syarat
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Polisi Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
