import { Metadata } from "next";
import { Author, Article } from "@/types";

export function generateAuthorMetadata(
  author: Author,
  currentPage: number
): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const isFirstPage = currentPage === 1;
  const authorUrl = `${baseUrl}/authors/${author.slug}`;
  const canonicalUrl = isFirstPage
    ? authorUrl
    : `${authorUrl}?page=${currentPage}`;

  // Enhanced title construction
  const displayTitle = author.name;
  const pageTitle = isFirstPage
    ? `${displayTitle} - JFeed Israel News Author`
    : `${displayTitle} - Page ${currentPage} | JFeed Israel News`;

  // Enhanced description construction
  const description = (author.bio
    ? `${author.bio.slice(0, 155)}${author.bio.length > 155 ? "..." : ""}`
    : `Read the latest articles by ${author.name} on JFeed - Israel News. Stay updated with their insights and coverage on Israeli news, Jewish culture, and current events.`
  ).trim();

  // Enhanced keywords handling
  const defaultKeywords = [
    author.name,
    "JFeed author",
    "Israel News",
    "Jewish news",
    "Jewish culture",
    author.role,
  ].filter(Boolean);

  return {
    title: pageTitle,
    description: `${description} - JFeed Israel News`,
    keywords: defaultKeywords.join(", "),
    authors: [{ name: author.name, url: canonicalUrl }],
    openGraph: {
      title: `${displayTitle} - JFeed Israel News`,
      description: `${description} - JFeed Israel News`,
      url: canonicalUrl,
      siteName: "JFeed Israel News",
      images: author.image
        ? [
            {
              url: author.image,
              width: 512,
              height: 512,
              alt: `${author.name} - JFeed Israel News Author`,
            },
          ]
        : [
            {
              url: "https://www.jfeed.com/logo/jfeed-logo_512.png",
              width: 512,
              height: 512,
              alt: "JFeed Israel News Logo",
            },
          ],
      type: "profile",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayTitle} - JFeed Israel News`,
      description: `${description} - JFeed Israel News`,
      images: [author.image || "https://www.jfeed.com/logo/jfeed-logo_512.png"],
      site: "@JFeedNews",
      creator: author.twitter ? author.twitter.split("/").pop() : "@JFeedNews",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: canonicalUrl,
      ...(currentPage > 1 && {
        prev: authorUrl + (currentPage > 2 ? `?page=${currentPage - 1}` : ""),
      }),
    },
  };
}

export function generateAuthorStructuredData(
  author: Author,
  articles: Article[]
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const authorUrl = `${baseUrl}/authors/${author.slug}`;

  // Enhanced person structured data
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${authorUrl}#person`,
    name: author.name,
    description: author.bio,
    image: {
      "@type": "ImageObject",
      url: author.image || `${baseUrl}/logo/jfeed-logo_512x512.png`,
      width: 512,
      height: 512,
    },
    jobTitle: author.role,
    url: authorUrl,
    worksFor: {
      "@type": "Organization",
      name: "JFeed Israel News",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/jfeed-logo_512x512.png`,
        width: 512,
        height: 512,
      },
    },
    sameAs: [author.twitter, author.facebook, author.wikipedia].filter(Boolean),
    email: author.email,
  };

  // Enhanced webpage structured data
  const webpageData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${authorUrl}#webpage`,
    url: authorUrl,
    name: `${author.name} - JFeed Israel News Author`,
    description:
      author.bio || `Articles by ${author.name} on JFeed - Israel News`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "JFeed Israel News",
      url: baseUrl,
    },
    about: {
      "@id": `${authorUrl}#person`,
    },
    primaryImageOfPage: author.image
      ? {
          "@type": "ImageObject",
          url: author.image,
          width: 512,
          height: 512,
        }
      : undefined,
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
          "@id": `${baseUrl}/authors`,
          name: "Authors",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": authorUrl,
          name: author.name,
        },
      },
    ],
  };

  // Enhanced article list structured data
  const articleListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: article.title,
        description: article.subTitle || article.titleShort,
        url: `${baseUrl}/${article.categorySlug}/${article.slug}`,
        datePublished: new Date(article.time * 1000).toISOString(),
        dateModified: article.lastUpdate
          ? new Date(article.lastUpdate * 1000).toISOString()
          : new Date(article.time * 1000).toISOString(),
        author: {
          "@type": "Person",
          "@id": `${authorUrl}#person`,
          name: author.name,
          url: authorUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "JFeed Israel News",
          url: baseUrl,
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
  };

  // Return combined structured data
  return {
    "@context": "https://schema.org",
    "@graph": [personData, webpageData, breadcrumbData, articleListData],
  };
}
