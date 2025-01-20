import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-slate-900 text-gray-100 mt-8"
      role="contentinfo"
    >
      <div className="bg-slate-800">
        <div className="container mx-auto p-8">
          {/* Footer Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            {/* Brand and Description */}
            <div>
              <h2 className="mb-2 md:mb-0 text-xl">
                <strong className="font-bold text-white">JFeed</strong>
                <Link
                  href="/"
                  className="ml-2 hover:text-gray-300 transition-colors duration-200 text-gray-100"
                  aria-label="JFeed News and Updates Portal - Home"
                >
                  News and updates portal
                </Link>
              </h2>
            </div>

            {/* Social Links */}
            <nav
              aria-label="Social Media Links"
              className="flex items-center space-x-4"
            >
              <a
                href="https://twitter.com/JFeedEnglish"
                title="Follow JFeed on Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-200 text-white"
                aria-label="Follow JFeed on Twitter (opens in new tab)"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-6 h-6"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 3s-4 10 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/JFeedJewishNews"
                title="Follow JFeed on Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-200 text-white"
                aria-label="Follow JFeed on Facebook (opens in new tab)"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-6 h-6"
                >
                  <path d="M22.675 0H1.325C.594 0 0 .594 0 1.325v21.35C0 23.406.594 24 1.325 24h11.49V14.7h-3.2V11h3.2V8.4c0-3.167 1.933-4.9 4.756-4.9 1.35 0 2.51.1 2.85.144V6.7h-1.95c-1.53 0-1.825.73-1.825 1.8V11h3.65l-.475 3.7h-3.175V24h6.225c.73 0 1.325-.594 1.325-1.325V1.325C24 .594 23.406 0 22.675 0z" />
                </svg>
              </a>
            </nav>
          </div>

          <hr className="border-gray-600 my-6" aria-hidden="true" />

          {/* Footer Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
              aria-label="JFeed Home"
            >
              <Image
                src="https://www.jfeed.com/assets/images/logo/jfeed.png"
                alt="JFeed Israel News"
                title={"JFeed logo"}
                width={150}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Footer Links */}
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap justify-center gap-4 text-sm mt-4 md:mt-0"
            >
              <ul className="flex flex-wrap gap-2 items-center">
                <li>
                  <Link
                    href="/news"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    JFeed News
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gray-500">
                  |
                </li>
                <li>
                  <a
                    href="mailto:desk@jfeed.com"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    Contact Us
                  </a>
                </li>
                <li aria-hidden="true" className="text-gray-500">
                  |
                </li>
                <li>
                  <Link
                    href="/general/privacy-policy"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gray-500">
                  |
                </li>
                <li>
                  <Link
                    href="/general/terms-of-use"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/weather"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    Weather
                  </Link>
                </li>
                <li>
                  <Link
                    href="/halachic-times"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    Halachic Times
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shabbat-times"
                    className="hover:text-gray-300 transition-colors duration-200 text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
                  >
                    Shabbat Times
                  </Link>
                </li>
                <li>
                  <p className="text-gray-300">
                    © {currentYear} JFeed. All rights reserved.
                  </p>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
