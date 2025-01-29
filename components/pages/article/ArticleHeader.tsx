import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { ArticleAuthor } from "@/types/article";
import { formatDateAndTime } from "@/utils/date";
//import XIcon from "@mui/icons-material/X";

interface ArticleHeaderProps {
  roofTitle: string;
  title: string;
  subTitle: string;
  author: ArticleAuthor;
  publishDate: number;
  modifiedDate?: number | null;
  readTime: number;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  roofTitle,
  title,
  subTitle,
  author,
  publishDate,
  modifiedDate,
  readTime,
}) => {
  return (
    <header className="mb-4">
      {roofTitle && (
        <div className="text-sm font-medium text-primary bg-roofbg p-3 mb-4 inline-flex">
          {roofTitle}
        </div>
      )}

      <h1 className="font-inter text-4xl md:text-5xl font-bold leading-tight mb-4">
        {title}
      </h1>

      {subTitle && <p className="text-xl text-gray-700 mb-4">{subTitle}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {author.image && (
            <Image
              src={author.image}
              alt={author.name}
              title={author.name}
              width={150}
              height={150}
              className="rounded-full border border-gray-500 object-cover h-12 w-12"
            />
          )}
          <div>
            <Link
              href={author.url}
              className="font-medium text-gray-900 hover:text-primary transition-colors"
            >
              {author.name}
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <time dateTime={new Date(publishDate).toISOString()}>
              {formatDateAndTime(publishDate)}
            </time>
          </div>

          {modifiedDate && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Updated:</span>
              <time dateTime={new Date(modifiedDate).toISOString()}>
                {formatDateAndTime(modifiedDate)}
              </time>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{readTime} min read</span>
          </div>

          {author.twitter && (
            <Link
              href={author.twitter}
              className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
              aria-label={`Visit ${author.name}'s Twitter profile`}
            >
              <Image
                src="/icons/x.svg"
                alt="Twitter icon for author's Twitter profile"
                width={20}
                height={20}
              />
              <span className="sr-only">Twitter</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
