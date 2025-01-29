"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Article } from "@/types";

interface ScrollArticlesProps {
  articles: Article[];
}

type ScrollDirection = "left" | "right";

const ScrollArticles: React.FC<ScrollArticlesProps> = ({ articles }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Duplicate articles for infinite scroll
  const duplicatedArticles = [...articles, ...articles, ...articles];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scroll = (direction: ScrollDirection): void => {
    if (isAnimating || !scrollContainerRef.current) return;

    setIsAnimating(true);
    const container = scrollContainerRef.current;
    const cardWidth = container.children[0]?.clientWidth || 0;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    const maxScroll = cardWidth * articles.length;
    const minScroll = 0;

    const currentScrollPosition = container.scrollLeft;
    const newScrollPosition =
      direction === "left"
        ? currentScrollPosition - scrollAmount
        : currentScrollPosition + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    setTimeout(() => {
      if (newScrollPosition >= maxScroll * 2) {
        container.scrollLeft = maxScroll;
      } else if (newScrollPosition <= minScroll) {
        container.scrollLeft = maxScroll;
      }
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.children[0]?.clientWidth || 0;
      container.scrollLeft = cardWidth * articles.length;
    }
  }, [articles]);

  return (
    <div
      className="relative mx-auto max-w-full px-4 md:px-0"
      role="region"
      aria-label="Scrollable articles"
    >
      {/* Navigation Buttons - Hidden on Mobile */}
      {!isMobile && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={isAnimating}
            className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
              items-center justify-center bg-[#2185d0] border-4 rounded-full 
              hover:bg-[#1678c2] transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={isAnimating}
            className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
              items-center justify-center bg-[#2185d0] border-4 rounded-full 
              hover:bg-[#1678c2] transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Articles Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-x-hidden scroll-smooth pb-4 md:pb-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {duplicatedArticles.map((article, index) => (
          <div
            key={`${article.id}-${index}`}
            className="flex-none w-[280px] md:w-[300px] transition-transform duration-300"
          >
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={article.image?.src || "/api/placeholder/300/169"}
                    alt={article.image?.alt || ""}
                    className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
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
    </div>
  );
};

export default ScrollArticles;
