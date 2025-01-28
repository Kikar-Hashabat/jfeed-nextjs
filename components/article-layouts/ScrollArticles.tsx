"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Article } from "@/types";
import { OptimizedImage } from "../OptimizedImage";
import Link from "next/link";

type ScrollDirection = "left" | "right";

const ScrollArticles = ({ articles }: { articles: Article[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Duplicate articles for infinite scroll
  const duplicatedArticles = [...articles, ...articles, ...articles];

  const scroll = (direction: ScrollDirection) => {
    if (isAnimating || !scrollContainerRef.current) return;

    setIsAnimating(true);
    const container = scrollContainerRef.current;
    const cardWidth = container.children[0]?.clientWidth || 0;
    const gap = 24; // Gap between cards
    const scrollAmount = cardWidth + gap;

    const maxScroll = cardWidth * articles.length;
    const minScroll = 0;

    const currentScrollPosition = container.scrollLeft;

    let newScrollPosition =
      direction === "left"
        ? currentScrollPosition - scrollAmount
        : currentScrollPosition + scrollAmount;

    // Smooth scrolling
    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    // Adjust position seamlessly for infinite scrolling
    setTimeout(() => {
      if (newScrollPosition >= maxScroll * 2) {
        // Scrolled too far right
        container.scrollLeft = maxScroll;
      } else if (newScrollPosition <= minScroll) {
        // Scrolled too far left
        container.scrollLeft = maxScroll;
      }
      setIsAnimating(false);
    }, 300); // Match duration with the smooth scroll
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.children[0]?.clientWidth || 0;
      container.scrollLeft = cardWidth * articles.length; // Center the scroll position on mount
    }
  }, [articles]);

  return (
    <div className="relative" role="region" aria-label="Scrollable articles">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={isAnimating}
        className="absolute -left-20 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
          flex items-center justify-center bg-[#2185d0] border-4  rounded-full 
          hover:bg-[#1678c2] transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      {/* Articles Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {duplicatedArticles.map((article, index) => (
          <div
            key={`${article.id}-${index}`}
            className="flex-none w-[300px] transition-transform duration-300"
          >
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <OptimizedImage
                    src={article.image?.src || ""}
                    alt={article.image?.alt || ""}
                    fill
                    sizes="300px"
                    className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                      <div
                        className="w-3 h-3 border-t-[8px] border-t-transparent 
                        border-l-[12px] border-l-green-500
                        border-b-[8px] border-b-transparent
                        translate-x-[2px]"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-white/90 transition-colors duration-300">
                  {article.titleShort || article.title}
                </h3>

                <div className="flex items-center text-xs text-white/80 uppercase">
                  <time dateTime={new Date(article.time).toISOString()}>
                    {new Date(article.time).toLocaleDateString("de-DE")}
                  </time>
                  {article.categorySlug && (
                    <>
                      <span className="mx-2">|</span>
                      <span>{article.categorySlug}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={isAnimating}
        className="absolute -right-20 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
          flex items-center justify-center bg-[#2185d0] border-4 rounded-full 
          hover:bg-[#1678c2] transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};

export default ScrollArticles;
