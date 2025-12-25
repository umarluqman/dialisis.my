import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Logo from "./logo";

const boring = [
  { label: "blog", href: "/blog" },
  { label: "about", href: "/tentang-kami" },
  { label: "contact", href: "/hubungi-kami" },
  { label: "terms", href: "/terma-dan-syarat" },
  { label: "privacy", href: "/polisi-privasi" },
];

const relatedLinks = [
  {
    label: "National Renal Registry (NRR)",
    href: "https://app.msn.org.my/nrr_dir/page.jsp?pageId=centre_directory",
  },
  // {
  //   label: "Cara Sihat Sebenar",
  //   href: "https://senjihouse.com.my/kmssmula/?ref=dialisis.my",
  // },
  // {
  //   label: "Kesihatan Mengikut Fitrah",
  //   href: "https://kmss.netlify.app/?ref=dialisis.my",
  // },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-transparent py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-200 rounded-t-3xl border-dashed">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold">{t("brand")}</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              {t("tagline")}
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
              {t("related")}
            </h3>
            <ul className="mt-4 space-y-4">
              {relatedLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-base text-gray-500 hover:text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Lawati Juga
            </h3>
            <ul className="mt-4 space-y-4">
              {lawatiJuga.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-base text-gray-500 hover:text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-6">
            {boring.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {t(label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
