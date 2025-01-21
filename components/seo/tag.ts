import { Metadata } from "next";
import { Tag } from "@/types/tag";
import { Article } from "@/types";

export function generateTagMetadata(tag: Tag, currentPage: number): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const isFirstPage = currentPage === 1;
  const tagUrl = `${baseUrl}/tags/${tag.slug}`;
  const canonicalUrl = isFirstPage ? tagUrl : `${tagUrl}?page=${currentPage}`;

  // Get the first paragraph text if available
  const firstParagraph = tag.content?.[0]?.children?.[0]?.text || "";

  // Enhanced title construction
  const displayTitle = tag.title || tag.name || "JFeed Israel News";
  const metaTitle = tag.metaTitle || displayTitle;
  const pageTitle = isFirstPage
    ? `${metaTitle} - JFeed Israel News`
    : `${displayTitle} - Page ${currentPage} | JFeed Israel News`;

  // Enhanced description construction
  const description = (
    tag.metaDescription ||
    tag.subtitle ||
    firstParagraph?.slice(0, 155) ||
    `Discover the latest articles about ${tag.name} on JFeed - Israel News. Browse ${tag.articlesCount} articles.`
  ).trim();

  // Enhanced keywords handling
  const metaKeywordsArray =
    tag.metaKeywords?.split(",").map((k) => k.trim()) || [];
  const keywordsArray = tag.keywords?.map((k) => k.keyword) || [];
  const defaultKeywords = [tag.name, "JFeed", "Israel News", "news"];
  const uniqueKeywords = [
    ...new Set([...metaKeywordsArray, ...keywordsArray, ...defaultKeywords]),
  ];

  return {
    title: pageTitle,
    description: `${description} - JFeed Israel News`,
    keywords: uniqueKeywords.join(", "),
    authors: [{ name: "JFeed" }],
    openGraph: {
      title: `${metaTitle} - JFeed Israel News`,
      description: `${description} - JFeed Israel News`,
      url: canonicalUrl,
      siteName: "JFeed Israel News",
      images: tag.imageSrc
        ? [
            {
              url: tag.imageSrc,
              width: 1200,
              height: 630,
              alt: `${displayTitle} - JFeed Israel News`,
            },
          ]
        : [
            {
              url: "/logo/jfeed-logo_512x512.png",
              width: 512,
              height: 512,
              alt: "JFeed Israel News Logo",
            },
          ],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${metaTitle} - JFeed Israel News`,
      description: `${description} - JFeed Israel News`,
      images: [tag.imageSrc || "/logo/jfeed-logo_512x512.png"],
      site: "@JFeedNews",
      creator: "@JFeedNews",
    },
    robots: {
      index: tag.status !== "draft" && tag.status !== "deleted",
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: canonicalUrl,
      ...(currentPage > 1 && {
        prev: tagUrl + (currentPage > 2 ? `?page=${currentPage - 1}` : ""),
      }),
    },
  };
}

export function generateTagStructuredData(tag: Tag, articles: Article[]) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const tagUrl = `${baseUrl}/tags/${tag.slug}`;

  // Enhanced description from available sources
  const description =
    tag.description ||
    tag.metaDescription ||
    tag.content?.[0]?.children?.[0]?.text ||
    `Latest articles tagged with ${tag.name} on JFeed - Israel News`;

  // Main tag structured data
  const tagData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${tagUrl}#webpage`,
    name: tag.title || tag.name,
    headline: tag.metaTitle || tag.title || tag.name,
    description: `${description} - JFeed Israel News`,
    url: tagUrl,
    datePublished: tag.created,
    dateModified: tag.updated,
    publisher: {
      "@type": "Organization",
      name: "JFeed",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/jfeed-logo_512x512.png`,
        width: 512,
        height: 512,
      },
    },
    ...(tag.imageSrc && {
      image: {
        "@type": "ImageObject",
        url: tag.imageSrc,
        width: 1200,
        height: 630,
      },
    }),
    keywords: [
      ...(tag.keywords?.map((k) => k.keyword) || []),
      tag.name,
      "Israel News",
    ].join(", "),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: article.title,
          url: `${baseUrl}/${article.categorySlug}/${article.slug}`,
          datePublished: new Date(article.time * 1000).toISOString(),
          dateModified: article.lastUpdate
            ? new Date(article.lastUpdate * 1000).toISOString()
            : new Date(article.time * 1000).toISOString(),
          author: article.author
            ? {
                "@type": "Person",
                name: article.author,
              }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: "JFeed",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo/jfeed-logo_512x512.png`,
              width: 512,
              height: 512,
            },
          },
          ...(article.image?.src && {
            image: {
              "@type": "ImageObject",
              url: article.image.src,
              width: article.image.width,
              height: article.image.height,
              alt: article.image.alt || article.title,
            },
          }),
        },
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "JFeed Israel News",
      url: baseUrl,
    },
  };

  // Enhanced breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
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
          "@id": `${baseUrl}/tags`,
          name: "Tags",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": tagUrl,
          name: tag.name,
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [tagData, breadcrumbData],
  };
}
