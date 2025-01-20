import { Category } from "@/types";
import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import ArticleItemMain from "@/components/article-item/ArticleItemMain";
import { AsideSection } from "@/components/article-item/AsideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getArticlesV2, getCategoryBySlug } from "@/utils/api";
import { getHomeData } from "@/utils/home-data";
import { CategorySection } from "@/components/pages/home/CategorySection";
import Pagination from "@/components/Pagination";
import Title from "@/components/Title";

const ITEMS_PER_PAGE = 20;
const SUBCATEGORY_ARTICLES_COUNT = 6;
const MAIN_ARTICLES_COUNT = 5;

async function getCategoryWithSubArticles(
  category: Category,
  existingIds: Set<number>,
  currentPage: number
) {
  // If there are no subcategories, fetch paginated articles
  if (!category.subCategories || category.subCategories.length === 0) {
    const articles = await getArticlesV2({
      categorySlug: category.slug,
      limit: ITEMS_PER_PAGE,
      page: currentPage - 1,
    });

    // Filter out already seen articles
    const filteredArticles = articles.filter(
      (article) => !existingIds.has(article.id)
    );
    filteredArticles.forEach((article) => existingIds.add(article.id));

    return {
      mainArticles: filteredArticles,
      subCategoriesWithArticles: [],
      hasMore: articles.length === ITEMS_PER_PAGE,
    };
  }

  // Fetch main category articles with a higher limit to ensure we get enough unique ones
  const mainArticles = await getArticlesV2({
    categorySlug: category.slug,
    limit: MAIN_ARTICLES_COUNT * 2, // Fetch more to ensure we have enough after filtering
  });

  // Filter and take only the first MAIN_ARTICLES_COUNT unique articles
  const filteredMainArticles = mainArticles
    .filter((article) => !existingIds.has(article.id))
    .slice(0, MAIN_ARTICLES_COUNT);

  // Add main articles to seen IDs
  filteredMainArticles.forEach((article) => existingIds.add(article.id));

  const subCategoriesWithArticles = await Promise.all(
    category.subCategories.map(async (subCategory) => {
      const allArticles = [];
      let page = 0;
      let hasMore = true;

      // Keep fetching until we have enough unique articles or no more are available
      while (allArticles.length < SUBCATEGORY_ARTICLES_COUNT && hasMore) {
        const fetchedArticles = await getArticlesV2({
          categorySlug: subCategory.slug,
          limit: SUBCATEGORY_ARTICLES_COUNT * 2, // Fetch more to account for filtering
          page: page,
        });

        // If we got fewer articles than requested, there are no more to fetch
        hasMore = fetchedArticles.length === SUBCATEGORY_ARTICLES_COUNT * 2;

        // Filter out duplicates and add new unique articles
        const newUniqueArticles = fetchedArticles.filter(
          (article) => !existingIds.has(article.id)
        );

        allArticles.push(...newUniqueArticles);
        page++;

        // Break if we've made too many attempts to prevent infinite loops
        if (page > 5) break;
      }

      // Take exactly SUBCATEGORY_ARTICLES_COUNT articles
      const finalArticles = allArticles.slice(0, SUBCATEGORY_ARTICLES_COUNT);

      // Add these articles to the seen IDs
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const categorySlug = resolvedParams.category;
  const currentPage = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;

  // Get category data and home data in parallel
  const [category, { homeFrontal, mostRead, seenArticleIds }] =
    await Promise.all([getCategoryBySlug(categorySlug), getHomeData()]);

  // Get main category articles and subcategory articles
  const { mainArticles, subCategoriesWithArticles, hasMore } =
    await getCategoryWithSubArticles(category, seenArticleIds, currentPage);

  const breadcrumbs = [];

  // Handle parent categories
  if (category.parents && category.parents.length > 0) {
    category.parents.forEach((parent) => {
      breadcrumbs.push({
        name: parent.name,
        url: `/${parent.slug}`,
        isLink: true,
      });
    });
  }

  // Add current category
  breadcrumbs.push({
    name: category.name,
    url: `/${category.slug}`,
    isLink: false,
  });

  return (
    <main className="container mx-auto">
      <Breadcrumbs items={breadcrumbs} />

      <Title
        title={category.name}
        className="text-3xl font-bold capitalize"
        tag="h1"
      />

      <hr className="my-3" />

      {category.subTitle && (
        <p className="text-gray-600 mb-8">{category.subTitle}</p>
      )}

      <div className="grid grid-cols-12 md:gap-4">
        <div className="col-span-12 lg:col-span-8">
          {mainArticles && mainArticles.length > 0 ? (
            <>
              <ArticleItemMain article={mainArticles[0]} withSubTitle />
              <div className="space-y-4">
                {mainArticles.slice(1).map((article) => (
                  <ArticleItemFullWidth
                    key={article.id}
                    article={article}
                    withSubTitle
                  />
                ))}
              </div>

              {/* Show pagination only when there are no subcategories */}
              {(!category.subCategories ||
                category.subCategories.length === 0) &&
                hasMore && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={
                        currentPage * ITEMS_PER_PAGE +
                        (hasMore ? ITEMS_PER_PAGE : 0)
                      }
                      itemsPerPage={ITEMS_PER_PAGE}
                      baseUrl={`/${categorySlug}`}
                    />
                  </div>
                )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                No articles found in this category.
              </p>
            </div>
          )}

          {/* Show subcategory articles if they exist */}
          <div className="space-y-8 mt-8">
            {subCategoriesWithArticles.map((subCategory) => (
              <CategorySection
                key={subCategory.slug}
                title={subCategory.name}
                link={subCategory.slug}
                articles={subCategory.articles}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block col-span-4">
          <div className="sticky top-20 space-y-8">
            <AsideSection articles={homeFrontal} title="Top Stories" />
            <AsideSection articles={mostRead} title="Most Read" />
          </div>
        </aside>
      </div>
    </main>
  );
}
