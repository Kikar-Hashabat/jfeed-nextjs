import React from "react";
import Link from "next/link";
import { Article } from "@/types";
import { MessageCircle, Clock } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ArticleItemBigProps {
  article: Article;
  withSubTitle?: boolean | "desktop-only";
  categoryColor?: string;
}

const ArticleItemMain = ({ article, withSubTitle }: ArticleItemBigProps) => {
  const categorySlug =
    typeof article.categorySlug === "string" ? article.categorySlug : "general";

  const articleUrl = `/${categorySlug}/${article.slug}`;

  return (
    <div
      className={`mb-2 block cursor-pointer ${
        article.isPromoted ? "bg-black/[0.03]" : ""
      }`}
    >
      <div className="relative overflow-hidden aspect-[1.65/1]">
        <Link href={articleUrl} prefetch={true}>
          <OptimizedImage
            src={article.image?.src || ""}
            alt={article.image?.alt || article.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 700px"
            priority={true}
            isHero={true}
          />
        </Link>

        {article.roofTitle && (
          <div
            className="absolute bottom-0 left-0 p-2 text-lg md:text-base font-normal text-white max-w-max bg-primary"
            style={{ backgroundColor: article.categoryColor }}
          >
            {article.roofTitle}
          </div>
        )}
      </div>

      <div className="article-content mt-1">
        <h2 className="font-semibold">{article.titleShort || article.title}</h2>

        {withSubTitle && (
          <p
            className={`text-lg leading-tight font-normal my-1 ${
              withSubTitle === "desktop-only" ? "hidden lg:block" : ""
            }`}
          >
            {article.subTitleShort || article.subTitle}
          </p>
        )}
        <div className="mt-0 -mb-1">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {article.author && (
              <span className="font-medium">{article.author}</span>
            )}

            {typeof article.comments === "number" && (
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{article.comments}</span>
              </div>
            )}

            {article.time && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>
                  {new Date(article.time).toLocaleDateString("en-US", {})}
                </span>
              </div>
            )}

            {article.isPromoted && (
              <span className="text-primary-600">Promoted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleItemMain;
