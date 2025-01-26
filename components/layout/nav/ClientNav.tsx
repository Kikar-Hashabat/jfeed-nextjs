"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div
        className={`bg-red-600 ${isScrolled ? "fixed top-0 w-full z-50" : ""}`}
      >
        <div className="max-w-full mx-4 px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                <Menu className="text-white h-6 w-6" />
              </button>
              <Link href="/search" aria-label="Search">
                <Search className="text-white h-6 w-6" />
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <Image
                src="/logo/logo-white.svg"
                alt="JFeed"
                width={120}
                height={48}
                priority
                className="mx-auto"
              />
            </div>

            <div className="flex items-center space-x-6 text-white text-sm">
              <Link href="/contact">Contact us</Link>
              <div>Washington | 21°</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav
        className={`bg-white shadow-md hidden md:block ${
          isScrolled ? "fixed top-16 w-full z-40" : ""
        }`}
      >
        <div className="max-w-full mx-4 px-4">
          <div className="flex justify-center space-x-8 py-4">
            {items.map((item) => (
              <Link
                key={item.category.slug}
                href={`/${item.category.slug}`}
                className="text-gray-800 hover:text-red-600 transition-colors"
              >
                {item.category.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="mb-4"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            <nav className="space-y-4">
              {items.map((item) => (
                <Link
                  key={item.category.slug}
                  href={`/${item.category.slug}`}
                  className="block text-gray-800 hover:text-red-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.category.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-white hidden md:block">
            <div className="p-8">
              <button
                onClick={() => setIsOpen(false)}
                className="mb-4"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              <nav className="grid grid-cols-3 gap-8 mt-8">
                {items.map((item) => (
                  <Link
                    key={item.category.slug}
                    href={`/${item.category.slug}`}
                    className="text-xl text-gray-800 hover:text-red-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.category.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
