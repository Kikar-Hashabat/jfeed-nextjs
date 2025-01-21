import { Metadata } from "next";

interface GenerateSearchMetadataProps {
  query?: string;
}

export function generateSearchMetadata({
  query,
}: GenerateSearchMetadataProps): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const searchUrl = `${baseUrl}/search`;
  const canonicalUrl = query
    ? `${searchUrl}?q=${encodeURIComponent(query)}`
    : searchUrl;

  const title = query
    ? `Search Results for "${query}" - JFeed Israel News`
    : "Search JFeed Israel News";

  const description = query
    ? `Find articles about "${query}" on JFeed - Your trusted source for Israel News, Jewish culture, and current events.`
    : "Search JFeed Israel News - Find articles about Israel, Jewish culture, and current events.";

  return {
    title,
    description,
    keywords: query
      ? `${query}, search, JFeed, Israel News, Jewish news`
      : "search, JFeed, Israel News, Jewish news",
    authors: [{ name: "JFeed Israel News" }],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "JFeed Israel News",
      images: [
        {
          url: "/logo/jfeed-logo_512x512.png",
          width: 512,
          height: 512,
          alt: "JFeed Israel News Logo",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/logo/jfeed-logo_512x512.png"],
      site: "@JFeedNews",
      creator: "@JFeedNews",
    },
    robots: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      nocache: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    viewport: "width=device-width, initial-scale=1",
  };
}

export function generateSearchStructuredData(query?: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const searchUrl = `${baseUrl}/search`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "JFeed Israel News",
        publisher: {
          "@type": "Organization",
          name: "JFeed Israel News",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo/jfeed-logo_512x512.png`,
          },
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${searchUrl}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SearchResultsPage",
        "@id": `${searchUrl}#webpage`,
        url: query ? `${searchUrl}?q=${encodeURIComponent(query)}` : searchUrl,
        name: query ? `Search Results for "${query}"` : "Search",
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@id": baseUrl,
                name: "Home",
              },
            },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@id": searchUrl,
                name: "Search",
              },
            },
            ...(query
              ? [
                  {
                    "@type": "ListItem",
                    position: 3,
                    item: {
                      "@id": `${searchUrl}?q=${encodeURIComponent(query)}`,
                      name: `Results for "${query}"`,
                    },
                  },
                ]
              : []),
          ],
        },
      },
    ],
  };
}
