import { memo } from "react";
import { Metadata } from "next";
import { getHomeData, getCategoryArticles } from "@/utils/home-data";
import { HomeMainContent } from "@/types";
import MainArticle from "@/components/pages/home/MainArticle";
import { CategorySection } from "@/components/pages/home/CategorySection";
import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import Aside from "@/components/article-item/Aside";
import AboutUsHome from "@/components/pages/home/AboutUsHome";
import { generateHomePageSchema } from "@/components/seo/metadata";
import { AsideSection } from "@/components/article-item/AsideSection";
import MainAr from "@/components/pages/home/Main";
import { CategoryHeader } from "@/components/CategoryHeader";
import AsideCategory from "@/components/article-item/AsideCategory";

export const metadata: Metadata = {
  title: "JFeed - Israel News",
  description:
    "JFEED - the latest news and headlines from Israel and the Jewish world",
  robots: { index: true, follow: true },
  openGraph: {
    title: "JFeed - Israel News",
    description: "Latest news from Israel and the Jewish world",
    url: process.env.NEXT_PUBLIC_WEBSITE_URL,
    siteName: "JFeed",
    images: [
      {
        url: "https://www.jfeed.com/logo/jfeed-logo_512.png",
        width: 512,
        height: 512,
        alt: "JFeed Logo",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://www.jfeed.com",
    types: {
      "application/rss+xml":
        "https://www.jfeed.com/v1/rss/articles/latest/rss2",
    },
  },
};

async function Home() {
  const {
    homeFrontal,
    mostRead,
    mostCommented,
    homeMainContent,
    seenArticleIds,
  } = await getHomeData({ includeMainContent: true });

  const categoryContentItems =
    homeMainContent?.filter(
      (content: HomeMainContent) => content.handlerType === "category"
    ) || [];

  const homeCategoriesArticles = await Promise.all(
    categoryContentItems.map(async (content: HomeMainContent) => {
      if (content.handlerType === "category") {
        const categoryArticles = await getCategoryArticles(
          content.category.slug,
          seenArticleIds
        );
        categoryArticles.forEach((article) => seenArticleIds.add(article.id));
        return { category: content.category, articles: categoryArticles };
      }
      return { category: content.category, articles: [] };
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomePageSchema()),
        }}
      />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 py-8">
          {/* Left content container */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
              {/* Left Aside */}
              <div className="md:col-span-3">
                <div className="mb-6">
                  <Aside
                    articles={mostRead}
                    withImage={false}
                    title="Latest News"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-6 mt-6">
                <MainAr article={homeFrontal[0]} />
              </div>

              {/* Green div under main and left aside */}
              <div className="md:col-span-9 bg-green-300 h-6 w-full"></div>

              {/* Additional articles under green div */}
              <div className="md:col-span-9">
                {homeFrontal?.slice(1).map((article) => (
                  <ArticleItemFullWidth key={article.id} article={article} />
                ))}
              </div>

              {/* News Category div */}
              <div className="md:col-span-9 mt-6">
                <CategoryHeader
                  title="news"
                  seeMoreText="see more"
                  iconSrc="/icons/right.svg"
                />
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <AsideCategory
                    articles={mostRead}
                    layout="one"
                    withImage={true}
                    title="news"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Aside container - separate from main grid */}
          <div className="md:w-1/4">
            {/* First Right Aside */}
            <div className="mb-6">
              <Aside articles={mostRead} withImage={true} title="Most Talked" />
            </div>

            {/* Second Right Aside */}
            <div className="mb-6">
              <Aside
                articles={mostRead}
                withImage={true}
                title="Editor's Pick"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="min-h-screen">
        <MainArticle article={homeFrontal[0]} />

        <div className="grid grid-cols-12 md:gap-4 mt-6">
          <section
            className="col-span-12 lg:col-span-8"
            aria-label="Featured Articles"
          >
            <div className="space-y-4">
              {homeFrontal?.slice(1).map((article) => (
                <ArticleItemFullWidth key={article.id} article={article} />
              ))}
            </div>

            <div className="space-y-8 mt-8">
              {homeCategoriesArticles.map(
                (categoryArticles) =>
                  categoryArticles && (
                    <CategorySection
                      key={categoryArticles.category.slug}
                      title={categoryArticles.category.name}
                      link={categoryArticles.category?.slug}
                      articles={categoryArticles.articles}
                    />
                  )
              )}
            </div>
          </section>

          <aside
            className="hidden lg:block col-span-4"
            aria-label="Popular Articles"
          >
            <div className="sticky top-20 space-y-8">
              {mostCommented.length > 0 && (
                <AsideSection articles={mostCommented} title="Most Talked" />
              )}
              {mostRead.length > 0 && (
                <AsideSection articles={mostRead} title="Most Read" />
              )}
            </div>
          </aside>
        </div>

        <AboutUsHome />
      </main>
    </>
  );
}

export default memo(Home);
