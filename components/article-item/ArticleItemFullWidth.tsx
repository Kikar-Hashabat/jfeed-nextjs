import { memo } from "react";
import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";
import { MessageSquare } from "lucide-react";

interface ArticleItemFullWidthProps {
  article: Article;
}

const ArticleItemFullWidth = memo(({ article }: ArticleItemFullWidthProps) => {
  const categorySlug = article.categorySlug || "general";
  const publishDate = new Date(article.time * 1000);
  const formattedTime = publishDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group block border-b border-gray-200 py-2 hover:bg-gray-50 transition-colors"
      aria-labelledby={`article-${article.id}-title`}
    >
      <article className="flex gap-4">
        <div className="relative min-w-[160px] md:min-w-[260px] h-[100px] md:h-[150px]">
          <OptimizedImage
            src={article.image?.src || ""}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 160px, 260px"
            priority={true}
            width={300}
          />
        </div>

        <div className="flex flex-col justify-between flex-grow">
          {article.roofTitle && (
            <p className="text-xs md:text-sm text-primary font-medium mb-1">
              {article.roofTitle}
            </p>
          )}

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
});

ArticleItemFullWidth.displayName = "ArticleItemFullWidth";

export default ArticleItemFullWidth;
