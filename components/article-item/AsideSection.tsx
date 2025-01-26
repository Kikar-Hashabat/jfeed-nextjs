import { memo } from "react";
import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";
import { MessageSquare } from "lucide-react";
import Title from "../Title";

interface AsideSectionProps {
  title: string;
  articles: Article[];
}

export const AsideSection = memo(({ articles, title }: AsideSectionProps) => {
  return (
    <section aria-labelledby={`aside-${title.toLowerCase()}-title`}>
      <Title
        tag="h3"
        id={`aside-${title.toLowerCase()}-title`}
        className="text-2xl font-medium"
        title={title}
      />

      <ul className="space-y-6">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="group block"
              aria-labelledby={`aside-article-${article.id}-title`}
            >
              <article className="flex gap-4">
                <div className="relative w-36 h-36 flex-shrink-0 bg-black">
                  <OptimizedImage
                    src={article.image?.src || ""}
                    alt={article.image?.alt || ""}
                    fill
                    sizes="(max-width: 768px) 160px, 260px"
                    className="object-cover"
                  />
                </div>
                <div>
                  {article.roofTitle && (
                    <p className="text-xs text-primary font-medium">
                      {article.roofTitle}
                    </p>
                  )}
                  <h3
                    id={`aside-article-${article.id}-title`}
                    className="text-base font-medium group-hover:text-primary transition-colors"
                  >
                    {article.titleShort || article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    {article.comments > 0 && (
                      <span className="flex items-center gap-1">
                        {article.comments}
                        <MessageSquare size={14} aria-label="Comments" />
                      </span>
                    )}
                    {article.author && <span>{article.author}</span>}
                    {article.time && (
                      <time
                        dateTime={new Date(article.time * 1000).toISOString()}
                      >
                        {new Date(article.time * 1000).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </time>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
});

AsideSection.displayName = "AsideSection";
