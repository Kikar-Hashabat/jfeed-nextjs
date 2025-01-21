"use server";
import React from "react";
import { notFound, permanentRedirect, RedirectType } from "next/navigation";
import { getArticle } from "@/utils/api";
import { getHomeData } from "@/utils/home-data";
import ArticleHeader from "@/components/pages/article/ArticleHeader";
import ArticleContent from "@/components/pages/article/ArticleContent";
import { AsideSection } from "@/components/article-item/AsideSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents from "@/components/pages/article/TableOfContents";
import {
  generateArticleMetadata,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/components/seo/article";
import Link from "next/link";
import { getWordCount } from "@/utils/article";
import Comments from "@/components/pages/article/comments/Comments";
import RelatedArticles from "@/components/pages/article/RelatedArticles";
import RelatedCategories from "@/components/pages/article/RelatedCategories";
import { OutbrainWidget } from "@/components/ads/Outbrain";

type Params = {
  slug: string;
  category: string;
};

async function checkGetArticle(params: Promise<Params>) {
  const { category, slug } = await params;

  try {
    const article = await getArticle(slug);

    const correctCategory = article?.categories[0]?.slug;

    if (correctCategory && correctCategory !== category) {
      const correctPath = `/${correctCategory}/${slug}`;
      permanentRedirect(correctPath, RedirectType.push);
    }

    return article;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest: string }).digest === "string" &&
      (error as { digest: string }).digest.includes("NEXT_REDIRECT")
    ) {
      throw error; // Let Next.js handle the redirect
    }

    console.error("Error fetching article:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, slug } = await params;

  try {
    const article = await getArticle(slug);

    if (!article?.categories?.[0]) {
      return {
        title: "Article Not Found",
        robots: { index: false, follow: true },
      };
    }

    const isRedirectPage = article.categories[0].slug !== category;
    return generateArticleMetadata(article, isRedirectPage);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Article Not Found",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  let article;
  let homeData;

  try {
    [article, homeData] = await Promise.all([
      checkGetArticle(params),
      getHomeData(),
    ]);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest: string }).digest === "string" &&
      (error as { digest: string }).digest.includes("NEXT_REDIRECT")
    ) {
      throw error; // Re-throw redirect errors
    }

    console.error("Unhandled error in ArticlePage:", error);
    notFound();
  }

  const { homeFrontal, mostRead } = homeData;

  const breadcrumbs = [
    ...(article.categories?.[0]?.parents?.map((parent) => ({
      name: parent.name,
      url: `/${parent.slug}`,
      isLink: true,
    })) || []),
    ...(article.categories?.[0]
      ? [
          {
            name: article.categories[0].name,
            url: `/${article.categories[0].slug}`,
            isLink: true,
          },
        ]
      : []),
    {
      name: article.title,
      url: `/${article.categories?.[0]?.slug}/${article.slug}`,
      isLink: false,
    },
  ];

  const wordCount = getWordCount(article.content.content);
  const readingTime = Math.ceil(wordCount / 200);

  // Structured Data
  const structuredData = {
    article: generateArticleStructuredData(article),
    breadcrumb: generateBreadcrumbStructuredData(article),
  };

  return (
    <>
      {/* Structured Data */}
      {Object.entries(structuredData).map(([key, data]) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <main className="container">
        <Breadcrumbs items={breadcrumbs} />
        <hr className="my-4" />

        <div className="grid grid-cols-12 md:gap-4">
          <article className="col-span-12 lg:col-span-8">
            <ArticleHeader
              roofTitle={article.roofTitle}
              title={article.title}
              subTitle={article.subTitle}
              author={article.author}
              publishDate={article.time}
              modifiedDate={article.lastUpdate}
              readTime={readingTime}
            />

            <TableOfContents content={article.content.content} />

            <ArticleContent content={article.content.content} />

            <footer>
              <hr className="my-3" />
              <div className="flex flex-wrap justify-center gap-2">
                {article.tags?.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
              <hr className="my-3" />
            </footer>

            <RelatedArticles
              title="Unmissable content"
              articleSlug={article.slug}
              limit={3}
              page={1}
              StartSlice={0}
              endSlice={3}
            />

            <hr className="my-3" />

            <Comments articleId={article.id} totalComments={article.comments} />

            <hr className="my-3" />

            <OutbrainWidget dataWidgetId="AR_1" />

            <RelatedArticles
              title="Also of Interest"
              articleSlug={article.slug}
              limit={3}
              page={2}
              StartSlice={3}
              endSlice={6}
            />

            <hr className="my-3" />

            {article?.categories[0] && (
              <RelatedCategories ArticleCategory={article.categories[0]} />
            )}
          </article>

          <aside className="hidden lg:block col-span-4">
            <div className="sticky top-24 space-y-8">
              <AsideSection articles={homeFrontal} title="Top Stories" />
              <AsideSection articles={mostRead} title="Most Read" />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
