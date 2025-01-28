import { Article } from "@/types";
import Link from "next/link";
import { OptimizedImage } from "../OptimizedImage";

const MainCategory = ({ article }: { article: Article }) => {
  return (
    <article>
      <Link href={`/${article.categorySlug}/${article.slug}`} className="block">
        <div
          className={`flex flex-col md:flex-row border-r-0 rounded overflow-hidden cursor-pointer h-full mb-4
              ${article.isPromoted ? "bg-gray-50" : "bg-white"}`}
        >
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between mr-3 order-2 md:order-1">
            <div>
              <h2 className="text-2xl font-bold leading-tight my-4">
                {article.titleShort || article.title}
              </h2>

              {article.subTitle && (
                <p className="text-base md:text-lg md:min-h-[140px] leading-normal">
                  {article.subTitleShort || article.subTitle}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2 opacity-80">
                {article.author && <span>{article.author}</span>}
                {article.time && (
                  <>
                    <span>|</span>
                    <span>{"formattedTime"}</span>
                  </>
                )}
                {article.isPromoted && (
                  <>
                    <span>|</span>
                    <span>Promoted</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative w-full md:w-[60%] aspect-video md:h-[400px] order-1 md:order-2">
            <OptimizedImage
              src={article.image?.src || ""}
              alt={article.image?.alt || article.title}
              width={600}
              fill
              className="object-cover rounded"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority={true}
            />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MainCategory;
