import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";
import { Article } from "@/types";

const ArticleLayout = ({ article }: { article: Article }) => {
  return (
    <Link
      href={`/${article.categorySlug}/${article.slug}`}
      key={article.id}
      className="group"
    >
      <div className="flex flex-col gap-2">
        {article.image?.src && (
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

        <h3 className="text-base font-bold">
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
  );
};

export default ArticleLayout;
