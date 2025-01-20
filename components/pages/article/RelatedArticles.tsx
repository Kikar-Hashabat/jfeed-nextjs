"use client";

import { Article } from "@/types";
import { getArticlesV2 } from "@/utils/api";
import { useEffect, useState } from "react";
import { CategorySection } from "../home/CategorySection";

export default function RelatedArticles({
  title,
  articleSlug,
  limit = 3,
  page = 1,
  StartSlice = 0,
  endSlice = 3,
}: {
  title: string;
  articleSlug: string;
  limit: number;
  page: number;
  StartSlice: number;
  endSlice: number;
}) {
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    getArticlesV2({
      related: articleSlug,
      limit: limit,
      page: page,
    }).then((articles) => {
      setArticles(articles);
    });
  }, [articleSlug, limit, page]);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="articles">
      <CategorySection
        title={title}
        link=""
        articles={articles.slice(StartSlice, endSlice)}
      />
    </div>
  );
}
