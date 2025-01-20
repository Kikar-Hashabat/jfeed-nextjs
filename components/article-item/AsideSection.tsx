import { Article } from "@/types";
import { MessageSquareQuote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Title from "../Title";

interface AsideSectionProps {
  title: string;
  articles: Article[];
}

export function AsideSection({ articles, title }: AsideSectionProps) {
  return (
    <aside aria-labelledby="aside-section-title">
      {/* Title */}
      <header className="mb-4">
        <Title
          title={title}
          id="aside-section-title"
          className="text-2xl font-medium flex-grow"
          tag="h2"
        />
      </header>

      {/* Articles List */}
      <section className="space-y-6" aria-label={`${title} articles`}>
        <ul className="space-y-6" role="list">
          {articles.map((article) => (
            <li key={article.id} className="block">
              <Link
                href={`/${article.categorySlug}/${article.slug}`}
                className="group"
                aria-label={`Read article: ${article.title}`}
              >
                <article className="flex gap-4">
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <Image
                      src={article.image?.src || "/placeholder.jpg"}
                      alt={article.image?.alt || `Image for ${article.title}`}
                      title={article.image?.alt || article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 120px"
                      quality={90}
                    />
                  </div>
                  <div className="flex-grow">
                    {article.roofTitle && (
                      <span className="text-xs text-primary font-medium">
                        {article.roofTitle}
                      </span>
                    )}
                    <h4 className="text-base leading-snug group-hover:text-red-500">
                      {article.titleShort || article.title}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      {article.comments > 0 && (
                        <div className="flex items-center gap-1">
                          {article.comments} <MessageSquareQuote size={13} />|
                        </div>
                      )}
                      {article.author && <span>{article.author}</span>}
                      {article.author && article.time && <span>|</span>}
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
    </aside>
  );
}
