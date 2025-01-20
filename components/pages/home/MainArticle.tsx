import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ResponsiveArticleProps {
  article: Article;
}

const MainArticle: React.FC<ResponsiveArticleProps> = ({ article }) => {
  const formattedTime = new Date(article.time * 1000).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  const categorySlug = article.categorySlug || "general";

  return (
    <article>
      <Link href={`/${categorySlug}/${article.slug}`} className="block">
        <div
          className={`flex flex-col md:flex-row border border-gray-200 border-r-0 rounded overflow-hidden cursor-pointer h-full
            ${article.isPromoted ? "bg-gray-50" : "bg-white"}`}
        >
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between p-4 order-2 md:order-1">
            {article.roofTitle && (
              <div>
                <p
                  className="text-xl font-medium leading-none text-primary"
                  style={{ color: article.categoryColor }}
                >
                  {article.roofTitle}
                </p>
              </div>
            )}

            <div>
              <h2 className="text-xl md:text-[2.1em] font-bold leading-tight my-4">
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
                    <span>{formattedTime}</span>
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

          {/* Image Section */}
          <div className="relative w-full md:w-[60%] aspect-video md:h-[400px] order-1 md:order-2">
            <OptimizedImage
              src={article.image?.src || ""}
              alt={article.image?.alt || article.title}
              width={600}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority={true}
            />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MainArticle;
