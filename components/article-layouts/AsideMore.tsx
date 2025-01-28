import { Article } from "@/types";
import { memo } from "react";
import { OptimizedImage } from "../OptimizedImage";
import Link from "next/link";

const AsideMore = memo(
  ({
    articles,
    withImage,
    title,
  }: {
    articles: Article[];
    withImage: boolean;
    title: string;
  }) => {
    return (
      <section className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-primary"></div>
          <h2 className="text-base text-primary font-bold uppercase">
            {title}
          </h2>
        </div>

        <ul className="flex flex-col">
          {articles.slice(0, 4).map((article, index) => (
            <li key={article.id}>
              <Link
                href={`/${article.categorySlug}/${article.slug}`}
                className="group block"
              >
                <article className="flex flex-col gap-2">
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

                  <h3
                    className={`text-base text-stone-700 font-${
                      index == 0 ? "bold" : "semi-bold"
                    } text-${
                      index == 0 ? "stone-500" : "stone-900"
                    } group-hover:text-red-600`}
                  >
                    {article.titleShort || article.title}
                  </h3>

                  <div className="flex items-center text-xs text-zinc-400 uppercase">
                    <time dateTime={new Date(article.time).toISOString()}>
                      {new Date(article.time).toLocaleDateString("de-DE")}
                    </time>
                    <span className="mx-2">|</span>
                    <span>{article.categorySlug}</span>
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
AsideMore.displayName = "AsideMore";

export default AsideMore;
