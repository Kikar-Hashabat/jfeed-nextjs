import { Metadata } from "next";

interface LayoutMetadataProps {
  title: string;
  description: string;
  type?: "website" | "article";
  canonical?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}

export function generateLayoutMetadata({
  title,
  description,
  type = "website",
  canonical,
  image,
}: LayoutMetadataProps): Metadata {
  const defaultImage = {
    url: "/logo/jfeed-logo_512.png",
    width: 512,
    height: 512,
    alt: "JFeed Logo",
  };

  const socialImage = image || defaultImage;

  return {
    title: {
      default: `${title} - Israel News`,
      template: `%s | ${title}`,
    },
    description,
    applicationName: "JFeed",
    referrer: "origin-when-cross-origin",
    keywords: [
      "JFeed",
      "Israel News",
      "Jewish News",
      "Jewish World",
      "Israel",
      "Weather",
      "TV",
      "Radio",
      "Global News",
    ],
    authors: [{ name: "JFeed Team" }],
    creator: "JFeed",
    publisher: "JFeed",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: canonical,
      types: {
        "application/rss+xml":
          "https://a.jfeed.com/v1/rss/articles/latest/rss2",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "FjXIcd2RpoJVQ017W9NSl1EqY3ZFoAjWzrQ-6KxPUg8",
    },
    openGraph: {
      type,
      siteName: "JFeed",
      title,
      description,
      url: canonical,
      images: [
        {
          url: socialImage.url,
          width: socialImage.width,
          height: socialImage.height,
          alt: socialImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
      creator: "@JFeed",
      site: "@JFeed",
    },
    other: {
      // Analytics IDs
      "google-analytics": "G-0XK60NGJ6B",
      "google-adsense": "AW-11464299220",
      "hotjar-id": "5162923",
      "hotjar-version": "6",

      // Mobile app config
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": title,
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#000000",
      "msapplication-tap-highlight": "no",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://www.jfeed.com",
    logo: "/logo/jfeed-logo_512.png",
  };
}

export function generateHomePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "JFeed - Israel News",
    url: "https://www.jfeed.com",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "WebPage",
            "@id": "https://www.jfeed.com/",
            name: "Home",
          },
        },
      ],
    },
  };
}
