import { Metadata } from "next";
import { Category } from "@/types/category";
import { CategoryWithArticles } from "@/types/category";
import { Article } from "@/types";

interface CategoryStructuredData {
  category: {
    "@context": "https://schema.org";
    "@type": "CollectionPage";
    "@id": string;
    name: string;
    description: string;
    url: string;
    isPartOf: {
      "@type": "WebSite";
      "@id": string;
      name: string;
      url: string;
    };
  };
  breadcrumb: {
    "@context": "https://schema.org";
    "@type": "BreadcrumbList";
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      item: {
        "@id": string;
        name: string;
      };
    }>;
  };
  recipeList?: {
    "@context": "https://schema.org";
    "@type": "ItemList";
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      url: string;
    }>;
  };
}

export function generateCategoryMetadata(
  category: Category,
  currentPage: number
): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";
  const isFirstPage = currentPage === 1;
  const categoryUrl = `${baseUrl}/${category.slug}`;
  const canonicalUrl = isFirstPage
    ? categoryUrl
    : `${categoryUrl}?page=${currentPage}`;

  const title = isFirstPage
    ? category.metaTitle || category.title
    : `${category.metaTitle || category.title} - Page ${currentPage}`;

  return {
    title: {
      absolute: `${title} - JFeed Israel News`,
    },
    description: category.metaDescription || `Latest news and articles from ${category.name}`,
    keywords: category.metaKeywords,
    openGraph: {
      title: category.title,
      description: category.metaDescription,
      url: canonicalUrl,
      siteName: "JFeed",
      images: category.image
        ? [
            {
              url: category.image,
              width: 512,
              height: 512,
              alt: `${category.name} category image`,
            },
          ]
        : [
            {
              url: "https://www.jfeed.com/logo/jfeed-logo_512.png",
              width: 512,
              height: 512,
              alt: "JFeed Logo",
            },
          ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description: category.metaDescription,
      images: category.image
        ? [category.image]
        : ["https://www.jfeed.com/logo/jfeed-logo_512.png"],
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
        prev: categoryUrl + (currentPage > 2 ? `?page=${currentPage - 1}` : ""),
      }),
    },
  } satisfies Metadata;
}

export function generateCategoryStructuredData(
  category: Category,
  articles: Article[]
): CategoryStructuredData {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.jfeed.com";

  // Category page data
  const categoryData: CategoryStructuredData["category"] = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/${category.slug}`,
    name: category.title || category.name,
    description:
      category.metaDescription ||
      `Latest news and articles from ${category.name}`,
    url: `${baseUrl}/${category.slug}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "JFeed",
      url: baseUrl,
    },
  };

  // Breadcrumb data
  const breadcrumbItems = [
    {
      "@type": "ListItem" as const,
      position: 1,
      item: {
        "@id": baseUrl,
        name: "Home",
      },
    },
  ];

  if (category.parents) {
    category.parents.forEach((parent, index) => {
      breadcrumbItems.push({
        "@type": "ListItem" as const,
        position: index + 2,
        item: {
          "@id": `${baseUrl}/${parent.slug}`,
          name: parent.name,
        },
      });
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem" as const,
    position: breadcrumbItems.length + 1,
    item: {
      "@id": `${baseUrl}/${category.slug}`,
      name: category.name,
    },
  });

  const recipeArticles = articles
    .filter((article) => article.props?.includes("recipe"))
    .map((article, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      url: `${baseUrl}/${article.categorySlug}/${article.slug}`,
    }));

  const structuredData: CategoryStructuredData = {
    category: categoryData,
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    },
  };

  if (recipeArticles.length > 1) {
    structuredData.recipeList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: recipeArticles,
    };
  }

  return structuredData;
}

export async function getCategoryWithSubArticles(
  category: Category,
  existingIds: Set<number>,
  currentPage: number,
  ITEMS_PER_PAGE: number,
  MAIN_ARTICLES_COUNT: number,
  SUBCATEGORY_ARTICLES_COUNT: number,
  articles: Article[],
  subCategoryArticles: Record<string, Article[]>
): Promise<CategoryWithArticles> {
  // If there are no subcategories, handle main category articles
  if (!category.subCategories || category.subCategories.length === 0) {
    // Filter out already seen articles
    const filteredArticles = articles.filter(
      (article) => !existingIds.has(article.id)
    );

    // Add filtered articles to seen IDs
    filteredArticles.forEach((article) => existingIds.add(article.id));

    return {
      mainArticles: filteredArticles,
      subCategoriesWithArticles: [],
      hasMore: articles.length === ITEMS_PER_PAGE,
    };
  }

  // Handle main category articles
  const filteredMainArticles = articles
    .filter((article) => !existingIds.has(article.id))
    .slice(0, MAIN_ARTICLES_COUNT);

  // Add main articles to seen IDs
  filteredMainArticles.forEach((article) => existingIds.add(article.id));

  // Process subcategories
  const subCategoriesWithArticles = await Promise.all(
    category.subCategories.map(async (subCategory) => {
      const subCategoryArticlesList =
        subCategoryArticles[subCategory.slug] || [];
      const newUniqueArticles = subCategoryArticlesList.filter(
        (article) => !existingIds.has(article.id)
      );

      const finalArticles = newUniqueArticles.slice(
        0,
        SUBCATEGORY_ARTICLES_COUNT
      );
      finalArticles.forEach((article) => existingIds.add(article.id));

      return {
        ...subCategory,
        articles: finalArticles,
      };
    })
  );

  return {
    mainArticles: filteredMainArticles,
    subCategoriesWithArticles,
    hasMore: false,
  };
}
