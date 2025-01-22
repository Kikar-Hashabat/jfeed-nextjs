import { getTag, getArticlesV2 } from "@/utils/api";
import Pagination from "@/components/Pagination";
import { getHomeData } from "@/utils/home-data";
import { Article } from "@/types";
import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import ArticleItemMain from "@/components/article-item/ArticleItemMain";
import Image from "next/image";
import { AsideSection } from "@/components/article-item/AsideSection";
import {
  generateTagMetadata,
  generateTagStructuredData,
} from "@/components/seo/tag";
import Breadcrumbs from "@/components/Breadcrumbs";
import Title from "@/components/Title";

const ITEMS_PER_PAGE = 20;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const category = await getTag(resolvedParams.slug);

  const currentPage = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;

  return generateTagMetadata(category, currentPage);
}

async function getTagData(
  tagId: string,
  page: number,
  existingIds: Set<number>
): Promise<{
  articles: Article[];
  hasMore: boolean;
}> {
  const articles = await getArticlesV2({
    tagId,
    limit: ITEMS_PER_PAGE,
    page: page - 1,
  });

  // If we have only one article, return it regardless of whether it exists elsewhere
  if (articles.length === 1) {
    return {
      articles,
      hasMore: false,
    };
  }

  // For multiple articles, filter out duplicates but ensure we keep at least one
  const filteredArticles = articles.filter(
    (article, index) => index === 0 || !existingIds.has(article.id)
  );

  return {
    articles: filteredArticles,
    hasMore: articles.length === ITEMS_PER_PAGE,
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const slug = resolvedParams.slug;
  const currentPage = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;

  const tag = await getTag(slug);
  const { homeFrontal, mostRead, seenArticleIds } = await getHomeData();
  const { articles, hasMore } = await getTagData(
    tag.id.toString(),
    currentPage,
    seenArticleIds
  );

  articles.forEach((article) => {
    seenArticleIds.add(article.id);
  });

  const breadcrumbs = [{ name: tag.name, url: `/tags/${slug}`, isLink: false }];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateTagStructuredData(tag, articles)),
        }}
      />

      <main className="container mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        <hr className="my-3" />

        <div className="mb-3">
          <Title
            title={tag.title || tag.name}
            className="text-3xl font-bold capitalize"
            tag="h1"
          />
          {tag.subtitle && (
            <p className="text-lg text-gray-700 my-4 text-center font-semibold">
              {tag.subtitle}
            </p>
          )}
          {tag.description && (
            <p className="text-gray-600 mb-4">{tag.description}</p>
          )}
          {tag.imageSrc && (
            <Image
              src={tag.imageSrc}
              alt={tag.name}
              title={tag.name}
              width={120}
              height={120}
              className="w-auto h-32 rounded-lg mb-4 object-contain border border-gray-200 p-3"
            />
          )}
        </div>

        {tag.content && tag.content.length > 0 && (
          <div className="space-y-6">
            {tag.content.map((block, index) => {
              if (block.type === "paragraph") {
                return (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {block.children.map((child, childIndex) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </p>
                );
              }
              return null;
            })}
          </div>
        )}

        {tag.content && <hr className="my-3" />}

        <div className="grid grid-cols-12 md:gap-4">
          <div className="col-span-12 lg:col-span-8">
            {articles && articles.length > 0 ? (
              <>
                {/* Display the first/only article using ArticleItemMain */}
                <ArticleItemMain article={articles[0]} withSubTitle />

                {/* Only render additional articles section if there are more than one article */}
                {articles.length > 1 && (
                  <div className="space-y-4 mt-8">
                    {articles.slice(1).map((article) => (
                      <ArticleItemFullWidth
                        key={article.id}
                        article={article}
                        withSubTitle
                      />
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={
                        currentPage * ITEMS_PER_PAGE +
                        (hasMore ? ITEMS_PER_PAGE : 0)
                      }
                      itemsPerPage={ITEMS_PER_PAGE}
                      baseUrl={`/tags/${slug}`}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No articles found for this tag.</p>
              </div>
            )}
          </div>

          <aside className="hidden lg:block col-span-4">
            <div className="sticky top-20 space-y-8">
              <AsideSection articles={homeFrontal} title="Top Stories" />
              <AsideSection articles={mostRead} title="Most Read" />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
