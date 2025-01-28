import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { OptimizedImage } from "../OptimizedImage";
import { Article } from "@/types";

// Base Components
const ArticleDateTime = memo(
  ({ time, className = "" }: { time: number; className?: string }) => {
    const date = new Date(time * 1000);
    return (
      <time dateTime={date.toISOString()} className={className}>
        {date.toLocaleDateString("de-DE")}
      </time>
    );
  }
);

const ArticleImage = memo(
  ({
    src,
    alt = "",
    priority = false,
    sizes = "(max-width: 768px) 160px, 260px",
    aspectRatio = "aspect-[1.74]",
    className = "",
  }: {
    src?: string;
    alt?: string;
    priority?: boolean;
    sizes?: string;
    aspectRatio?: string;
    className?: string;
  }) => {
    if (!src) return null;

    return (
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
  }
);

const ArticleMeta = memo(
  ({
    article,
    className = "",
    showAuthor = false,
    showComments = true,
    isUppercase = true,
  }: {
    article: Article;
    className?: string;
    showAuthor?: boolean;
    showComments?: boolean;
    isUppercase?: boolean;
  }) => (
    <div
      className={`flex items-center gap-2 ${className} ${
        isUppercase ? "uppercase" : ""
      }`}
    >
      <ArticleDateTime time={article.time} />
      {article.categorySlug && (
        <>
          <span className="mx-2">|</span>
          <span>{article.categorySlug}</span>
        </>
      )}
      {showComments && article.comments > 0 && (
        <span className="flex items-center gap-1 ml-2">
          {article.comments}
          <MessageSquare size={14} aria-label="Comments" />
        </span>
      )}
      {showAuthor && article.author && (
        <>
          <span>|</span>
          <span>{article.author}</span>
        </>
      )}
    </div>
  )
);

// Layout Components
const PageContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`max-w-7xl mx-auto px-4 ${className}`}>{children}</div>;

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

// Main Layout Components
export const MainContentLayout = memo(
  ({
    homeFrontal,
    mostRead,
    children,
  }: {
    homeFrontal: Article[];
    mostRead: Article[];
    children?: React.ReactNode;
  }) => (
    <div className="flex flex-col md:flex-row gap-6 py-8">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
          <div className="md:col-span-3">
            <AsideWithBorder
              articles={homeFrontal.slice(0, 5)}
              title="Latest News"
              withImage={false}
            />
          </div>

          <div className="md:col-span-6 mt-6">
            <MainArticle article={homeFrontal[0]} />
          </div>

          <div className="md:col-span-9 bg-green-300 h-6 w-full" />

          <div className="md:col-span-9">
            {homeFrontal?.slice(1).map((article) => (
              <ArticleItemFullWidth key={article.id} article={article} />
            ))}
          </div>

          <div className="md:col-span-9 mt-3">
            <SpotlightSplitAside articles={mostRead.slice(0, 4)} />
          </div>
        </div>
      </div>
      {children}
    </div>
  )
);

export const RightAsideLayout = memo(
  ({ mostRead }: { mostRead: Article[] }) => (
    <div className="md:w-1/4">
      <AsideWithBorder
        articles={mostRead}
        title="Most Talked"
        withImage={true}
      />
      <AsideWithBorder
        articles={mostRead.slice(0, 3)}
        title="Editor's Pick"
        withImage={true}
      />
    </div>
  )
);

export const ColoredBackgroundSection = memo(
  ({
    articles,
    title,
    backgroundColor,
  }: {
    articles: Article[];
    title: string;
    backgroundColor: string;
  }) => (
    <div className={`w-full ${backgroundColor} mt-4`}>
      <PageContainer>
        <CategoryHeader title={title} color="green-500" />
        <div className="grid grid-cols-1 gap-6 mt-3">
          <ScrollArticles articles={articles} />
        </div>
      </PageContainer>
    </div>
  )
);

export const FullWidthSection = memo(
  ({
    articles,
    title,
    type = "default",
  }: {
    articles: Article[];
    title: string;
    type?: string;
  }) => (
    <div className="w-full mt-6">
      <CategoryHeader title={title} />
      <div className="grid grid-cols-1 gap-6 mt-3">
        {type === "spotlight-split" ? (
          <SpotlightSpilt articles={articles} />
        ) : (
          <DefaultLayout articles={articles} />
        )}
      </div>
    </div>
  )
);

// Individual Components (SpotlightMain, SpotlightSplit, etc. remain the same but using the base components)
const SpotlightMain = memo(({ article }: { article: Article }) => (
  <article>
    <Link href={`/${article.categorySlug}/${article.slug}`} className="block">
      <div className="flex flex-col">
        <ArticleImage
          src={article.image?.src}
          alt={article.title}
          aspectRatio="aspect-[16/9]"
          sizes="(min-width: 768px) 60vw, 100vw"
          priority={true}
          className="mb-4"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold">
            {article.titleShort || article.title}
          </h2>
          <ArticleMeta article={article} className="text-sm text-gray-500" />
        </div>
      </div>
    </Link>
  </article>
));

// Export all components
export {
  ArticleDateTime,
  ArticleImage,
  ArticleMeta,
  CategoryHeader,
  PageContainer,
  SpotlightMain,
};
