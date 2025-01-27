import { memo } from "react";
import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import AsideTitle from "../AsideTitle";

interface AsideSectionProps {
  title: string;
  layout: "one" | "two" | "three";
  withImage: boolean;
  articles: Article[];
}

const AsideCategory = memo(
  ({ articles, layout, withImage, title }: AsideSectionProps) => {
    switch (layout) {
      case "one":
        return (
          <LayoutOne
            articles={articles}
            withImage={withImage}
            title={title}
            layout={"one"}
          />
        );
      case "two":
        return <div>ddd</div>;
      case "three":
        return <div>ddd</div>;
    }
    return <div>ddd</div>;
  }
);

AsideCategory.displayName = "MostTalked";

export default AsideCategory;

const LayoutOne = ({ articles, withImage, title }: AsideSectionProps) => {
  return (
    <section className="mt-6 flex flex-wrap gap-4">
      {articles.slice(0, 4).map((article, index) => (
        <div key={article.id} className="gap-1">
          <div className="w-full rounded relative aspect-[1.74]">
            <OptimizedImage
              src={article.image?.src || ""}
              alt={article.image?.alt || ""}
              fill
              sizes="(max-width: 768px) 160px, 260px"
              className="object-cover rounded"
            />
          </div>
          <h4>{article.titleShort || article.title}</h4>
          <div>
            <time dateTime={new Date(article.time).toISOString()}>
              {new Date(article.time).toLocaleDateString("de-DE")}
            </time>
            {article.categorySlug && (
              <>
                <span> | </span>
                <span className="uppercase">{article.categorySlug}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};
