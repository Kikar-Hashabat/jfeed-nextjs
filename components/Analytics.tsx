"use client";

import { Suspense, useEffect } from "react";
import ReactGA from "react-ga4";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

type PageType =
  | "homepage"
  | "article"
  | "category"
  | "archive"
  | "author"
  | "search"
  | "tag"
  | "weather"
  | "shabbat-times"
  | "halachic-times";

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();
    const pathParts = pathname.split("/").filter(Boolean);

    // Determine page type and data based on URL structure
    let pageType: PageType = "homepage";
    let section = "home";
    let additionalData = {};

    if (pathParts.length === 0) {
      pageType = "homepage";
      section = "home";
    }
    // Handle special sections first
    else if (pathParts[0] === "weather") {
      pageType = "weather";
      section = "weather";
      additionalData = {
        state: pathParts[1],
        city: pathParts[2],
      };
    } else if (["shabbat-times", "halachic-times"].includes(pathParts[0])) {
      pageType = pathParts[0] as PageType;
      section = "times";
      additionalData = {
        state: pathParts[1],
        city: pathParts[2],
        date: pathParts[3],
      };
    } else if (pathParts[0] === "search") {
      pageType = "search";
      section = "search";
      additionalData = {
        query: searchParams.get("q"),
      };
    } else if (pathParts[0] === "archive") {
      pageType = "archive";
      section = "archive";
      additionalData = {
        year: pathParts[1],
        month: pathParts[2],
        day: pathParts[3],
      };
    } else if (pathParts[0] === "authors") {
      pageType = "author";
      section = "authors";
      additionalData = {
        authorSlug: pathParts[1],
      };
    } else if (pathParts[0] === "tags") {
      pageType = "tag";
      section = "tags";
      additionalData = {
        tagSlug: pathParts[1],
      };
    }
    // Handle dynamic category/article routes
    else if (pathParts.length === 2) {
      pageType = "article";
      section = pathParts[0]; // category name
      additionalData = {
        category: pathParts[0],
        articleSlug: pathParts[1],
      };
    } else if (pathParts.length === 1) {
      pageType = "category";
      section = pathParts[0];
      additionalData = {
        category: pathParts[0],
      };
    }

    // Send pageview
    ReactGA.send({
      hitType: "pageview",
      page: url,
      title: section,
    });

    // Send custom event with all data
    ReactGA.event("page_view", {
      page_path: url,
      page_type: pageType,
      page_section: section,
      ...additionalData,
    });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
