// lib/metadata.ts
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
      default: `${title} - Your Modern News Feed`,
      template: `%s | ${title}`,
    },
    description,
    applicationName: "JFeed",
    referrer: "origin-when-cross-origin",
    keywords: [
      "JFeed",
      "Jewish News",
      "Modern News",
      "Jewish Community",
      "News Feed",
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
