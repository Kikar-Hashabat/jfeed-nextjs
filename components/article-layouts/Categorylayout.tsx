import { Article } from "@/types";
import { OptimizedImage } from "../OptimizedImage";
import Link from "next/link";
import { memo } from "react";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

export const ArticleCard = ({
  articles,
  withImage,
}: {
  articles: Article[];
  withImage: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {articles.map((article, index) => (
        <Link
          key={index}
          href={`/${article.categorySlug}/${article.slug}`}
          className="group"
        >
          {withImage && article.image?.src && (
            <div className="relative aspect-[1.74] w-full overflow-hidden">
              <OptimizedImage
                src={article.image?.src || ""}
                alt={article.image?.alt || ""}
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
            <time dateTime={new Date(article.time).toISOString()}>
              {new Date(article.time).toLocaleDateString("de-DE")}
            </time>
            {article.categorySlug && (
              <>
                <span className="mx-2">|</span>
                <span>{article.categorySlug}</span>
              </>
            )}
          </div>
          <hr className="my-4 border-t border-gray-200" />
        </Link>
      ))}
    </div>
  );
};

export const CategoryLeftImage = ({ articles }: { articles: Article[] }) => {
  return (
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
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <OptimizedImage
                    src={article.image.src}
                    alt={article.image.alt || ""}
                    fill
                    sizes="(max-width: 768px) 160px, 260px"
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold leading-tight mb-2">
                {article.titleShort || article.title}
              </h3>

              <div className="flex items-center text-xs text-zinc-400 uppercase">
                <time dateTime={new Date(article.time).toISOString()}>
                  {new Date(article.time).toLocaleDateString("de-DE")}
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
  );
};

export const CategoryHeader = ({
  title,
  color,
  seeMoreText,
  iconSrc,
}: {
  title: string;
  color: string;
  seeMoreText: string;
  iconSrc: string;
}) => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-start pr-8 pb-2.5 uppercase border-b border-neutral-200 max-md:pr-5">
      <div
        className={`flex-1 shrink gap-2.5 self-stretch pl-4 text-base font-bold text-${color} whitespace-nowrap border-${color} border-l-[6px] w-[81px]`}
      >
        {title}
      </div>
      <div className="flex overflow-hidden gap-1.5 justify-center items-center pl-4 text-base font-medium leading-none border-l border-zinc-300 ">
        <Link
          href="/news"
          className={`flex items-center hover:text-${color} transition-colors`}
          aria-label="See more most talked articles"
        >
          <div className="self-stretch my-auto">{seeMoreText}</div>
          <Image src={iconSrc} alt="Icon" width={20} height={20} />
        </Link>
      </div>
    </div>
  );
};

export const SpotlightMain = ({ article }: { article: Article }) => {
  return (
    <article>
      <Link href={`/${article.categorySlug}/${article.slug}`} className="block">
        <div className="flex flex-col">
          {/* Image Section */}
          <div className="relative w-full aspect-[16/9] mb-4">
            <OptimizedImage
              src={article.image?.src || ""}
              alt={article.image?.alt || article.title}
              fill
              className="object-cover rounded"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority={true}
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">
              {article.titleShort || article.title}
            </h2>

            <div className="flex items-center text-sm text-gray-500">
              <time dateTime={new Date(article.time).toISOString()}>
                {new Date(article.time).toLocaleDateString("de-DE")}
              </time>
              {article.categorySlug && (
                <>
                  <span className="mx-2">|</span>
                  <span className="uppercase">{article.categorySlug}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export const AsideWithBorder = ({
  articles,
  withImage,
  title,
}: {
  articles: Article[];
  withImage: boolean;
  title: string;
}) => {
  return (
    <section
      className="flex flex-col px-1 max-w-[285px] mb-3"
      aria-labelledby={`most-talked-${title.toLowerCase()}-title`}
    >
      <div className="flex overflow-hidden gap-2.5 justify-center items-center pb-2.5 w-full text-base font-bold leading-none text-red-700 uppercase">
        <div className="overflow-hidden gap-2.5 self-stretch pl-4 my-auto border-red-700 border-l-[6px]">
          {title}
        </div>
      </div>

      <ul className="flex flex-col justify-center items-center p-4 self-end w-full border border-solid border-neutral-200">
        {articles.map((article, index) => (
          <li key={article.id} className={index > 0 ? "" : ""}>
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="group block"
              aria-labelledby={`most-talked-article-${article.id}-title`}
            >
              <article className="flex flex-col w-60 max-w-full">
                {withImage && (
                  <div
                    className={`flex flex-col w-full rounded relative aspect-[1.74] ${
                      index !== 0 ? "mt-6" : ""
                    }`}
                  >
                    <OptimizedImage
                      src={article.image?.src || ""}
                      alt={article.image?.alt || ""}
                      fill
                      sizes="(max-width: 768px) 160px, 260px"
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <h4
                  id={`most-talked-article-${article.id}-title`}
                  className={`mt-3 text-base font-bold group-hover:text-red-700 transition-colors ${
                    withImage ? "inhirit" : "text-gray-600"
                  }`}
                >
                  {article.titleShort || article.title}
                </h4>
                <div className="flex items-center gap-2 mt-3 text-sm font-medium leading-none uppercase text-zinc-400">
                  {article.time && (
                    <time dateTime={new Date(article.time).toISOString()}>
                      {new Date(article.time).toLocaleDateString("de-DE")}
                    </time>
                  )}
                  <span>|</span>
                  <span>{article.categorySlug.toUpperCase()}</span>
                  {article.comments > 0 && (
                    <span className="flex items-center gap-1">
                      {article.comments}
                      <MessageSquare size={14} aria-label="Comments" />
                    </span>
                  )}
                </div>
              </article>
            </Link>
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
              aria-label="See more most talked articles"
            >
              <span className="self-stretch my-auto">see more</span>
              <Image
                src="/icons/right.svg"
                alt="Comments"
                width={25}
                height={25}
              />
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
};

export const MobileLatestNews = ({ articles }: { articles: Article[] }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex overflow-hidden gap-2.5 justify-center items-center w-full text-base font-bold leading-none text-red-700 uppercase max-w-[362px] min-h-[35px]">
        <div className="overflow-hidden gap-2.5 self-stretch pl-4 my-auto border-red-700 border-l-[6px]">
          last news
        </div>
      </div>
      <div className="flex overflow-x-auto gap-5 items-center mt-4 w-full">
        {articles.map((item, index) => (
          <div
            key={index}
            className="flex overflow-hidden flex-col justify-center self-stretch p-2.5 my-auto border border-solid border-neutral-200 min-w-[240px] w-[266px]"
          >
            <div className="text-base font-semibold text-zinc-800">
              {item.title}
            </div>
            <div className="mt-2.5 text-sm font-medium leading-none uppercase text-zinc-400">
              {item.time} | {item.categorySlug}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2.5 mt-4 max-w-full min-h-[35px] w-[362px]" />
    </div>
  );
};

export const MainArticle = ({ article }: { article: Article }) => {
  const categorySlug = article.categorySlug || "general";

  return (
    <article className="mx-auto w-full">
      <Link href={`/${categorySlug}/${article.slug}`} className="block">
        <div className="flex flex-col bg-white">
          {/* Image Section - Full Width */}
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

          {/* Content Section */}
          <div className="px-4 py-6 md:px-0">
            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:text-center">
              {article.titleShort || article.title}
            </h1>

            {/* Subtitle/Description */}
            {article.subTitle && (
              <p className="text-lg md:text-xl text-gray-600 mb-4 md:text-center">
                {article.subTitleShort || article.subTitle}
              </p>
            )}

            {/* Date and Source */}
            <div className="flex items-center md:justify-center gap-2 text-sm text-gray-500 ">
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
  );
};

export const ArticleItemFullWidth = memo(
  ({ article }: { article: Article }) => {
    const categorySlug = article.categorySlug || "general";
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
        aria-labelledby={`article-${article.id}-title`}
      >
        <article className="md:flex gap-4 items-center">
          <div className="relative min-w-[160px] md:min-w-[260px] h-[200px] md:h-[150px]">
            <OptimizedImage
              src={article.image?.src || ""}
              alt=""
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 160px, 260px"
              width={300}
            />
          </div>

          <div className="flex flex-col justify-between flex-grow">
            <h2
              id={`article-${article.id}-title`}
              className="text-lg font-semibold group-hover:text-primary transition-colors"
            >
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
  }
);
