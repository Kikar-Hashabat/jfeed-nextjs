import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";

interface ArticleItemFullWidthProps {
  article: Article;
  withSubTitle?: boolean;
}

const ArticleItemFullWidth: React.FC<ArticleItemFullWidthProps> = ({
  article,
}) => {
  const categorySlug = article.categorySlug || "general";
  const formattedTime = new Date(article.time * 1000).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={`block border-b border-gray-200 py-2 ${
        article.isPromoted ? "bg-gray-50 px-2" : ""
      }`}
      aria-label={`Read article: ${article.title}`}
    >
      <article
        className="flex gap-2 md:gap-4
          text-sm md:text-base
        "
      >
        {/* Image */}
        <div className="relative min-w-[160px] md:min-w-[260px] h-[100px] md:h-[150px]">
          <OptimizedImage
            src={article.image?.src || ""}
            alt={article.image?.alt || article.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 700px"
            priority={true}
            isHero={true}
            width={300}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-grow">
          {article.roofTitle && (
            <div>
              <p className="text-xs md:text-sm text-primary font-medium leading-tight mb-1">
                {article.roofTitle}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-1">{article.titleShort || article.title}</h3>
          </div>

          {/* Metadata */}
          <div className="text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-2 opacity-80 -mb-1">
              {article.comments !== undefined && article.comments > 0 && (
                <div className="flex items-center font-bold">
                  <span>{article.comments}</span>
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 ml-1"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Comments icon"
                  >
                    <path
                      fill="currentColor"
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"
                    />
                  </svg>
                </div>
              )}
              {article.author && (
                <span
                  aria-label={`Author: ${article.author}`}
                  className="text-gray-800"
                >
                  {article.author}
                </span>
              )}
              {article.time && (
                <time
                  dateTime={new Date(article.time * 1000).toISOString()}
                  className="text-gray-800"
                >
                  {formattedTime}
                </time>
              )}

              {article.isPromoted && <span>Promoted</span>}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleItemFullWidth;
