"use client";

import { Menu, X, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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

  return (
    <>
      {/* Mobile Navigation */}
      <div className="flex w-full items-center justify-between md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-red-700 rounded-md"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link
          href="/"
          aria-label="Home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <div className="relative w-[120px] h-[40px]">
            <Image
              src="/logo/jfeed-new.png"
              alt="JFeed News Logo"
              title={"JFeed logo"}
              fill
              sizes="120px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="p-2 hover:bg-red-700 rounded-md"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/weather"
            className="p-2 hover:bg-red-700 rounded-md"
            aria-label="Weather forecast"
          >
            <Sun className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex w-full items-center font-newsreader">
        <Link href="/" aria-label="Home" className="mr-8">
          <div className="relative w-[140px] h-[50px]">
            <Image
              src="/logo/jfeed-new.png"
              alt="JFeed News Logo"
              title={"JFeed logo"}
              fill
              sizes="140px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <nav className="flex items-center space-x-1 flex-1">
          {items.map((item) => (
            <Link
              key={item.category.slug}
              href={`/${item.category.slug}`}
              className="px-6 py-2 font-medium uppercase hover:bg-red-700 rounded-md transition-colors"
              aria-label={`Navigate to ${item.category.title}`}
            >
              {item.category.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="p-2 hover:bg-red-700 rounded-md flex items-center gap-1"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/weather"
            className="p-2 hover:bg-red-700 rounded-md flex items-center gap-1"
            aria-label="Weather forecast"
          >
            <Sun className="h-5 w-5" />
            <span
              id="weather-temp"
              className="text-sm"
              aria-label="Weather temperature"
            ></span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="absolute top-16 left-0 right-0 bg-red-600 p-4 shadow-lg md:hidden font-newsreader"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col space-y-2">
            {items.map((item) => (
              <Link
                key={item.category.slug}
                href={`/${item.category.slug}`}
                className="px-4 py-2 text-sm font-medium uppercase hover:bg-red-700 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label={`Navigate to ${item.category.title}`}
              >
                {item.category.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
