import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <article className={featured ? "mb-12" : "flex flex-col"}>
      <Link href={`${article.categorySlug}/${article.slug}`} className="group">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={article.image.src}
            alt={article.image.alt || article.title}
            width={article.image.width}
            height={article.image.height}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
            priority={featured}
          />
          {article.props.includes("video") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`bg-black bg-opacity-50 rounded-full ${
                  featured ? "p-4" : "p-3"
                }`}
              >
                <svg
                  className={`${featured ? "w-12 h-12" : "w-8 h-8"} text-white`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <span className="text-red-600 font-semibold text-sm">
            {article.roofTitle}
          </span>
          {featured ? (
            <h1 className="mt-2 text-3xl font-bold text-gray-900 group-hover:text-blue-600">
              {article.title}
            </h1>
          ) : (
            <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
              {article.title}
            </h2>
          )}
          <p
            className={`mt-${featured ? "3" : "2"} text-gray-500 ${
              featured ? "text-xl" : "line-clamp-2"
            }`}
          >
            {article.subTitle}
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>{article.author}</span>
            <span className="mx-2">•</span>
            <time dateTime={new Date(article.time).toISOString()}>
              {formatDate(article.time)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
