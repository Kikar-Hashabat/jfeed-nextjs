// components/layouts/HomeLayout.tsx
import { Article } from "@/types";
import { OptimizedImage } from "../OptimizedImage";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface CategoryHeaderProps {
  title: string;
  color?: string;
  seeMoreText?: string;
  iconSrc?: string;
}

export const CategoryHeader = ({
  title,
  color = "red-700",
  seeMoreText = "see more",
  iconSrc = "/icons/right.svg",
}: CategoryHeaderProps) => {
  return (
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
          aria-label={`See more ${title} articles`}
        >
          <div className="self-stretch my-auto">{seeMoreText}</div>
          <Image src={iconSrc} alt="Icon" width={20} height={20} />
        </Link>
      </div>
    </div>
  );
};

interface AsideBoxProps {
  title: string;
  articles: Article[];
  withImage?: boolean;
}

export const AsideBox = memo(
  ({ title, articles, withImage = false }: AsideBoxProps) => {
    return (
      <section className="flex flex-col px-1 max-w-[285px] mb-3">
        <div className="flex overflow-hidden gap-2.5 justify-center items-center pb-2.5 w-full text-base font-bold leading-none text-red-700 uppercase">
          <div className="overflow-hidden gap-2.5 self-stretch pl-4 my-auto border-red-700 border-l-[6px]">
            {title}
          </div>
        </div>

        <ul className="flex flex-col justify-center items-center p-4 self-end w-full border border-solid border-neutral-200">
          {articles.slice(0, 4).map((article, index) => (
            <li key={article.id}>
              <Link
                href={`/${article.categorySlug}/${article.slug}`}
                className="group block"
              >
                <article className="flex flex-col w-60 max-w-full">
                  {withImage && index === 0 && article.image?.src && (
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
                  <h3 className="mt-3 text-base font-bold group-hover:text-red-700 transition-colors">
                    {article.titleShort || article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-sm font-medium leading-none uppercase text-zinc-400">
                    <time dateTime={new Date(article.time).toISOString()}>
                      {new Date(article.time).toLocaleDateString("de-DE")}
                    </time>
                    <span>|</span>
                    <span>{article.categorySlug}</span>
                    {article.comments > 0 && (
                      <span className="flex items-center gap-1">
                        {article.comments}
                        <MessageSquare size={14} />
                      </span>
                    )}
                  </div>
                </article>
              </Link>
              {index < articles.length - 1 && (
                <hr className="my-4 border-t border-neutral-200" />
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  }
);

interface MainArticleProps {
  article: Article;
}

export const MainArticle = memo(({ article }: MainArticleProps) => {
  return (
    <article className="mx-auto w-full">
      <Link href={`/${article.categorySlug}/${article.slug}`} className="block">
        <div className="flex flex-col bg-white">
          <div className="relative w-full aspect-video">
            <OptimizedImage
              src={article.image?.src || ""}
              alt={article.image?.alt || article.title}
              fill
              className="object-cover rounded"
              sizes="100vw"
              priority={true}
            />
          </div>
          <div className="px-4 py-6 md:px-0">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              {article.titleShort || article.title}
            </h1>
            {article.subTitle && (
              <p className="text-lg md:text-xl text-gray-600 mb-4 text-center">
                {article.subTitleShort || article.subTitle}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
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
});

interface ArticleListProps {
  articles: Article[];
}

export const ArticleList = memo(({ articles }: ArticleListProps) => {
  return (
    <div className="flex flex-col space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/${article.categorySlug}/${article.slug}`}
          className="group block border-b border-gray-200 pb-4"
        >
          <article className="flex gap-4">
            {article.image?.src && (
              <div className="relative min-w-[160px] md:min-w-[260px] h-[150px]">
                <OptimizedImage
                  src={article.image.src}
                  alt={article.image.alt || ""}
                  fill
                  sizes="(max-width: 768px) 160px, 260px"
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex flex-col justify-between flex-grow">
              <h3 className="text-lg font-bold group-hover:text-red-700 transition-colors">
                {article.titleShort || article.title}
              </h3>
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
          </article>
        </Link>
      ))}
    </div>
  );
});
