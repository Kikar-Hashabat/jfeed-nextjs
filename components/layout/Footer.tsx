import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { memo } from "react";

interface NavigationLink {
  title: string;
  url: string;
  description?: string;
}

interface NavigationItemProps {
  title: string;
  links: NavigationLink[];
}

const NavigationColumn = memo(({ title, links }: NavigationItemProps) => {
  const sectionId = `${title.toLowerCase().replace(/\s+/g, "-")}-nav`;

  return (
    <div>
      <h2
        id={sectionId}
        className="text-lg font-bold text-white uppercase border-l-4 border-white pl-2"
      >
        <Link
          href={`/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
          aria-describedby={sectionId}
        >
          {title}
        </Link>
      </h2>
      {links.length > 0 && (
        <ul className="mt-3 space-y-2" aria-labelledby={sectionId}>
          {links.map((link) => (
            <li key={link.url}>
              <Link
                href={link.url}
                className="text-sm text-gray-300 hover:text-gray-100 hover:underline focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                aria-label={link.description || link.title}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

NavigationColumn.displayName = "NavigationColumn";

const LEGAL_LINKS = [
  { title: "Privacy Policy", url: "/general/privacy-policy" },
  { title: "Terms of Service", url: "/general/terms-of-use" },
  { title: "Halachic Times", url: "/halachic-times" },
  { title: "Shabbat Times", url: "/shabbat-times" },
  { title: "Weather", url: "/weather" },
] as const;

const Footer = memo(() => {
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className="bg-black text-white px-6 md:px-12 py-8"
      role="contentinfo"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <Link
            href="/"
            className="focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="JFeed - Return to homepage"
          >
            <Image
              src="/logo/logo-white.svg"
              alt=""
              width={120}
              height={40}
              className="w-auto h-12"
              priority
              loading="eager"
            />
          </Link>

          <Link
            href="mailto:info@jfeed.com"
            className="bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <nav
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8"
          aria-label="Site sections"
        >
          {navigationData.map((item) => (
            <NavigationColumn key={item.title} {...item} />
          ))}
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t border-white/10 pt-4 gap-4 md:gap-0">
          <p className="text-sm text-gray-400 text-center md:text-left">
            <span>© {currentYear} JFeed. All rights reserved.</span>
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
              {LEGAL_LINKS.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-sm text-gray-300 hover:text-gray-100 hover:underline focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;

export const navigationData = [
  {
    title: "News",
    links: [
      {
        title: "Israel News",
        url: "/israel",
        description: "Latest news and updates from Israel",
      },
      {
        title: "World News",
        url: "/world",
        description: "Global news coverage and international updates",
      },
    ],
  },
  {
    title: "Jewish World",
    links: [],
  },
  {
    title: "Crime and Justice",
    links: [],
  },
  {
    title: "Culture",
    links: [
      {
        title: "Jewish Lifestyle",
        url: "/lifestyle",
        description: "Modern Jewish lifestyle, traditions and customs",
      },
      {
        title: "Movies and TV Shows",
        url: "/movies-tv",
        description: "Reviews and news about Jewish-themed entertainment",
      },
      {
        title: "Jewish Music",
        url: "/music",
        description: "Contemporary and traditional Jewish music",
      },
      {
        title: "Jewish Literature",
        url: "/books",
        description: "Book reviews and literary discussions",
      },
      {
        title: "TV and Radio Programs",
        url: "/tv-radio",
        description: "Jewish-themed broadcasting and media",
      },
    ],
  },
  {
    title: "Opinion",
    links: [
      {
        title: "Editorials",
        url: "/editorials",
        description: "Opinion pieces and editorials",
      },
      {
        title: "Letters to the Editor",
        url: "/letters",
        description: "Reader-submitted letters and opinions",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        title: "Community News",
        url: "/community",
        description: "Local news and events from Jewish communities",
      },
      {
        title: "Obituaries",
        url: "/obituaries",
        description: "Obituaries and memorials",
      },
    ],
  },
];
