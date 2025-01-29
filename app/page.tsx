import React, { memo } from "react";
import { Metadata } from "next";
import { getHomeData, getCategoryArticles } from "@/utils/home-data";
import { HomeMainContent } from "@/types";
import { generateHomePageSchema } from "@/components/seo/metadata";
import {
  ArticleItemFullWidth,
  AsideWithBorder,
  CategoryHeader,
  CategorySection,
  MainArticle,
  MobileLatestNews,
} from "@/components/article-layouts/Categorylayout";
import ScrollArticles from "@/components/article-layouts/ScrollArticles";
import AboutUsHome from "@/components/pages/home/AboutUsHome";

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

  const categorizedArticles = await Promise.all(
    categoryContentItems.map(async (content: HomeMainContent) => {
      if (content.handlerType === "category") {
        const categoryArticles = await getCategoryArticles(
          content.category.slug,
          seenArticleIds
        );
        categoryArticles.forEach((article) => seenArticleIds.add(article.id));
        return {
          [content.category.slug]: {
            title: content.category.name,
            slug: content.category.slug,
            articles: categoryArticles,
          },
        };
      }
      return {
        [content.category.slug]: {
          title: content.category.name,
          slug: content.category.slug,
          articles: [],
        },
      };
    })
  ).then((results) => Object.assign({}, ...results));

  const categories = Object.keys(categorizedArticles);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomePageSchema()),
        }}
      />
      <main>
        <div className="max-w-7xl mx-auto md:px-4">
          {/* Main content with asides */}
          <div className="flex flex-col md:flex-row gap-6 md:py-8">
            {/* Left content container */}
            <div className="flex-1">
              <div className="md:grid grid-cols-1 md:grid-cols-9 gap-6">
                {/* Left Aside */}
                <div className="md:col-span-3">
                  <div className="mb-6 hidden md:block">
                    <AsideWithBorder
                      articles={homeFrontal.slice(0, 6)}
                      withImage={false}
                      title="Latest News"
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
              </div>
            </div>

            {/* Right Aside container */}
            <div className="md:w-1/4 hidden lg:block">
              {/* First Right Aside */}
              <div className="mb-6">
                <AsideWithBorder
                  articles={mostCommented}
                  withImage={true}
                  title="Most Talked"
                />
              </div>

              {/* Second Right Aside */}
              <div className="mb-6">
                <AsideWithBorder
                  articles={homeFrontal.slice(0, 3)}
                  withImage={true}
                  title="Editor's Pick"
                />
              </div>
            </div>
          </div>

          {/* Categories with rotating styles */}
          {categories.map((category, index) => (
            <React.Fragment key={category}>
              <CategorySection
                style={(index % 3) + 1}
                category={category}
                articles={categorizedArticles[category]?.articles}
                index={index}
              />
              {index === 1 && (
                <div className="w-screen relative left-[50%] right-[50%] mx-[-50vw] bg-[#157BC3] mt-4">
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
              )}
            </React.Fragment>
          ))}
        </div>

        <AboutUsHome />
      </main>
    </>
  );
}

export default memo(Home);
