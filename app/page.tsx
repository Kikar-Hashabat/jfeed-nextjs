import { memo } from "react";
import { Metadata } from "next";
import { getHomeData, getCategoryArticles } from "@/utils/home-data";
import { HomeMainContent } from "@/types";
import { generateHomePageSchema } from "@/components/seo/metadata";
import CategoryLayout, {
  ArticleItemFullWidth,
  CategoryHeader,
  MainArticle,
  MobileLatestNews,
} from "@/components/article-layouts/Categorylayout";
import ScrollArticles from "@/components/article-layouts/ScrollArticles";
import ArticleLayout from "@/components/article-layouts/ArticleLayout";
import { OptimizedImage } from "@/components/OptimizedImage";
import Link from "next/link";

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
                  <section className="grid grid-cols-1 gap-4">
                    {homeFrontal.slice(0, 6).map((article) => (
                      <Link
                        href={`/${article.categorySlug}/${article.slug}`}
                        key={article.id}
                        className="group flex"
                      >
                        <div className="">
                          {article.image?.src && (
                            <div className="relative aspect-[1.74] w-full overflow-hidden">
                              <OptimizedImage
                                src={article.image.src}
                                alt={article.image.alt || ""}
                                fill
                                sizes="(max-width: 768px) 160px, 260px"
                                className="object-cover rounded"
                              />
                            </div>
                          )}

                          <h3 className="text-base font-bold">
                            {article.titleShort || article.title}
                          </h3>

                          <div className="flex items-center text-xs text-zinc-400 uppercase">
                            <time
                              dateTime={new Date(article.time).toISOString()}
                            >
                              {new Date(article.time).toLocaleDateString(
                                "de-DE"
                              )}
                            </time>
                            {article.categorySlug && (
                              <>
                                <span className="mx-2">|</span>
                                <span>{article.categorySlug}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Right Aside container */}
          <div className="md:w-1/4">
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
        <div className="w-full mt-6">
          <CategoryHeader
            title="jewish-world"
            seeMoreText="see more"
            iconSrc="/icons/right.svg"
            color="red-700"
          />
          <div className="grid grid-cols-1 gap-6 mt-3">
            <CategoryLayout
              articles={mostRead.slice(0, 4)}
              title="jewish-world"
              withImage={true}
              hasMore={true}
            />
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
    </>
  );
}

export default memo(Home);
