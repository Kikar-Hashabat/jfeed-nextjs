import { memo } from "react";
import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import AsideTitle from "../AsideTitle";

interface AsideSectionProps {
  title: string;
  withImage: boolean;
  articles: Article[];
}

const Aside = memo(({ articles, withImage, title }: AsideSectionProps) => {
  return (
    <section
      className="flex flex-col px-1 max-w-[285px] mb-3"
      aria-labelledby={`most-talked-${title.toLowerCase()}-title`}
    >
      <AsideTitle
        tag="h4"
        id={`most-talked-${title.toLowerCase()}-title`}
        title={title}
      />

      <ul className="flex flex-col justify-center items-center p-4 self-end w-full border border-solid border-neutral-200">
        {articles.map((article, index) => (
          <li key={article.id} className={index > 0 ? "" : ""}>
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="group block"
              aria-labelledby={`most-talked-article-${article.id}-title`}
            >
              <article className="flex flex-col w-60 max-w-full">
                {withImage && (
                  <div
                    className={`flex flex-col w-full rounded relative aspect-[1.74] ${
                      index !== 0 ? "mt-6" : ""
                    }`}
                  >
                    <OptimizedImage
                      src={article.image?.src || ""}
                      alt={article.image?.alt || ""}
                      fill
                      sizes="(max-width: 768px) 160px, 260px"
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <h4
                  id={`most-talked-article-${article.id}-title`}
                  className={`mt-3 text-base font-bold group-hover:text-red-700 transition-colors ${
                    withImage ? "inhirit" : "text-gray-600"
                  }`}
                >
                  {article.titleShort || article.title}
                </h4>
                <div className="flex items-center gap-2 mt-3 text-sm font-medium leading-none uppercase text-zinc-400">
                  {article.time && (
                    <time dateTime={new Date(article.time).toISOString()}>
                      {new Date(article.time).toLocaleDateString("de-DE")}
                    </time>
                  )}
                  <span>|</span>
                  <span>{article.categorySlug.toUpperCase()}</span>
                  {article.comments > 0 && (
                    <span className="flex items-center gap-1">
                      {article.comments}
                      <MessageSquare size={14} aria-label="Comments" />
                    </span>
                  )}
                </div>
              </article>
            </Link>
            {!withImage && (
              <hr className="mt-3 border border-solid border-neutral-200" />
            )}
          </li>
        ))}

        {withImage && (
          <li className="flex overflow-hidden gap-1.5 justify-center items-center pt-4 mt-8 w-full text-base font-medium leading-none uppercase border-t border-zinc-300 text-zinc-800">
            <Link
              href="/news"
              className="flex items-center hover:text-red-700 transition-colors"
              aria-label="See more most talked articles"
            >
              <span className="self-stretch my-auto">see more</span>
              <Image
                src="/icons/right.svg"
                alt="Comments"
                width={25}
                height={25}
              />
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
});

Aside.displayName = "MostTalked";

export default Aside;
