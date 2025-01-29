import { Article } from "@/types";
import ArticleLayout from "./ArticleLayout";
import AsideMore from "./AsideMore";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";

export const ArticleLayoutOne = ({
  articles,
  withImage,
}: {
  articles: Article[];
  withImage: boolean;
}) => {
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <section className="grid grid-cols-2 gap-4">
          {articles?.slice(0, 4).map((article) => (
            <ArticleLayout key={article.id} article={article} />
          ))}
        </section>
      </div>
      <div className="w-72">
        <AsideMore
          articles={articles.slice(4, 8)}
          withImage={withImage}
          title="MORE"
        />
      </div>
    </div>
  );
};

export const ArticleLayoutOneMobile = ({
  articles,
}: {
  articles: Article[];
}) => {
  return (
    <div className="md:hidden grid grid-cols-1 gap-6 mt-3">
      <section className="grid grid-cols-1 gap-4">
        {articles.slice(0, 6).map((article: Article) => (
          <Link
            href={`/${article.categorySlug}/${article.slug}`}
            key={article.id}
            className="group flex gap-4 items-start"
          >
            <div className="w-32 flex-shrink-0">
              {article.image?.src && (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <OptimizedImage
                    src={article.image.src}
                    alt={article.image.alt || ""}
                    fill
                    sizes="(max-width: 768px) 160px, 260px"
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold leading-tight mb-2">
                {article.titleShort || article.title}
              </h3>

              <div className="flex items-center text-xs text-zinc-400 uppercase">
                <time dateTime={new Date(article.time).toISOString()}>
                  {new Date(article.time).toLocaleDateString("de-DE")}
                </time>
                {article.categorySlug && (
                  <>
                    <span className="mx-2">|</span>
                    <span>{article.categorySlug}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};
