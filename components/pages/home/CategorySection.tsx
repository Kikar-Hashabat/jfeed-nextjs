import { OptimizedImage } from "@/components/OptimizedImage";
import Title from "@/components/Title";
import { Article } from "@/types";
import Link from "next/link";

interface SectionProps {
  title: string;
  link: string;
  articles: Article[];
  isLink?: boolean;
}

export function CategorySection({ title, link, articles }: SectionProps) {
  return (
    <section>
      {/* Title with square design */}
      <header className="flex items-center justify-between mb-4">
        <Title
          link={link}
          title={title}
          className="text-2xl font-medium flex-grow"
          id={link}
          tag="h2"
        />

        <svg
          className="w-6 h-6 rotate-180 text-gray-600"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Arrow icon"
        >
          <path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z"></path>
          <path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z"></path>
        </svg>
      </header>

      {/* Grid layout */}
      <ul
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        role="list"
        aria-label={`${title} articles`}
      >
        {articles.slice(0, 6).map((article, index) => (
          <li
            key={article.id}
            className={`block ${
              article.isPromoted
                ? "bg-gray-50 hover:bg-gray-100 focus:bg-gray-100"
                : ""
            } rounded-md`}
          >
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              aria-label={`Read article: ${article.title}`}
              className="group block"
            >
              <article className="space-y-2">
                {/* Article Image */}
                <div
                  className={`relative aspect-[1.65/1] ${
                    index >= 4 ? "hidden md:block" : ""
                  }`}
                >
                  <OptimizedImage
                    src={article.image?.src || ""}
                    alt={article.image?.alt || article.title}
                    width={600}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
                {/* Article Content */}
                <div className="px-1">
                  <h3 className="text-[1.1em] font-bold leading-tight group-hover:text-primary group-focus:text-primary group-active:text-primary">
                    {article.titleShort || article.title}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1 flex items-center">
                    {article.author && (
                      <span className="text-gray-800">{article.author}</span>
                    )}
                    {article.time && article.author && (
                      <span className="mx-1">|</span>
                    )}
                    {article.time && (
                      <time
                        className="text-gray-800"
                        dateTime={new Date(article.time * 1000).toISOString()}
                        aria-label={`Published at ${new Date(
                          article.time * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}`}
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
}
