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

const ITEMS_PER_PAGE = 20;

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
    : 0;

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

async function getCategoryArticles(
  category: Category,
  existingIds: Set<number>,
  currentPage: number
) {
  if (category.subCategories && category.subCategories.length > 0) {
    // Handle subcategories case
    const mainArticles = await getArticlesV2({
      categorySlug: category.slug,
      limit: 4,
    });

    const subCategoriesWithArticles = await Promise.all(
      category.subCategories.map(async (subCategory) => {
        const articles = await getArticlesV2({
          categorySlug: subCategory.slug,
          limit: 6,
        });

        return {
          ...subCategory,
          articles,
        };
      })
    );

    return {
      mainArticles,
      subCategoriesWithArticles,
      hasMore: false,
    };
  } else {
    // Handle pagination for categories without subcategories
    const articles = await getArticlesV2({
      categorySlug: category.slug,
      limit: ITEMS_PER_PAGE,
      page: currentPage,
    });

    const nextPageArticles = await getArticlesV2({
      categorySlug: category.slug,
      limit: 1,
      page: currentPage + 1,
    });

    return {
      mainArticles: articles,
      subCategoriesWithArticles: [],
      hasMore: nextPageArticles.length > 0,
    };
  }
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
    : 0;

  const [
    category,
    { homeFrontal, mostRead, seenArticleIds },
  ] = await Promise.all([getCategoryBySlug(categorySlug), getHomeData()]);

  const {
    mainArticles,
    subCategoriesWithArticles,
    hasMore,
  } = await getCategoryArticles(category, seenArticleIds, currentPage);

  const breadcrumbs = [];

  if (category.parents && category.parents.length > 0) {
    category.parents.forEach((parent) => {
      breadcrumbs.push({
        name: parent.name,
        url: `/${parent.slug}`,
        isLink: true,
      });
    });
  }

  breadcrumbs.push({
    name: category.name,
    url: `/${category.slug}`,
    isLink: false,
  });

  return (
    <main className="container mx-auto">
      <Breadcrumbs items={breadcrumbs} />

      <hr className="my-3" />

      <Title
        title={category.name}
        className="text-3xl font-bold capitalize"
        tag="h1"
      />

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

              {(!category.subCategories ||
                category.subCategories.length === 0) &&
                mainArticles.length > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage} // Keep 0-based indexing for internal handling
                      totalItems={
                        (currentPage + 1) * ITEMS_PER_PAGE + (hasMore ? 1 : 0)
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
