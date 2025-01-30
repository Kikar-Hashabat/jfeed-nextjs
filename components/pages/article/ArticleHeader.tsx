import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArticleAuthor, ArticleImage } from "@/types/article";
import { formatDateAndTime } from "@/utils/date";
import { OptimizedImage } from "@/components/OptimizedImage";
import ShareButtons from "@/components/ShareButtons";

interface ArticleHeaderProps {
  roofTitle: string;
  title: string;
  subTitle: string;
  author: ArticleAuthor;
  publishDate: number;
  modifiedDate?: number | null;
  readTime: number;
  commentsCount?: number | string;
  articleImage: ArticleImage;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  roofTitle,
  title,
  subTitle,
  author,
  publishDate,
  //modifiedDate,
  readTime,
  commentsCount = 0,
  articleImage,
}) => {
  return (
    <div className="flex flex-col">
      {/* Article Image - Hidden on desktop, shown first on mobile */}
      <div className="md:hidden mb-4">
        <div
          className={`relative aspect-[1.74] w-full overflow-hidden`}
          role="img"
          aria-label={articleImage.alt}
        >
          <OptimizedImage
            src={articleImage.src}
            alt={articleImage.alt}
            fill
            sizes="(max-width: 768px) 190px, (max-width: 1024px) 200px, 260px"
            className="object-cover rounded"
            priority
          />
        </div>
      </div>

      <header className="flex-col gap-3.5 max-md:gap-2 hidden md:flex">
        {roofTitle && (
          <div className="text-sm font-medium text-primary bg-roofbg p-3 mb-4 w-fit">
            {roofTitle}
          </div>
        )}

        <h1 className="flex-1 text-5xl font-bold leading-[51px] max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
          {title}
        </h1>

        {subTitle && (
          <p className="mt-3.5 text-2xl leading-8 max-md:max-w-full">
            {subTitle}
          </p>
        )}
      </header>

      <div className="flex flex-wrap gap-10 justify-between items-center pb-5 mt-7 w-full border-b border-neutral-200 max-md:max-w-full">
        <div className="flex gap-4 justify-center items-center self-stretch my-auto min-w-[240px]">
          {author.image && (
            <Image
              src={author.image}
              alt={author.name}
              width={57}
              height={57}
              className="object-contain shrink-0 self-stretch my-auto rounded-full aspect-square w-[57px]"
            />
          )}
          <div className="flex flex-col self-stretch my-auto w-[209px]">
            <Link
              href={author.url}
              className="text-lg font-bold leading-none text-zinc-800 hover:text-primary transition-colors"
            >
              {author.name}
            </Link>
            <div className="flex items-center gap-2 mt-1.5 text-base font-medium text-zinc-400 whitespace-nowrap">
              <time
                dateTime={new Date(publishDate).toISOString()}
                className="uppercase"
              >
                {formatDateAndTime(publishDate)}
              </time>
              <div className="w-px h-[18px] bg-zinc-400" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        <ShareButtons title={title} commentsCount={commentsCount} />
      </div>

      {/* Article Image - Shown on desktop, hidden on mobile */}
      <div className="hidden md:block mt-8">
        <Image
          src={articleImage.src}
          alt={articleImage.alt}
          width={articleImage.width}
          height={articleImage.height}
          className="w-full h-auto object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  );
};

export default ArticleHeader;
