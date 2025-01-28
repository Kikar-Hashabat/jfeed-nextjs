import { memo } from "react";
import { Metadata } from "next";
import { getHomeData, getCategoryArticles } from "@/utils/home-data";
import { HomeMainContent } from "@/types";
import { generateHomePageSchema } from "@/components/seo/metadata";
import CategoryLayout, {
  ArticleCard,
  ArticleItemFullWidth,
  CategoryHeader,
  CategoryLeftImage,
  MainArticle,
  MobileLatestNews,
} from "@/components/article-layouts/Categorylayout";
import ScrollArticles from "@/components/article-layouts/ScrollArticles";
import ArticleLayout from "@/components/article-layouts/ArticleLayout";
import { OptimizedImage } from "@/components/OptimizedImage";
import Link from "next/link";
import { AsideSection } from "@/components/article-item/AsideSection";
import AboutUsHome from "@/components/pages/home/AboutUsHome";
import { CategorySection } from "@/components/pages/home/CategorySection";

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

      {/* Container */}
      <div className="max-w-7xl mx-auto md:px-4">
        {/* Main content with asides */}
        <div className="flex flex-col md:flex-row gap-6 md:py-8">
          {/* Left content container */}
          <div className="flex-1">
            <div className="md:grid grid-cols-1 md:grid-cols-9 gap-6">
              {/* Left Aside */}
              <div className="md:col-span-3">
                <div className="mb-6 hidden md:block">
                  <CategoryLayout
                    articles={homeFrontal.slice(0, 5)}
                    title="Latest News"
                    withImage={false}
                    hasMore={true}
                    type="aside-with-border"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-6 md:mt-6">
                <MainArticle article={homeFrontal[0]} />
              </div>

              {/* Green div under main and left aside */}
              <div className="md:col-span-9 bg-green-300 h-6 w-full mb-4"></div>

              {/* Additional articles under green div */}
              <div className="md:col-span-9 px-4 md:px-0">
                {homeFrontal?.slice(1).map((article) => (
                  <ArticleItemFullWidth key={article.id} article={article} />
                ))}
              </div>

              <div className="md:hidden flex flex-col items-start max-w-[400px]">
                <MobileLatestNews articles={homeFrontal.slice(1, 4)} />
              </div>

              {/* News Category div */}
              <div className="md:col-span-9 mt-3 px-4 md:px-0">
                <CategoryHeader
                  title="news"
                  seeMoreText="see more"
                  iconSrc="/icons/right.svg"
                  color="red-700"
                />
                <div className="hidden md:grid  grid-cols-1 md:grid-cols-1 gap-6 mt-3">
                  <CategoryLayout
                    articles={mostRead.slice(0, 4)}
                    title="news"
                    withImage={false}
                    hasMore={true}
                    type="spotlight-split-aside"
                  />
                </div>

                <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
                  <CategoryLeftImage articles={mostRead.slice(0, 4)} />
                  <ArticleCard articles={mostRead} withImage={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Aside container */}
          <div className="md:w-1/4 hidden md:block">
            {/* First Right Aside */}
            <div className="mb-6">
              <CategoryLayout
                articles={mostRead}
                title="Most Talked"
                withImage={true}
                hasMore={true}
                type="aside-with-border"
              />
            </div>

            {/* Second Right Aside */}
            <div className="mb-6">
              <CategoryLayout
                articles={mostRead.slice(0, 3)}
                title="Editor's Pick"
                withImage={true}
                hasMore={true}
                type="aside-with-border"
              />
            </div>
          </div>
        </div>

        {/* Full width sections */}
        {/* Sports Category */}
        <div className="w-full mt-6 px-4 md:px-0">
          <CategoryHeader
            title="jewish-world"
            seeMoreText="see more"
            iconSrc="/icons/right.svg"
            color="red-700"
          />
          <div className="grid-cols-1 gap-6 mt-3 hidden md:grid">
            <CategoryLayout
              articles={mostRead.slice(0, 4)}
              title="jewish-world"
              withImage={true}
              hasMore={true}
            />
          </div>
          <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
            <ArticleCard articles={mostRead.slice(0, 1)} withImage={true} />
            <ArticleCard articles={mostRead} withImage={false} />
          </div>
        </div>
      </div>

      {/* Technology Category - Full Width Background */}
      <div className="w-full bg-[#157BC3] mt-4">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CategoryHeader
            title="top videos"
            seeMoreText="see more"
            iconSrc="/icons/right.svg"
            color="green-500"
          />
          <div className="grid grid-cols-1 gap-6 mt-3">
            <ScrollArticles articles={homeFrontal} />
          </div>
        </div>
      </div>

      {/* Container for remaining sections */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Entertainment Category */}
        <div className="w-full mt-6">
          <CategoryHeader
            title="entertainment"
            seeMoreText="see more"
            iconSrc="/icons/right.svg"
            color="red-700"
          />
          <div className="grid grid-cols-1 gap-6 mt-3">
            <CategoryLayout
              articles={mostRead.slice(0, 4)}
              title="jewish-world"
              withImage={true}
              type="spotlight-split"
              hasMore={false}
            />
          </div>
        </div>
      </div>

      <main className="min-h-screen max-w-7xl mx-auto px-4 py-6">
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
