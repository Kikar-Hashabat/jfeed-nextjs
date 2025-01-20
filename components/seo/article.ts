// components/seo/article.ts
import { ArticleData } from "@/types/article";
import { getWordCount } from "@/utils/article";
import { Metadata } from "next";

export function generateArticleMetadata(
  article: ArticleData,
  isRedirectPage: boolean = false
): Metadata {
  // Extract the first paragraph of content for description
  const firstParagraph = article.content.content.find(
    (block) => block.type === "html"
  )?.content[0];

  const description = firstParagraph || article.subTitle || article.title;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${article.categories[0]?.slug}/${article.slug}`;

  return {
    title: article.titleShort || article.title,
    description:
      typeof description === "string" ? description.slice(0, 160) : "",
    openGraph: {
      type: "article",
      title: article.title,
      description: typeof description === "string" ? description : "",
      url: canonicalUrl,
      images: article.image
        ? [
            {
              url: article.image.src,
              width: article.image.width,
              height: article.image.height,
              alt: article.image.alt,
            },
          ]
        : undefined,
      publishedTime: new Date(article.time).toISOString(),
      modifiedTime: article.lastUpdate
        ? new Date(article.lastUpdate).toISOString()
        : undefined,
      authors: [article.author.name],
      section: article.categories[0]?.name,
      tags: article.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: article.titleShort || article.title,
      description: typeof description === "string" ? description : "",
      images: article.image ? [article.image.src] : undefined,
      creator: article.author.twitter
        ? article.author.twitter.split("/").pop()
        : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    // Add robots directives for redirect pages
    robots: {
      index: !isRedirectPage,
      follow: true,
    },
  };
}

export function generateArticleStructuredData(article: ArticleData) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.subTitle,
    image: article.image ? [article.image.src] : undefined,
    datePublished: new Date(article.time).toISOString(),
    dateModified: article.lastUpdate
      ? new Date(article.lastUpdate).toISOString()
      : new Date(article.time).toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "JFeed",
      logo: {
        "@type": "ImageObject",
        url: `/logo/jfeed-new.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/${article.categories[0]?.slug}/${article.slug}`,
    },
    articleSection: article.categories[0]?.name,
    keywords: article.tags.map((tag) => tag.name).join(", "),
  };

  // Add read time estimation
  const wordCount = getWordCount(article.content.content);

  return {
    ...articleData,
    wordCount,
    timeRequired: `PT${Math.ceil(wordCount / 200)}M`,
  };
}

// Returns breadcrumb structured data for the article
export function generateBreadcrumbStructuredData(article: ArticleData) {
  const items = [];
  const baseUrl = "https://www.jfeed.com";

  // Add home
  items.push({
    "@type": "ListItem",
    position: 1,
    name: "Home",
    item: baseUrl,
  });

  // Add parent categories
  if (article.categories[0]?.parents) {
    article.categories[0].parents.forEach((parent, index) => {
      items.push({
        "@type": "ListItem",
        position: index + 2,
        name: parent.name,
        item: `${baseUrl}/${parent.slug}`,
      });
    });
  }

  // Add current category
  if (article.categories[0]) {
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: article.categories[0].name,
      item: `${baseUrl}/${article.categories[0].slug}`,
    });
  }

  // Add current article
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: article.title,
    item: `${baseUrl}/${article.categories[0]?.slug}/${article.slug}`,
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
