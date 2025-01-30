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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JFeed - Israel News",
    description: "Latest news from Israel and the Jewish world",
    images: ["https://www.jfeed.com/logo/jfeed-logo_512.png"],
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
    //mostRead,
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
      <main className="pb-8" role="main" aria-label="Home page content">
        {/* Initial content section */}
        <div className="max-w-7xl mx-auto px-4">
          {/* Main content with asides */}
          <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
            {/* Left content container */}
            <section className="flex-1" aria-label="Featured content">
              <div className="grid grid-cols-1 md:grid-cols-9 md:gap-4 lg:gap-6">
                {/* Left Aside */}
                <aside
                  className="md:col-span-3"
                  aria-label="Latest news sidebar"
                >
                  <div className="mb-4 lg:mb-6 hidden md:block">
                    <AsideWithBorder
                      articles={homeFrontal.slice(2, 7)}
                      withImage={false}
                      title="Latest News"
                    />
                  </div>
                </aside>

                {/* Main Content */}
                <div className="md:col-span-6 lg:mt-10 md:mt-10">
                  <MainArticle article={homeFrontal[0]} />
                </div>

                {/* Accent Bar */}
                <div
                  className="md:col-span-9 bg-green-300 h-6 w-full mb-4"
                  role="presentation"
                />

                {/* Additional Articles */}
                <section className="md:col-span-9" aria-label="Latest articles">
                  {homeFrontal?.slice(1).map((article) => (
                    <ArticleItemFullWidth key={article.id} article={article} />
                  ))}
                </section>

                {/* Mobile Latest News */}
                <div className="md:hidden flex flex-col items-start max-w-[400px] w-full">
                  <MobileLatestNews articles={homeFrontal.slice(1, 4)} />
                </div>
              </div>
            </section>

            {/* Right Aside container */}
            <aside
              className="md:w-1/4 hidden lg:block space-y-6"
              aria-label="Secondary content"
            >
              {/* Most Talked Articles */}
              <section aria-label="Most discussed articles">
                <AsideWithBorder
                  articles={mostCommented}
                  withImage={true}
                  withAllImages={true}
                  title="Most Talked"
                />
              </section>

              {/* Editor's Picks */}
              <section aria-label="Editor's selected articles">
                <AsideWithBorder
                  articles={homeFrontal.slice(0, 3)}
                  withImage={true}
                  title="Editor's Pick"
                />
              </section>
            </aside>
          </div>
        </div>

        {/* Category Sections with full-width video section */}
        <div>
          {categories.map((category, index) => (
            <React.Fragment key={category}>
              {/* Regular category section - contained width */}
              <div className="max-w-7xl mx-auto px-4">
                <CategorySection
                  style={(index % 3) + 1}
                  category={categorizedArticles[category]?.title || category}
                  articles={categorizedArticles[category]?.articles}
                  index={index}
                />
              </div>

              {/* Video Section after second category - full width */}
              {index === 1 && (
                <div className="w-full bg-blue-700 mt-4">
                  <section className="py-6" aria-label="Featured videos">
                    <div className="max-w-7xl mx-auto px-4">
                      <CategoryHeader
                        title="top videos"
                        seeMoreText="see more"
                        color="white"
                        scroll
                      />
                      <div className="grid grid-cols-1 gap-4 lg:gap-6 mt-4">
                        <ScrollArticles articles={homeFrontal} />
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* About Us Section */}
        <div className="max-w-7xl mx-auto px-4">
          <AboutUsHome />
        </div>
      </main>
    </>
  );
}

export default memo(Home);
