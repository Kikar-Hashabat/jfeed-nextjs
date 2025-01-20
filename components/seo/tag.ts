// components/seo/tag.ts
import { Metadata } from "next";
import { Tag } from "@/types";
import { Article } from "@/types";

export function generateTagMetadata(tag: Tag, currentPage: number): Metadata {
  const isFirstPage = currentPage === 1;
  const baseUrl = `https://www.jfeed.com/tags/${tag.slug}`;
  const canonicalUrl = isFirstPage ? baseUrl : `${baseUrl}?page=${currentPage}`;

  // Get the first paragraph text if available
  const firstParagraph = tag.content?.[0]?.children?.[0]?.text || "";

  // Construct title based on available information
  const displayTitle = tag.title || tag.name;
  const metaTitle = tag.metaTitle || displayTitle;
  const title = isFirstPage
    ? `${metaTitle}`
    : `${displayTitle} - Page ${currentPage} | JFeed`;

  // Create description from available fields
  const description =
    tag.metaDescription ||
    tag.subtitle ||
    firstParagraph?.slice(0, 155) ||
    `Latest news and updates about ${tag.name}. Browse ${tag.articlesCount} articles on JFeed.`;

  // Combine keywords from all available sources
  const metaKeywordsArray =
    tag.metaKeywords?.split(",").map((k) => k.trim()) || [];
  const keywordsArray = tag.keywords?.map((k) => k.keyword) || [];
  const defaultKeywords = [tag.name, "JFeed", "news"];
  const uniqueKeywords = [
    ...new Set([...metaKeywordsArray, ...keywordsArray, ...defaultKeywords]),
  ];

  return {
    title,
    description,
    keywords: uniqueKeywords.join(", "),
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl,
      siteName: "JFeed",
      images: tag.imageSrc
        ? [
            {
              url: tag.imageSrc,
              width: 1200,
              height: 630,
              alt: `${displayTitle} - JFeed`,
            },
          ]
        : [
            {
              url: "/logo/jfeed-logo_512x512.png",
              width: 512,
              height: 512,
              alt: "JFeed Logo",
            },
          ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [tag.imageSrc || "/logo/jfeed-logo_512x512.png"],
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
    },
    ...(currentPage > 1 && {
      prev: baseUrl + (currentPage > 2 ? `?page=${currentPage - 1}` : ""),
    }),
  };
}

export function generateTagStructuredData(tag: Tag, articles: Article[]) {
  // Get description from available sources
  const description =
    tag.description ||
    tag.metaDescription ||
    tag.content?.[0]?.children?.[0]?.text ||
    `Articles tagged with ${tag.name}`;

  // Main tag structured data
  const tagData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://www.jfeed.com/tags/${tag.slug}#webpage`,
    name: tag.title || tag.name,
    headline: tag.metaTitle || tag.title || tag.name,
    description,
    url: `https://www.jfeed.com/tags/${tag.slug}`,
    datePublished: tag.created,
    dateModified: tag.updated,
    ...(tag.imageSrc && { image: tag.imageSrc }),
    keywords: [...(tag.keywords?.map((k) => k.keyword) || []), tag.name].join(
      ", "
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tag.articlesCount,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: article.title,
          url: `https://www.jfeed.com/${article.categorySlug}/${article.slug}`,
          datePublished: new Date(article.time * 1000).toISOString(),
          dateModified: article.lastUpdate
            ? new Date(article.lastUpdate * 1000).toISOString()
            : new Date(article.time * 1000).toISOString(),
          ...(article.image?.src && { image: article.image.src }),
          ...(article.author && { author: article.author }),
        },
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.jfeed.com/#website",
      name: "JFeed",
      url: "https://www.jfeed.com",
    },
  };

  // Generate breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": "https://www.jfeed.com/",
          name: "Home",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": "https://www.jfeed.com/tags",
          name: "Tags",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": `https://www.jfeed.com/tags/${tag.slug}`,
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
