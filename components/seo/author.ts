import { Metadata } from "next";
import { Author, Article } from "@/types";

export function generateAuthorMetadata(
  author: Author,
  currentPage: number
): Metadata {
  const isFirstPage = currentPage === 1;
  const baseUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/authors/${author.slug}`;
  const canonicalUrl = isFirstPage ? baseUrl : `${baseUrl}?page=${currentPage}`;

  const title = isFirstPage
    ? `${author.name} - JFeed Author`
    : `${author.name} - Page ${currentPage} | JFeed`;

  const description = author.bio
    ? `${author.bio.slice(0, 155)}...`
    : `Read the latest articles by ${author.name} on JFeed. Stay updated with their insights and coverage on Jewish news and culture.`;

  return {
    title,
    description,
    keywords: `${author.name}, Jewish news, Jewish culture, JFeed author`,
    openGraph: {
      title: author.name,
      description,
      url: canonicalUrl,
      siteName: "JFeed",
      images: [
        {
          url: author.image || "/logo/jfeed-logo_512x512.png",
          width: 512,
          height: 512,
          alt: `${author.name}'s profile picture`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: author.name,
      description,
      images: [author.image || "/logo/jfeed-logo_512x512.png"],
      creator: author.twitter ? author.twitter.split("/").pop() : undefined,
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
    },
  };
}

export function generateAuthorStructuredData(
  author: Author,
  articles: Article[]
) {
  // Person structured data
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/authors/${author.slug}#person`,
    name: author.name,
    description: author.bio,
    image: author.image,
    jobTitle: author.role,
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/authors/${author.slug}`,
    sameAs: [
      author.twitter && author.twitter,
      author.facebook && author.facebook,
      author.wikipedia && author.wikipedia,
    ].filter(Boolean),
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
          "@id": process.env.NEXT_PUBLIC_WEBSITE_URL,
          name: "Home",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/authors`,
          name: "Authors",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/authors/${author.slug}`,
          name: author.name,
        },
      },
    ],
  };

  // Generate ItemList for articles
  const itemListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: article.title,
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${article.categorySlug}/${article.slug}`,
        datePublished: new Date(article.time * 1000).toISOString(),
        dateModified: article.lastUpdate
          ? new Date(article.lastUpdate * 1000).toISOString()
          : new Date(article.time * 1000).toISOString(),
        author: {
          "@type": "Person",
          name: author.name,
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/authors/${author.slug}`,
        },
        image: article.image?.src,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [personData, breadcrumbData, itemListData],
  };
}
