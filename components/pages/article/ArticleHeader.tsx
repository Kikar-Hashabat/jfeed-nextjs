import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { ArticleAuthor } from "@/types/article";
import { formatDateAndTime } from "@/utils/date";

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
    <header className="mb-8">
      {roofTitle && (
        <div className="text-sm font-medium text-primary bg-roofbg p-3 mb-2 inline-flex">
          {roofTitle}
        </div>
      )}

      <h1 className="font-newsreader text-4xl md:text-5xl font-bold leading-tight mb-4">
        {title}
      </h1>

      {subTitle && <p className="text-xl text-gray-700 mb-6">{subTitle}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {author.image && (
            <Image
              src={author.image}
              alt={author.name}
              title={author.name}
              width={40}
              height={40}
              className="rounded-full"
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
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 512 512"
                id="twitter"
              >
                <g clipPath="url(#clip0_84_15697)">
                  <rect width="512" height="512" fill="#000" rx="60"></rect>
                  <path
                    fill="#fff"
                    d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_84_15697">
                    <rect width="512" height="512" fill="#fff"></rect>
                  </clipPath>
                </defs>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
