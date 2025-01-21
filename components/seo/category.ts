import { Article, Category } from "@/types";
import { Metadata } from "next";

export function generateCategoryStructuredData(
  category: Category,
  articles: Article[]
) {
  const categoryData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://www.jfeed.com/${category.slug}`,
    name: category.title,
    description:
      category.metaDescription ||
      `Latest news and articles from ${category.name}`,
    url: `https://www.jfeed.com/${category.slug}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `https://www.jfeed.com/#website`,
      name: "JFeed",
      url: process.env.NEXT_PUBLIC_WEBSITE_URL,
    },
  };

  // Generate Breadcrumb List
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@id": process.env.NEXT_PUBLIC_WEBSITE_URL,
        name: "Home",
      },
    },
    ...category.parents.map((parent, index) => ({
      "@type": "ListItem",
      position: index + 2,
      item: {
        "@id": `https://www.jfeed.com/${parent.slug}`,
        name: parent.name,
      },
    })),
    {
      "@type": "ListItem",
      position: category.parents.length + 2,
      item: {
        "@id": `https://www.jfeed.com/${category.slug}`,
        name: category.name,
      },
    },
  ];

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
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
        url: `https://www.jfeed.com/${article.categorySlug}/${article.slug}`,
        datePublished: new Date(article.time * 1000).toISOString(),
        dateModified: article.lastUpdate
          ? new Date(article.lastUpdate * 1000).toISOString()
          : new Date(article.time * 1000).toISOString(),
        image: article.image?.src,
        author: article.author,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [categoryData, breadcrumbData, itemListData],
  };
}

export function generateCategoryMetadata(
  category: Category,
  currentPage: number
): Metadata {
  const isFirstPage = currentPage === 1;
  const baseUrl = `https://www.jfeed.com/${category.slug}`;
  const canonicalUrl = isFirstPage ? baseUrl : `${baseUrl}?page=${currentPage}`;

  const title = isFirstPage
    ? `${category.metaTitle || category.title}`
    : `${category.metaTitle || category.title} - Page ${currentPage}`;

  const description =
    category.metaDescription ||
    `Latest news and updates from ${category.name}. Stay informed with JFeed's comprehensive coverage of ${category.title}.`;

  return {
    title,
    description,
    keywords: category.metaKeywords,
    openGraph: {
      title: category.title,
      description,
      url: canonicalUrl,
      siteName: "JFeed",
      images: [
        {
          url: category.image || "/logo/jfeed-logo_512x512.png",
          width: 512,
          height: 512,
          alt: `${category.name} category image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description,
      images: [category.image || "/logo/jfeed-logo_512x512.png"],
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
    ...(currentPage > 1 && {
      prev: baseUrl + (currentPage > 2 ? `?page=${currentPage - 1}` : ""),
    }),
  };
}
