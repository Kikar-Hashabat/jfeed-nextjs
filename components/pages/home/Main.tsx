import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ResponsiveArticleProps {
  article: Article;
}

const MainAr: React.FC<ResponsiveArticleProps> = ({ article }) => {
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
              className="object-cover rounded"
              sizes="100vw"
              priority={true}
            />
          </div>

          {/* Content Section */}
          <div className="px-4 py-6 md:px-0">
            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              {article.titleShort || article.title}
            </h1>

            {/* Subtitle/Description */}
            {article.subTitle && (
              <p className="text-lg md:text-xl text-gray-600 mb-4 text-center">
                {article.subTitleShort || article.subTitle}
              </p>
            )}

            {/* Date and Source */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 ">
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

export default MainAr;
