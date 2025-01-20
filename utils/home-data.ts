// utils/home-data.ts
import { Article, HomeMainContent } from "@/types";
import { getHomeFrontal, getHomeMainContent, getArticlesV2 } from "@/utils/api";

// Type for the return value of useHomeData
export interface HomeDataResult {
  homeFrontal: Article[];
  mostRead: Article[];
  mostCommented: Article[];
  homeMainContent?: HomeMainContent[];
  seenArticleIds: Set<number>;
}

export async function getHomeData(options?: {
  includeMainContent?: boolean;
}): Promise<HomeDataResult> {
  // Determine which promises to fetch based on options
  const promises: Promise<any>[] = [
    getHomeFrontal(),
    getArticlesV2({ mostRead: true, limit: 15, page: 0 }),
    getArticlesV2({ mostCommented: true, limit: 5, page: 0 }),
  ];

  if (options?.includeMainContent) {
    promises.push(getHomeMainContent());
  }

  // Fetch data in parallel
  const [
    homeFrontal,
    mostReadInitial,
    mostCommentedInitial,
    homeMainContent,
  ] = await Promise.all(promises);

  // Create a Set of IDs to track seen articles
  const seenArticleIds = new Set<number>();

  // Add all homeFrontal article IDs to seen set first
  homeFrontal.forEach((article: Article) => {
    seenArticleIds.add(article.id);
  });

  // Process most read section, ensuring no duplicates from homeFrontal
  const mostRead = mostReadInitial
    .filter((article: Article) => !seenArticleIds.has(article.id))
    .slice(0, 5);

  // Add most read article IDs to seen set
  mostRead.forEach((article: Article) => {
    seenArticleIds.add(article.id);
  });

  // Process most commented section, ensuring no duplicates
  const mostCommented = mostCommentedInitial
    .filter((article: Article) => !seenArticleIds.has(article.id))
    .slice(0, 5);

  // Add most commented article IDs to seen set
  mostCommented.forEach((article: Article) => {
    seenArticleIds.add(article.id);
  });

  return {
    homeFrontal,
    mostRead,
    mostCommented,
    homeMainContent,
    seenArticleIds,
  };
}

// Utility function to get category articles
export async function getCategoryArticles(
  slug: string,
  existingIds: Set<number>,
  limit: number = 6
): Promise<Article[]> {
  let allArticles: Article[] = [];
  let page = 0;
  const fetchLimit = 15; // Fetch more articles per request

  while (allArticles.length < limit) {
    const fetchedArticles = await getArticlesV2({
      categorySlug: slug,
      limit: fetchLimit,
      page,
    });

    // Filter out any articles we've seen before
    const newArticles = fetchedArticles.filter(
      (article) => !existingIds.has(article.id)
    );

    allArticles = [...allArticles, ...newArticles];

    // If we got less than the limit, there are no more articles to fetch
    if (fetchedArticles.length < fetchLimit) break;

    // Move to next page if we need more articles
    if (allArticles.length < limit) {
      page++;
    } else {
      break;
    }
  }

  // Take only the requested number of unique articles
  return allArticles.slice(0, limit);
}
