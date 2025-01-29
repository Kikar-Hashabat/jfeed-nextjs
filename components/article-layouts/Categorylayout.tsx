import { Article } from "@/types";
import { OptimizedImage } from "../OptimizedImage";
import Link from "next/link";
import { memo } from "react";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

const ArticleTime = ({
  time,
  categorySlug,
  className = "",
}: {
  time: number;
  categorySlug?: string;
  className?: string;
}) => (
  <div
    className={`flex items-center text-xs text-zinc-400 uppercase ${className}`}
  >
    <time dateTime={new Date(time).toISOString()}>
      {new Date(time).toLocaleDateString("de-DE")}
    </time>
    {categorySlug && (
      <>
        <span className="mx-2">|</span>
        <span>{categorySlug}</span>
      </>
    )}
  </div>
);

const ArticleImage = ({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 160px, 260px",
  aspectRatio = "aspect-[1.74]",
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  className?: string;
}) => (
  <div
    className={`relative ${aspectRatio} w-full overflow-hidden ${className}`}
  >
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover rounded"
      priority={priority}
    />
  </div>
);

const CategoryHeader = memo(
  ({
    title,
    color = "red-700",
    seeMoreText = "see more",
    iconSrc = "/icons/right.svg",
  }: {
    title: string;
    color?: string;
    seeMoreText?: string;
    iconSrc?: string;
  }) => (
    <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-start pr-8 pb-2.5 uppercase border-b border-neutral-200 max-md:pr-5">
      <div
        className={`flex-1 shrink gap-2.5 self-stretch pl-4 text-base font-bold text-${color} whitespace-nowrap border-${color} border-l-[6px] w-[81px]`}
      >
        {title}
      </div>
      <div className="flex overflow-hidden gap-1.5 justify-center items-center pl-4 text-base font-medium leading-none border-l border-zinc-300">
        <Link
          href="/news"
          className={`flex items-center hover:text-${color} transition-colors`}
        >
          <div className="self-stretch my-auto">{seeMoreText}</div>
          <Image src={iconSrc} alt="Icon" width={20} height={20} />
        </Link>
      </div>
    </div>
  )
);

// Base Article Components
const BaseArticleCard = ({
  article,
  withImage = false,
  className = "",
  imageAspectRatio = "aspect-[1.74]",
  titleClassName = "text-base font-bold",
}: {
  article: Article;
  withImage?: boolean;
  className?: string;
  imageAspectRatio?: string;
  titleClassName?: string;
}) => (
  <Link
    href={`/${article.categorySlug}/${article.slug}`}
    className={`group block ${className}`}
  >
    <article className="flex flex-col gap-2">
      {withImage && article.image?.src && (
        <ArticleImage
          src={article.image.src}
          alt={article.image.alt || ""}
          aspectRatio={imageAspectRatio}
        />
      )}
      <h3 className={`${titleClassName} group-hover:text-red-600`}>
        {article.titleShort || article.title}
      </h3>
      <ArticleTime time={article.time} categorySlug={article.categorySlug} />
    </article>
  </Link>
);

const BaseArticleList = ({
  articles,
  withImage = false,
  showDividers = true,
}: {
  articles: Article[];
  withImage?: boolean;
  showDividers?: boolean;
}) => (
  <div className="flex flex-col gap-4">
    {articles.map((article, index) => (
      <div key={article.id}>
        <BaseArticleCard article={article} withImage={withImage} />
        {showDividers && index < articles.length - 1 && (
          <hr className="my-4 border-t border-neutral-200" />
        )}
      </div>
    ))}
  </div>
);

// Specialized Article Layouts
const SpotlightArticle = memo(({ article }: { article: Article }) => (
  <article>
    <Link href={`/${article.categorySlug}/${article.slug}`}>
      <div className="flex flex-col">
        <ArticleImage
          src={article.image?.src || ""}
          alt={article.image?.alt || article.title}
          priority
          aspectRatio="aspect-[16/9]"
          sizes="(min-width: 768px) 60vw, 100vw"
        />
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="text-3xl font-bold">
            {article.titleShort || article.title}
          </h2>
          <ArticleTime
            time={article.time}
            categorySlug={article.categorySlug}
            className="text-sm text-gray-500"
          />
        </div>
      </div>
    </Link>
  </article>
));

const MainFeaturedArticle = memo(({ article }: { article: Article }) => (
  <article>
    <Link href={`/${article.categorySlug}/${article.slug}`}>
      <div
        className={`flex flex-col md:flex-row border-r-0 rounded overflow-hidden cursor-pointer h-full mb-4
          ${article.isPromoted ? "bg-gray-50" : "bg-white"}`}
      >
        <div className="flex-1 flex flex-col justify-between mr-3 order-2 md:order-1">
          <div>
            <h2 className="text-2xl font-bold leading-tight my-4">
              {article.titleShort || article.title}
            </h2>
            {article.subTitle && (
              <p className="text-base md:text-lg md:min-h-[140px] leading-normal">
                {article.subTitleShort || article.subTitle}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2 opacity-80">
              {article.author && <span>{article.author}</span>}
              {article.time && (
                <>
                  <span>|</span>
                  <span>{new Date(article.time).toLocaleTimeString()}</span>
                </>
              )}
              {article.isPromoted && (
                <>
                  <span>|</span>
                  <span>Promoted</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full md:w-[60%] aspect-video md:h-[400px] order-1 md:order-2">
          <ArticleImage
            src={article.image?.src || ""}
            alt={article.image?.alt || article.title}
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
          />
        </div>
      </div>
    </Link>
  </article>
));

// Aside Components
const AsideMore = memo(
  ({
    articles,
    title,
    withImage,
    className = "",
  }: {
    articles: Article[];
    title: string;
    withImage: boolean;
    className?: string;
  }) => (
    <section className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-primary"></div>
        <h2 className="text-base text-primary font-bold uppercase">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {articles.slice(0, 4).map((article, index) => (
          <div key={article.id}>
            <BaseArticleCard
              article={article}
              withImage={withImage && index === 0}
            />
            {index < articles.length - 1 && (
              <hr className="my-4 border-t border-neutral-200" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
);

const AsideWithBorder = memo(
  ({
    articles,
    withImage = true,
    title,
  }: {
    articles: Article[];
    withImage?: boolean;
    title: string;
  }) => (
    <section className="flex flex-col px-1 max-w-[285px] mb-3">
      <div className="flex overflow-hidden gap-2.5 justify-center items-center pb-2.5 w-full text-base font-bold leading-none text-red-700 uppercase">
        <div className="overflow-hidden gap-2.5 self-stretch pl-4 my-auto border-red-700 border-l-[6px]">
          {title}
        </div>
      </div>
      <ul className="flex flex-col justify-center items-center p-4 self-end w-full border border-solid border-neutral-200">
        {articles.map((article, index) => (
          <li key={article.id}>
            <BaseArticleCard
              article={article}
              withImage={withImage && index === 0}
              className="w-60 max-w-full"
            />
            {!withImage && (
              <hr className="mt-3 border border-solid border-neutral-200" />
            )}
          </li>
        ))}
        {withImage && (
          <li className="flex overflow-hidden gap-1.5 justify-center items-center pt-4 mt-8 w-full text-base font-medium leading-none uppercase border-t border-zinc-300 text-zinc-800">
            <Link
              href="/news"
              className="flex items-center hover:text-red-700 transition-colors"
            >
              <span className="self-stretch my-auto">see more</span>
              <Image
                src="/icons/right.svg"
                alt="See more"
                width={25}
                height={25}
              />
            </Link>
          </li>
        )}
      </ul>
    </section>
  )
);

// Mobile Components
const MobileArticleList = ({ articles }: { articles: Article[] }) => (
  <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
    <section className="grid grid-cols-1 gap-4">
      {articles.slice(0, 6).map((article: Article) => (
        <Link
          href={`/${article.categorySlug}/${article.slug}`}
          key={article.id}
          className="group flex gap-4 items-start"
        >
          <div className="w-32 flex-shrink-0">
            {article.image?.src && (
              <ArticleImage
                src={article.image.src}
                alt={article.image.alt || ""}
                aspectRatio="aspect-[4/3]"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold leading-tight mb-2">
              {article.titleShort || article.title}
            </h3>
            <ArticleTime
              time={article.time}
              categorySlug={article.categorySlug}
            />
          </div>
        </Link>
      ))}
    </section>
  </div>
);

const MobileLatestNews = memo(({ articles }: { articles: Article[] }) => (
  <div className="flex flex-col w-full">
    <div className="flex overflow-hidden gap-2.5 justify-center items-center w-full text-base font-bold leading-none text-red-700 uppercase max-w-[362px] min-h-[35px]">
      <div className="overflow-hidden gap-2.5 self-stretch pl-4 my-auto border-red-700 border-l-[6px]">
        last news
      </div>
    </div>
    <div className="flex overflow-x-auto gap-5 items-center mt-4 w-full">
      {articles.map((article, index) => (
        <div
          key={index}
          className="flex overflow-hidden flex-col justify-center self-stretch p-2.5 my-auto border border-solid border-neutral-200 min-w-[240px] w-[266px]"
        >
          <div className="text-base font-semibold text-zinc-800">
            {article.title}
          </div>
          <div className="mt-2.5 text-sm font-medium leading-none uppercase text-zinc-400">
            {new Date(article.time).toLocaleDateString()} |{" "}
            {article.categorySlug}
          </div>
        </div>
      ))}
    </div>
  </div>
));

// Main Category Section Component
const CategorySection: React.FC<{
  style: number;
  category: string;
  articles: Article[];
  index: number;
}> = ({ style, category, articles, index }) => {
  const commonProps = {
    title: category,
    seeMoreText: "see more",
    iconSrc: "/icons/right.svg",
    color: "red-700",
  };

  if (index === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="w-full mt-6 px-4 md:px-0">
              <CategoryHeader {...commonProps} />
              <div className="hidden md:block">
                <div className="flex gap-8 mt-3">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {articles.slice(0, 4).map((article) => (
                        <BaseArticleCard
                          key={article.id}
                          article={article}
                          withImage
                        />
                      ))}
                    </div>
                  </div>
                  <aside className="w-72">
                    <AsideMore
                      articles={articles.slice(4, 8)}
                      title="MORE"
                      withImage={false}
                    />
                  </aside>
                </div>
              </div>
              <MobileArticleList articles={articles} />
            </div>
          </div>
          <div className="md:w-1/4 hidden lg:block">
            <AsideWithBorder
              articles={articles.slice(0, 3)}
              title="More from this category"
            />
          </div>
        </div>
      </div>
    );
  }

  if (style === 1) {
    return (
      <div className="w-full mt-6 px-4 md:px-0">
        <CategoryHeader {...commonProps} />
        <div className="hidden md:block">
          <div className="flex gap-8 mt-3">
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {articles.slice(0, 4).map((article) => (
                  <BaseArticleCard
                    key={article.id}
                    article={article}
                    withImage
                  />
                ))}
              </div>
            </div>
            <aside className="w-72">
              <AsideMore
                articles={articles.slice(4, 8)}
                title="MORE"
                withImage={true}
              />
            </aside>
          </div>
        </div>
        <MobileArticleList articles={articles} />
      </div>
    );
  }

  if (style === 2) {
    return (
      <div className="w-full mt-6 px-4 md:px-0">
        <CategoryHeader {...commonProps} />
        <div className="grid-cols-1 gap-6 mt-3 hidden md:grid">
          <div className="flex gap-8">
            <div className="flex-1">
              <MainFeaturedArticle article={articles[0]} />
              <div className="grid grid-cols-3 gap-4">
                {articles.slice(1, 4).map((article) => (
                  <BaseArticleCard
                    key={article.id}
                    article={article}
                    withImage
                  />
                ))}
              </div>
            </div>
            <div className="w-72 lg:block hidden">
              <AsideMore
                articles={articles.slice(4, 8)}
                title="MORE"
                withImage
              />
            </div>
          </div>
        </div>
        <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
          <BaseArticleCard article={articles[0]} withImage className="mb-4" />
          <BaseArticleList
            articles={articles.slice(1, 6)}
            showDividers={false}
          />
        </div>
      </div>
    );
  }

  // Style 3: Spotlight style layout
  return (
    <div className="w-full mt-6">
      <CategoryHeader {...commonProps} />
      <div className="grid-cols-1 gap-6 mt-3 hidden md:grid">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <SpotlightArticle article={articles[0]} />
            </div>
            <div className="w-[40%]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {articles.slice(1, 3).map((article) => (
                  <BaseArticleCard
                    key={article.id}
                    article={article}
                    withImage
                  />
                ))}
              </div>
              <BaseArticleList articles={articles.slice(3, 6)} showDividers />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
        <BaseArticleCard article={articles[0]} withImage className="mb-4" />
        <MobileArticleList articles={articles.slice(0, 2)} />
        <BaseArticleList articles={articles.slice(0, 2)} showDividers={false} />
      </div>
    </div>
  );
};

// Article Item Full Width Component
const ArticleItemFullWidth = memo(({ article }: { article: Article }) => {
  const publishDate = new Date(article.time * 1000);
  const formattedTime = publishDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Link
      href={`/${article.categorySlug}/${article.slug}`}
      className="group block py-2 hover:bg-gray-50 transition-colors"
    >
      <article className="md:flex gap-4 items-center">
        <div className="relative min-w-[160px] md:min-w-[260px] h-[200px] md:h-[150px]">
          <OptimizedImage
            src={article.image?.src || ""}
            alt={article.title}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 160px, 260px"
          />
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {article.titleShort || article.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {article.comments > 0 && (
              <span className="flex items-center gap-1 font-medium">
                {article.comments}
                <MessageSquare size={16} aria-label="Comments" />
              </span>
            )}
            {article.author && <span>{article.author}</span>}
            <time dateTime={publishDate.toISOString()}>{formattedTime}</time>
            {article.isPromoted && (
              <span className="text-primary">Promoted</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});

ArticleItemFullWidth.displayName = "ArticleItemFullWidth";

const MainArticle = memo(({ article }: { article: Article }) => (
  <article className="mx-auto w-full">
    <Link href={`/${article.categorySlug}/${article.slug}`}>
      <div className="flex flex-col bg-white">
        <div className="relative w-full aspect-video">
          <OptimizedImage
            src={article.image?.src || ""}
            alt={article.image?.alt || article.title}
            fill
            className="object-cover md:rounded"
            sizes="100vw"
            priority={true}
          />
        </div>
        <div className="px-4 py-6 md:px-0">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:text-center">
            {article.titleShort || article.title}
          </h1>
          {article.subTitle && (
            <p className="text-lg md:text-xl text-gray-600 mb-4 md:text-center">
              {article.subTitleShort || article.subTitle}
            </p>
          )}
          <div className="flex items-center md:justify-center gap-2 text-sm text-gray-500">
            <time dateTime={new Date(article.time).toISOString()}>
              {new Date(article.time).toLocaleDateString("de-DE")}
            </time>
            {article.categorySlug && (
              <>
                <span>|</span>
                <span className="uppercase">{article.categorySlug}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  </article>
));

MainArticle.displayName = "MainArticle";

export {
  ArticleTime,
  ArticleImage,
  CategoryHeader,
  BaseArticleCard,
  BaseArticleList,
  SpotlightArticle,
  MainFeaturedArticle,
  AsideMore,
  AsideWithBorder,
  MobileArticleList,
  CategorySection,
  ArticleItemFullWidth,
  MainArticle,
  MobileLatestNews,
};
