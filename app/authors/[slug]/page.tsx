import { getAuthor, getArticlesV2 } from "@/utils/api";
import { getHomeData } from "@/utils/home-data";
import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import { Facebook, X } from "lucide-react";
import { Article } from "@/types";
import ArticleItemMain from "@/components/article-item/ArticleItemMain";
import { AsideSection } from "@/components/article-item/AsideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  generateAuthorMetadata,
  generateAuthorStructuredData,
} from "@/components/seo/author";
import Title from "@/components/Title";

const ITEMS_PER_PAGE = 20;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // First resolve params and searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  // Now we can use the resolved category to fetch category data
  const category = await getAuthor(resolvedParams.slug);

  const currentPage = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 0;

  return generateAuthorMetadata(category, currentPage);
}

async function getAuthorData(
  slug: string,
  page: number,
  existingIds: Set<number>
): Promise<{
  articles: Article[];
  hasMore: boolean;
}> {
  const articles = await getArticlesV2({
    authorSlug: slug,
    page: page,
    limit: ITEMS_PER_PAGE,
  });

  // Filter out any articles that we've already shown in homeFrontal or mostRead
  const filteredArticles = articles.filter(
    (article) => !existingIds.has(article.id)
  );

  return {
    articles: filteredArticles,
    hasMore: articles.length === ITEMS_PER_PAGE,
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // Wait for both params and searchParams to resolve
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const slug = resolvedParams.slug;
  const currentPage = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 0;

  // Get home data for the sidebar and to track seen articles
  const { homeFrontal, mostRead, seenArticleIds } = await getHomeData();

  // First get the author data
  const author = await getAuthor(slug);

  // Load author articles for current page
  const { articles, hasMore } = await getAuthorData(
    slug,
    currentPage,
    seenArticleIds
  );

  // Add these articles to seenArticleIds
  articles.forEach((article) => {
    seenArticleIds.add(article.id);
  });

  const breadcrumbs = [
    { name: "Authors", url: "/authors", isLink: false },
    { name: author.name, url: `/authors/${slug}`, isLink: false },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateAuthorStructuredData(author, articles)
          ),
        }}
      />
      <Breadcrumbs items={breadcrumbs} />
      <hr className="my-3" />
      <main className="container mx-auto">
        {/* Author Header */}
        <div>
          <div className="flex md:gap-4 flex-col items-center md:flex-row  gap-3 ">
            {/* Author Image */}
            {author.image && (
              <div className="flex-shrink-0">
                <Image
                  src={author.image}
                  alt={author.name}
                  title={author.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}

            {/* Author Info */}
            <div className="flex-grow">
              <Title
                title={author.name}
                className="text-3xl font-bold capitalize"
                tag="h1"
              />
              {author.role && (
                <p className="text-gray-600 text-lg mb-4">{author.role}</p>
              )}
              {author.bio && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {author.bio}
                </p>
              )}

              {/* Social Links */}
              <div className="flex gap-4">
                {author.twitter && (
                  <Link
                    href={author.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    <Image
                      src="/icons/x.svg"
                      alt="Twitter"
                      width={25}
                      height={25}
                    />
                  </Link>
                )}
                {author.facebook && (
                  <Link
                    href={author.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Image
                      src="/icons/facebook.svg"
                      alt="Facebook"
                      width={25}
                      height={25}
                      className="rounded-sm p-1"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-3" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 md:gap-4">
          <div className="col-span-12 lg:col-span-8">
            {articles && articles.length > 0 ? (
              <>
                {/* First article using ArticleItemBig */}
                <div className="mb-8">
                  <ArticleItemMain article={articles[0]} withSubTitle={true} />
                </div>

                {/* Remaining articles */}
                <div className="space-y-4">
                  {articles?.slice(1).map((article) => (
                    <ArticleItemFullWidth key={article.id} article={article} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={
                        currentPage * ITEMS_PER_PAGE +
                        (hasMore ? ITEMS_PER_PAGE : 0)
                      }
                      itemsPerPage={ITEMS_PER_PAGE}
                      baseUrl={`/authors/${slug}`}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  No articles found by this author.
                </p>
              </div>
            )}
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
    </>
  );
}
