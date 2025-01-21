import { Metadata } from "next";
import { getHomeData, getCategoryArticles } from "@/utils/home-data";
import { HomeMainContent } from "@/types";
import MainArticle from "@/components/pages/home/MainArticle";
import { CategorySection } from "@/components/pages/home/CategorySection";
import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import { AsideSection } from "@/components/article-item/AsideSection";
import AboutUsHome from "@/components/pages/home/AboutUsHome";
import { generateHomePageSchema } from "@/components/seo/metadata";

export const metadata: Metadata = {
  title: "JFeed - Israel News",
  description:
    "JFEED - the latest news and headlines, news from the Jewish world and Israel, weather, TV, radio highlights and much more from across the globe.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "JFeed - Israel News",
    description:
      "JFEED - the latest news and headlines, news from the Jewish world and Israel, weather, TV, radio highlights and much more from across the globe.",
    url: process.env.NEXT_PUBLIC_WEBSITE_URL,
    siteName: "JFeed",
    images: [
      {
        url: "/logo/jfeed-logo_512x512.png",
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
      "application/rss+xml": `https://www.jfeed.com/v1/rss/articles/latest/rss2`,
    },
  },
};

export default async function Home() {
  const {
    homeFrontal,
    mostRead,
    mostCommented,
    homeMainContent,
    seenArticleIds,
  } = await getHomeData({
    includeMainContent: true,
  });

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

        categoryArticles.forEach((article) => {
          seenArticleIds.add(article.id);
        });

        return {
          category: content.category,
          articles: categoryArticles,
        };
      }
      return { category: content.category, articles: [] };
    })
  );

  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomePageSchema()),
        }}
      />
      <main>
        {/* Main Article */}
        <MainArticle article={homeFrontal[0]} />

        <div className="grid grid-cols-12 md:gap-4 mt-6">
          <div className="col-span-12 lg:col-span-8">
            {/* Featured Articles */}
            <div className="space-y-4">
              {homeFrontal?.slice(1).map((article) => (
                <ArticleItemFullWidth
                  key={article.id}
                  article={article}
                  withSubTitle
                />
              ))}
            </div>

            {/* Category Sections */}
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
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block col-span-4">
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
