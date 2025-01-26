import { Category } from "@/types/category";
import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import ArticleItemMain from "@/components/article-item/ArticleItemMain";
import { AsideSection } from "@/components/article-item/AsideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getArticlesV2, getCategoryBySlug } from "@/utils/api";
import { getHomeData } from "@/utils/home-data";
import { CategorySection } from "@/components/pages/home/CategorySection";
import Pagination from "@/components/Pagination";
import Title from "@/components/Title";
import { generateCategoryMetadata } from "@/components/seo/category";

const ITEMS_PER_PAGE = 30;
const SUBCATEGORY_ARTICLES_COUNT = 6;
const MAIN_ARTICLES_COUNT = 5;

export async function generateMetadata({
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

  try {
    const category = await getCategoryBySlug(categorySlug);
    return generateCategoryMetadata(category, currentPage);
  } catch (error) {
    console.error("Error generating category metadata:", error);
    return {
      title: "Category Not Found",
      robots: { index: false, follow: true },
    };
  }
}

async function getCategoryWithSubArticles(
  category: Category,
  existingIds: Set<number>,
  currentPage: number
) {
  // Fetch main category articles with a higher limit to ensure we get enough unique ones
  const mainArticles = await getArticlesV2({
    categorySlug: category.slug,
    limit: Math.max(MAIN_ARTICLES_COUNT * 2, 4), // Ensure at least 4 articles are fetched
  });

  // Filter and take only the unique articles
  const filteredMainArticles = mainArticles.filter(
    (article) => !existingIds.has(article.id)
  );

  console.log("filteredMainArticles", filteredMainArticles);

  // Add main articles to seen IDs
  filteredMainArticles.forEach((article) => existingIds.add(article.id));

  // If less than 4 articles, fetch more until we meet the minimum
  while (filteredMainArticles.length < 4) {
    const additionalArticles = await getArticlesV2({
      categorySlug: category.slug,
      limit: 4 - filteredMainArticles.length,
      page: currentPage,
    });

    const uniqueAdditionalArticles = additionalArticles.filter(
      (article) => !existingIds.has(article.id)
    );

    filteredMainArticles.push(...uniqueAdditionalArticles);
    uniqueAdditionalArticles.forEach((article) => existingIds.add(article.id));

    if (uniqueAdditionalArticles.length === 0) break; // No more articles available
  }

  const subCategoriesWithArticles = await Promise.all(
    category.subCategories.map(async (subCategory) => {
      const allArticles = [];
      let page = 0;
      let hasMore = true;

      while (allArticles.length < SUBCATEGORY_ARTICLES_COUNT && hasMore) {
        const fetchedArticles = await getArticlesV2({
          categorySlug: subCategory.slug,
          limit: SUBCATEGORY_ARTICLES_COUNT * 2,
          page: page,
        });

        hasMore = fetchedArticles.length === SUBCATEGORY_ARTICLES_COUNT * 2;

        const newUniqueArticles = fetchedArticles.filter(
          (article) => !existingIds.has(article.id)
        );

        allArticles.push(...newUniqueArticles);
        page++;

        if (page > 5) break;
      }

      const finalArticles = allArticles.slice(0, SUBCATEGORY_ARTICLES_COUNT);

      finalArticles.forEach((article) => existingIds.add(article.id));

      return {
        ...subCategory,
        articles: finalArticles,
      };
    })
  );

  return {
    mainArticles: filteredMainArticles.slice(0, 4), // Ensure we return at least 4 articles
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
  const [
    category,
    { homeFrontal, mostRead, seenArticleIds },
  ] = await Promise.all([getCategoryBySlug(categorySlug), getHomeData()]);

  // Get main category articles and subcategory articles
  const {
    mainArticles,
    subCategoriesWithArticles,
    hasMore,
  } = await getCategoryWithSubArticles(category, seenArticleIds, currentPage);

  console.log("mainArticles", mainArticles);

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
                  <ArticleItemFullWidth key={article.id} article={article} />
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
