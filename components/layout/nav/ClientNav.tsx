"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface NavItem {
  category: {
    slug: string;
    title: string;
  };
}

interface ClientNavProps {
  items: NavItem[];
}

export function ClientNav({ items }: ClientNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, isScrolled]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="w-full" role="banner">
      <div
        className={`bg-red-600 fixed top-0 w-full z-50 transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? "md:opacity-0 md:pointer-events-none"
              : "md:relative md:opacity-100"
          }
        `}
      >
        <nav className="max-w-full mx-4 px-4" role="navigation">
          <div className="flex items-center justify-between h-16">
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? (
                  <X className="text-white h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="text-white h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="desktop-menu"
                className="transition-transform duration-200 hover:scale-105"
              >
                {isOpen ? (
                  <X className="text-white h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="text-white h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <Link
                href="/search"
                aria-label="Search"
                className="transition-transform duration-200 hover:scale-105"
              >
                <Search className="text-white h-6 w-6" aria-hidden="true" />
              </Link>
            </div>

            <Link
              href="/"
              aria-label="Home"
              className="flex-1 flex justify-center transition-transform duration-200 hover:scale-105"
            >
              <Image
                src="/logo/logo-white.svg"
                alt="JFeed Logo"
                width={120}
                height={48}
                priority
                className="mx-auto"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-white text-sm">
              <Link
                href="/contact"
                className="transition-colors duration-200 hover:text-red-100"
              >
                Contact us
              </Link>
              <Link
                href="/weather"
                className="flex items-center space-x-2 transition-colors duration-200 hover:text-red-100"
                role="complementary"
                aria-label="Weather"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 3V5M5.31412 5.31412L6.728 6.728M3 12H5M5.31412 18.6859L6.728 17.272M12 19V21M18.6859 18.6859L17.272 17.272M21 12H19M18.6859 5.31412L17.272 6.728"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </Link>
            </div>

            <div className="w-6 md:hidden"></div>
          </div>
        </nav>
      </div>

      <nav
        className={`shadow-md hidden md:block transition-all duration-300 ease-in-out lg:overflow-visible overflow-hidden
          ${
            isScrolled
              ? "fixed top-0 w-full z-40 bg-red-600 transform translate-y-0"
              : "bg-white transform translate-y-0"
          }
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-full px-4">
          <div className="flex items-center py-2">
            <Link href="/" className="mr-8" aria-label="Home">
              {isScrolled && (
                <Image
                  src="/logo/logo-white.svg"
                  alt="JFeed Logo"
                  width={90}
                  height={36}
                  priority
                  className="transition-all duration-300 opacity-100 transform hover:scale-105"
                />
              )}
            </Link>
            <div className="hidden lg:flex justify-center space-x-8 flex-1">
              {items.map((item) => (
                <Link
                  key={item.category.slug}
                  href={`/${item.category.slug}`}
                  className={`px-4 py-2 rounded-md transition-all duration-200
                    ${
                      isScrolled
                        ? "text-white hover:bg-red-700 hover:scale-105"
                        : "text-gray-800 hover:bg-gray-100 hover:scale-105"
                    }
                  `}
                >
                  {item.category.title}
                </Link>
              ))}
            </div>
            <div className="flex lg:hidden justify-start space-x-2 flex-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-2 rounded-md transition-all duration-200
                  ${
                    isScrolled
                      ? "text-white hover:bg-red-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }
                `}
              >
                {items.map((item) => (
                  <Link
                    key={item.category.slug}
                    href={`/${item.category.slug}`}
                    className={`px-4 py-2 rounded-md transition-all duration-200
                    ${
                      isScrolled
                        ? "text-white hover:bg-red-700 hover:scale-105"
                        : "text-gray-800 hover:bg-gray-100 hover:scale-105"
                    }
                  `}
                  >
                    {item.category.title}
                  </Link>
                ))}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`
          fixed top-16 bottom-0 left-0 w-[90%] bg-white z-50 md:hidden
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6" role="search">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg transition-colors duration-200 focus:border-red-600 focus:outline-none"
                aria-label="Search"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
                aria-hidden="true"
              />
            </div>
          </form>
          <nav className="space-y-4">
            {items.map((item) => (
              <Link
                key={item.category.slug}
                href={`/${item.category.slug}`}
                className="block text-gray-800 transition-colors duration-200 hover:text-red-600"
                onClick={() => setIsOpen(false)}
              >
                {item.category.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div
        id="desktop-menu"
        className={`
          fixed inset-x-0 top-0 bg-white z-40 hidden md:block
          transform transition-all duration-300 ease-in-out
          ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }
        `}
        style={{ height: "calc(50vh + 4rem)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Desktop navigation"
      >
        <div className="h-16 bg-red-600" aria-hidden="true" />
        <div className="container mx-auto px-4 md:px-8 py-8">
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-8"
            role="search"
          >
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg transition-colors duration-200 focus:border-red-600 focus:outline-none"
                aria-label="Search"
              />
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
                aria-hidden="true"
              />
            </div>
          </form>
          <nav className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {items.map((item) => (
              <Link
                key={item.category.slug}
                href={`/${item.category.slug}`}
                className="text-lg md:text-xl text-gray-800 transition-all duration-200 hover:text-red-600 hover:translate-x-1"
                onClick={() => setIsOpen(false)}
              >
                {item.category.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </header>
  );
}
