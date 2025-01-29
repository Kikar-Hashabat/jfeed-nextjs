import React, { memo } from "react";
import { Metadata } from "next";
import { getHomeData, getCategoryArticles } from "@/utils/home-data";
import { Article, HomeMainContent } from "@/types";
import { generateHomePageSchema } from "@/components/seo/metadata";
import {
  ArticleCard,
  ArticleItemFullWidth,
  AsideWithBorder,
  CategoryHeader,
  CategoryLeftImage,
  MainArticle,
  MobileLatestNews,
  SpotlightMain,
} from "@/components/article-layouts/Categorylayout";
import ScrollArticles from "@/components/article-layouts/ScrollArticles";
import ArticleLayout from "@/components/article-layouts/ArticleLayout";
import {
  ArticleLayoutOne,
  ArticleLayoutOneMobile,
} from "@/components/article-layouts/ArticleLayoutOne";
import MainCategory from "@/components/article-layouts/MainCategory";
import AsideMore from "@/components/article-layouts/AsideMore";
import AboutUsHome from "@/components/pages/home/AboutUsHome";

interface CategorySectionProps {
  style: number;
  category: string;
  articles: Article[];
  index: number; // Add this
}

interface VideoSectionProps {
  articles: Article[];
}

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

const VideoSection: React.FC<VideoSectionProps> = ({ articles }) => (
  <div className="w-screen relative left-[50%] right-[50%] mx-[-50vw] bg-[#157BC3] mt-4">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <CategoryHeader
        title="top videos"
        seeMoreText="see more"
        iconSrc="/icons/right.svg"
        color="green-500"
      />
      <div className="grid grid-cols-1 gap-6 mt-3">
        <ScrollArticles articles={articles} />
      </div>
    </div>
  </div>
);

const CategorySection: React.FC<CategorySectionProps> = ({
  style,
  category,
  articles,
  index,
}) => {
  if (index === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1">
            <div className="w-full mt-6 px-4 md:px-0">
              <CategoryHeader
                title={category}
                seeMoreText="see more"
                iconSrc="/icons/right.svg"
                color="red-700"
              />
              <div className="hidden md:grid grid-cols-1 gap-6 mt-3">
                <ArticleLayoutOne articles={articles || []} withImage={false} />
              </div>
              <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
                <ArticleLayoutOneMobile
                  articles={articles?.slice(0, 4) || []}
                />
                <ArticleCard
                  articles={articles?.slice(3, 8) || []}
                  withImage={false}
                />
              </div>
            </div>
          </div>

          {/* Right aside */}
          <div className="md:w-1/4 hidden md:block">
            <div className="mb-6">
              <AsideWithBorder
                articles={articles?.slice(0, 6) || []}
                withImage={true}
                title="More from this category"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Style 1: News style layout

  if (style === 1) {
    return (
      <div className="w-full mt-6 px-4 md:px-0">
        <CategoryHeader
          title={category}
          seeMoreText="see more"
          iconSrc="/icons/right.svg"
          color="red-700"
        />
        <div className="hidden md:grid grid-cols-1 gap-6 mt-3">
          <ArticleLayoutOne articles={articles || []} withImage={false} />
        </div>
        <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
          <ArticleLayoutOneMobile articles={articles?.slice(0, 4) || []} />
          <ArticleCard
            articles={articles?.slice(3, 8) || []}
            withImage={false}
          />
        </div>
      </div>
    );
  }

  // Style 2: Jewish World style layout
  if (style === 2) {
    return (
      <div className="w-full mt-6 px-4 md:px-0">
        <CategoryHeader
          title={category}
          seeMoreText="see more"
          iconSrc="/icons/right.svg"
          color="red-700"
        />
        <div className="grid-cols-1 gap-6 mt-3 hidden md:grid">
          <div className="flex gap-8">
            <div className="flex-1">
              <MainCategory article={articles?.[0]} />
              <section className="grid grid-cols-3 gap-4">
                {articles?.slice(1, 4).map((article) => (
                  <ArticleLayout key={article.id} article={article} />
                ))}
              </section>
            </div>
            <div className="w-72">
              <AsideMore
                articles={articles?.slice(4, 8) || []}
                withImage={true}
                title="MORE"
              />
            </div>
          </div>
        </div>
        <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
          <ArticleCard
            articles={articles?.slice(0, 1) || []}
            withImage={true}
          />
          <ArticleCard
            articles={articles?.slice(1, 6) || []}
            withImage={false}
          />
        </div>
      </div>
    );
  }

  // Style 3: Spotlight style layout
  return (
    <div className="w-full mt-6">
      <CategoryHeader
        title={category}
        seeMoreText="see more"
        iconSrc="/icons/right.svg"
        color="red-700"
      />
      <div className="grid-cols-1 gap-6 mt-3 hidden md:grid">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <SpotlightMain article={articles?.[0]} />
            </div>
            <div className="w-[40%]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {articles?.slice(0, 2).map((article) => (
                  <ArticleCard
                    key={article.id}
                    articles={[article]}
                    withImage={true}
                  />
                ))}
              </div>
              <div>
                <ArticleCard
                  articles={articles?.slice(0, 3) || []}
                  withImage={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
        <ArticleCard articles={articles?.slice(0, 1) || []} withImage={true} />
        <CategoryLeftImage articles={articles?.slice(0, 2) || []} />
        <ArticleCard articles={articles?.slice(0, 2) || []} withImage={false} />
      </div>
    </div>
  );
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
            <div className="md:w-1/4 hidden md:block">
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
                index={index} // Add this prop
              />
              {index === 1 && <VideoSection articles={homeFrontal} />}
            </React.Fragment>
          ))}
        </div>

        <AboutUsHome />
      </main>
    </>
  );
}

export default memo(Home);
