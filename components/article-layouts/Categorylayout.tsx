import { Article } from "@/types";
import { OptimizedImage } from "../OptimizedImage";
import Link from "next/link";
import React, { memo } from "react";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

const formatDate = (time: number, locale = "de-DE") =>
  new Date(time).toLocaleDateString(locale);

const formatTime = (time: number) =>
  new Date(time * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

interface ArticleTimeProps {
  time: number;
  categorySlug?: string;
  className?: string;
}

const ArticleTime = memo(function ArticleTime({
  time,
  categorySlug,
  className = "",
}: ArticleTimeProps) {
  return (
    <div
      className={`flex items-center text-xs text-zinc-400 uppercase ${className}`}
      role="contentinfo"
    >
      <time dateTime={new Date(time).toISOString()}>{formatDate(time)}</time>
      {categorySlug && (
        <>
          <span className="mx-2" aria-hidden="true">
            |
          </span>
          <span>{categorySlug}</span>
        </>
      )}
    </div>
  );
});

interface ArticleImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  className?: string;
}

const ArticleImage = memo(function ArticleImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 160px, (max-width: 1024px) 200px, 260px",
  aspectRatio = "aspect-[1.74]",
  className = "",
}: ArticleImageProps) {
  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
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
});

interface CategoryHeaderProps {
  title: string;
  color?: string;
  seeMoreText?: string;
  iconSrc?: string;
}

const CategoryHeader = memo(function CategoryHeader({
  title,
  color = "red-700",
  seeMoreText = "see more",
  iconSrc = "/icons/right.svg",
}: CategoryHeaderProps) {
  return (
    <div
      className="flex flex-wrap gap-8 justify-between items-start py-4 uppercase border-b border-neutral-200"
      role="heading"
      aria-level={2}
    >
      <div
        className={`flex-1 gap-2 pl-4 text-base font-bold text-${color} whitespace-nowrap border-${color} border-l-4`}
      >
        {title}
      </div>
      <div className="flex gap-2 items-center pl-4 text-base font-medium leading-none border-l border-zinc-300">
        <Link
          href="/news"
          className={`flex items-center hover:text-${color} transition-colors`}
          aria-label={`See more ${title}`}
        >
          <span className="mr-2">{seeMoreText}</span>
          <Image
            src={iconSrc}
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
});

interface BaseArticleCardProps {
  article: Article;
  withImage?: boolean;
  className?: string;
  imageAspectRatio?: string;
  titleClassName?: string;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const BaseArticleCard = memo(function BaseArticleCard({
  article,
  withImage = false,
  className = "",
  imageAspectRatio = "aspect-[1.74]",
  titleClassName = "",
  headingLevel = "h3",
}: BaseArticleCardProps) {
  const HeadingTag = headingLevel;

  return (
    <Link
      href={`/${article.categorySlug}/${article.slug}`}
      className={`group block ${className}`}
    >
      <article
        className="flex flex-col gap-4"
        itemScope
        itemType="http://schema.org/NewsArticle"
      >
        {withImage && article.image?.src && (
          <ArticleImage
            src={article.image.src}
            alt={article.image.alt || ""}
            aspectRatio={imageAspectRatio}
          />
        )}
        <HeadingTag
          className={`text-lg font-semibold group-hover:text-red-700 transition-colors ${titleClassName}`}
          itemProp="headline"
        >
          {article.titleShort || article.title}
        </HeadingTag>
        <ArticleTime time={article.time} categorySlug={article.categorySlug} />
      </article>
    </Link>
  );
});

interface BaseArticleListProps {
  articles: Article[];
  withImage?: boolean;
  showDividers?: boolean;
}

const BaseArticleList = memo(function BaseArticleList({
  articles,
  withImage = false,
  showDividers = true,
}: BaseArticleListProps) {
  return (
    <div className="flex flex-col gap-4" role="feed" aria-label="Article list">
      {articles.map((article, index) => (
        <div key={article.id}>
          <BaseArticleCard article={article} withImage={withImage} />
          {showDividers && index < articles.length - 1 && (
            <hr
              className="my-4 border-t border-neutral-200"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
});

interface SpotlightArticleProps {
  article: Article;
}

const SpotlightArticle = memo(function SpotlightArticle({
  article,
}: SpotlightArticleProps) {
  return (
    <article itemScope itemType="http://schema.org/NewsArticle">
      <Link href={`/${article.categorySlug}/${article.slug}`}>
        <div className="flex flex-col gap-4">
          <ArticleImage
            src={article.image?.src || ""}
            alt={article.image?.alt || article.title}
            priority
            aspectRatio="aspect-[16/9]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
          />
          <div className="flex flex-col gap-4">
            <h2
              className="text-2xl md:text-3xl font-bold group-hover:text-red-700 transition-colors"
              itemProp="headline"
            >
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
  );
});

interface MainFeaturedArticleProps {
  article: Article;
}

const MainFeaturedArticle = memo(function MainFeaturedArticle({
  article,
}: MainFeaturedArticleProps) {
  return (
    <article itemScope itemType="http://schema.org/NewsArticle">
      <Link href={`/${article.categorySlug}/${article.slug}`}>
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded overflow-hidden cursor-pointer bg-white hover:bg-gray-50 transition-colors">
          <div className="flex-1 flex flex-col justify-between gap-4 order-2 md:order-1">
            <div>
              <h2
                className="text-xl md:text-2xl font-bold mb-4"
                itemProp="headline"
              >
                {article.titleShort || article.title}
              </h2>
              {article.subTitle && (
                <p className="text-lg md:min-h-[140px]" itemProp="description">
                  {article.subTitleShort || article.subTitle}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <ArticleMetadata article={article} />
            </div>
          </div>
          <div className="relative w-full md:w-[60%] aspect-video md:h-[400px] order-1 md:order-2">
            <ArticleImage
              src={article.image?.src || ""}
              alt={article.image?.alt || article.title}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 60vw"
            />
          </div>
        </div>
      </Link>
    </article>
  );
});

interface AsideMoreProps {
  articles: Article[];
  title: string;
  withImage: boolean;
  className?: string;
}

const AsideMore = memo(function AsideMore({
  articles,
  title,
  withImage,
  className = "",
}: AsideMoreProps) {
  return (
    <section className={`flex flex-col gap-4 ${className}`} aria-label={title}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-6 bg-primary"></div>
        <h2 className="uppercase font-bold">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {articles.slice(0, 4).map((article, index) => (
          <div key={article.id}>
            <BaseArticleCard
              article={article}
              withImage={withImage && index === 0}
              headingLevel="h3"
            />
            {index < articles.length - 1 && (
              <hr
                className="my-4 border-t border-neutral-200"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
});

interface AsideWithBorderProps {
  articles: Article[];
  withImage?: boolean;
  title: string;
}

const AsideWithBorder = memo(function AsideWithBorder({
  articles,
  withImage = true,
  title,
}: AsideWithBorderProps) {
  return (
    <section className="flex flex-col max-w-[285px] mb-4" aria-label={title}>
      <div className="flex gap-2 items-center pb-4 w-full text-base font-bold text-red-700 uppercase">
        <div className="pl-4 border-red-700 border-l-4">{title}</div>
      </div>
      <ul
        className="flex flex-col gap-4 p-4 w-full border border-neutral-200 rounded"
        role="list"
      >
        {articles.map((article, index) => (
          <li key={article.id}>
            <BaseArticleCard
              article={article}
              withImage={withImage && index === 0}
              className="w-full"
              headingLevel="h3"
            />
            <hr
              className="mt-4 border-t border-neutral-200"
              aria-hidden="true"
            />
          </li>
        ))}
        {withImage && (
          <li className="flex gap-2 justify-center items-center pt-4 mt-4 w-full text-base font-medium uppercase border-t border-zinc-300">
            <Link
              href="/news"
              className="flex items-center hover:text-red-700 transition-colors"
              aria-label="See more articles"
            >
              <span className="mr-2">see more</span>
              <Image
                src="/icons/right.svg"
                alt=""
                width={25}
                height={25}
                aria-hidden="true"
              />
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
});

interface MobileArticleListProps {
  articles: Article[];
}

const MobileArticleList = memo(function MobileArticleList({
  articles,
}: MobileArticleListProps) {
  return (
    <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
      <section className="grid grid-cols-1 gap-4">
        {articles.slice(0, 4).map((article: Article) => (
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
                  sizes="(max-width: 768px) 128px"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 group-hover:text-red-700 transition-colors">
                {article.titleShort || article.title}
              </h3>
              <ArticleTime
                time={article.time}
                categorySlug={article.categorySlug}
              />
            </div>
          </Link>
        ))}
        <div className="flex flex-col gap-4">
          {articles.slice(4, 7).map((article) => (
            <React.Fragment key={article.id}>
              <BaseArticleCard article={article} headingLevel="h3" />
              <hr className="border-t border-neutral-200" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
});

interface MobileLatestNewsProps {
  articles: Article[];
}

const MobileLatestNews = memo(function MobileLatestNews({
  articles,
}: MobileLatestNewsProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-2 items-center text-base font-bold text-red-700 uppercase max-w-[362px]">
        <div className="pl-4 border-red-700 border-l-4">latest news</div>
      </div>
      <div className="flex overflow-x-auto gap-4 items-center w-full pb-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="flex flex-col p-4 border border-neutral-200 rounded min-w-[240px] w-[266px]"
          >
            <h3 className="text-base font-semibold text-zinc-800 mb-4">
              {article.title}
            </h3>
            <div className="text-sm font-medium uppercase text-zinc-400">
              {formatDate(article.time)} | {article.categorySlug}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

interface ArticleMetadataProps {
  article: Article;
}

const ArticleMetadata = memo(function ArticleMetadata({
  article,
}: ArticleMetadataProps) {
  return (
    <div className="flex items-center gap-2 text-gray-500" role="contentinfo">
      {article.author && <span itemProp="author">{article.author}</span>}
      {article.time && (
        <>
          <span aria-hidden="true">|</span>
          <span>{formatTime(article.time)}</span>
        </>
      )}
      {article.isPromoted && (
        <>
          <span aria-hidden="true">|</span>
          <span>Promoted</span>
        </>
      )}
    </div>
  );
});

interface CategorySectionProps {
  style: number;
  category: string;
  articles: Article[];
  index: number;
}

interface CommonHeaderProps {
  title: string;
  seeMoreText: string;
  iconSrc: string;
  color: string;
}

interface CategoryLayoutProps {
  articles: Article[];
  commonProps: CommonHeaderProps;
}

const CategorySection = memo(function CategorySection({
  style,
  category,
  articles,
}: CategorySectionProps) {
  const commonProps = {
    title: category,
    seeMoreText: "see more",
    iconSrc: "/icons/right.svg",
    color: "red-700",
  };

  const layouts = {
    0: <CategoryLayoutZero articles={articles} commonProps={commonProps} />,
    1: <CategoryLayoutOne articles={articles} commonProps={commonProps} />,
    2: <CategoryLayoutTwo articles={articles} commonProps={commonProps} />,
    3: <CategoryLayoutThree articles={articles} commonProps={commonProps} />,
  };

  return layouts[style as keyof typeof layouts] || layouts[0];
});

const CategoryLayoutZero = memo(function CategoryLayoutZero({
  articles,
  commonProps,
}: CategoryLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="flex-1">
          <CategoryHeader {...commonProps} />
          <div className="hidden md:block">
            <div className="flex gap-4 lg:gap-8 mt-4">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.slice(0, 4).map((article) => (
                    <BaseArticleCard
                      key={article.id}
                      article={article}
                      withImage
                      headingLevel="h3"
                    />
                  ))}
                </div>
              </div>
              <aside className="hidden md:block w-72">
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
        <div className="hidden lg:block md:w-1/4">
          <AsideWithBorder
            articles={articles.slice(0, 3)}
            title="More from this category"
          />
        </div>
      </div>
    </div>
  );
});

const CategoryLayoutOne = memo(function CategoryLayoutOne({
  articles,
  commonProps,
}: CategoryLayoutProps) {
  return (
    <>
      <CategoryHeader {...commonProps} />
      <div className="hidden md:block">
        <div className="flex gap-4 lg:gap-8 mt-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.slice(0, 4).map((article) => (
                <BaseArticleCard
                  key={article.id}
                  article={article}
                  withImage
                  headingLevel="h3"
                />
              ))}
            </div>
          </div>
          <aside className="hidden md:block w-72">
            <AsideMore
              articles={articles.slice(4, 8)}
              title="MORE"
              withImage={true}
            />
          </aside>
        </div>
      </div>
      <MobileArticleList articles={articles} />
    </>
  );
});

const CategoryLayoutTwo = memo(function CategoryLayoutTwo({
  articles,
  commonProps,
}: CategoryLayoutProps) {
  return (
    <>
      <CategoryHeader {...commonProps} />
      <div className="hidden md:grid grid-cols-1 gap-4 mt-4">
        <div className="xl:flex gap-4 lg:gap-8">
          <div className="flex-1">
            <MainFeaturedArticle article={articles[0]} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {articles.slice(1, 4).map((article) => (
                <BaseArticleCard
                  key={article.id}
                  article={article}
                  withImage
                  headingLevel="h3"
                />
              ))}
            </div>
          </div>
          <div className="hidden xl:block">
            <AsideMore
              articles={articles.slice(4, 8)}
              title="MORE"
              withImage={false}
            />
          </div>
        </div>
      </div>
      <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
        <BaseArticleCard
          article={articles[0]}
          withImage
          className="mb-4"
          headingLevel="h2"
        />
        <BaseArticleList articles={articles.slice(1, 6)} showDividers />
      </div>
    </>
  );
});

const CategoryLayoutThree = memo(function CategoryLayoutThree({
  articles,
  commonProps,
}: CategoryLayoutProps) {
  return (
    <>
      <CategoryHeader {...commonProps} />
      <div className="hidden md:grid grid-cols-1 gap-4 mt-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
            <div className="flex-1">
              <SpotlightArticle article={articles[0]} />
            </div>
            <div className="md:w-[40%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {articles.slice(1, 3).map((article) => (
                  <BaseArticleCard
                    key={article.id}
                    article={article}
                    withImage
                    headingLevel="h3"
                  />
                ))}
              </div>
              <BaseArticleList articles={articles.slice(3, 6)} showDividers />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
        <BaseArticleCard
          article={articles[0]}
          withImage
          className="mb-4"
          headingLevel="h2"
        />
        <MobileArticleList articles={articles.slice(1, 3)} />
        <BaseArticleList articles={articles.slice(3, 6)} showDividers />
      </div>
    </>
  );
});

interface ArticleItemFullWidthProps {
  article: Article;
}

const ArticleItemFullWidth = memo(function ArticleItemFullWidth({
  article,
}: ArticleItemFullWidthProps) {
  return (
    <Link
      href={`/${article.categorySlug}/${article.slug}`}
      className="group block py-4 hover:bg-gray-50 transition-colors"
    >
      <article
        className="md:flex gap-4 items-center"
        itemScope
        itemType="http://schema.org/NewsArticle"
      >
        <div className="relative min-w-[160px] md:min-w-[260px] h-[200px] md:h-[150px]">
          <OptimizedImage
            src={article.image?.src || ""}
            alt={article.title}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 200px, 260px"
          />
        </div>
        <div className="flex flex-col justify-between flex-grow gap-4">
          <h2
            className="text-xl md:text-2xl font-bold group-hover:text-red-700 transition-colors"
            itemProp="headline"
          >
            {article.titleShort || article.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {article.comments > 0 && (
              <span className="flex items-center gap-1 font-medium">
                <span>{article.comments}</span>
                <MessageSquare size={16} aria-label="Comments" />
              </span>
            )}
            <ArticleMetadata article={article} />
          </div>
        </div>
      </article>
    </Link>
  );
});

interface MainArticleProps {
  article: Article;
}

const MainArticle = memo(function MainArticle({ article }: MainArticleProps) {
  return (
    <article
      className="mx-auto w-full"
      itemScope
      itemType="http://schema.org/NewsArticle"
    >
      <Link href={`/${article.categorySlug}/${article.slug}`}>
        <div className="flex flex-col">
          <div className="relative w-screen md:w-full left-[50%] md:left-0 right-[50%] md:right-0 ml-[-50vw] md:ml-0 mr-[-50vw] md:mr-0">
            <div className="relative w-full aspect-video">
              <OptimizedImage
                src={article.image?.src || ""}
                alt={article.image?.alt || article.title}
                fill
                className="object-cover md:rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority={true}
              />
            </div>
          </div>
          <div className="relative w-full md:p-6 mt-4">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:text-center"
              itemProp="headline"
            >
              {article.titleShort || article.title}
            </h1>
            {article.subTitle && (
              <p
                className="text-lg md:text-xl mb-4 md:text-center"
                itemProp="description"
              >
                {article.subTitleShort || article.subTitle}
              </p>
            )}
            <div className="flex items-center md:justify-center gap-4">
              <ArticleTime
                time={article.time}
                categorySlug={article.categorySlug}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});

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
