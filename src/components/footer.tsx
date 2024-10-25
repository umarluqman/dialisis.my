import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-md"></div>
              <span className="text-xl font-bold">Dialisis Malaysia</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Dialisis Malaysia ialah platform yang membantu anda mencari pusat
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
          <div>
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
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              {["About", "Team", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Pautan Tambahan
            </h3>
            <ul className="mt-4 space-y-4">
              {["Help", "Sales", "Advertise", "Privacy"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between">
          <p className="text-base text-gray-400">
            &copy; 2024 Shadcnblocks. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Terms and Conditions
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
