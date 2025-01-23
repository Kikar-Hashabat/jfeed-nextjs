"use client";

import ArticleItemFullWidth from "@/components/article-item/ArticleItemFullWidth";
import { Article, NavCategory } from "@/types";
import { getArticlesV2 } from "@/utils/api";
import { useEffect, useState } from "react";
import Title from "@/components/Title";

export default function RelatedCategories({
  ArticleCategory,
}: {
  ArticleCategory: NavCategory;
}) {
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    getArticlesV2({
      categorySlug: ArticleCategory.slug,
      limit: 12,
      page: 2,
    }).then((articles) => {
      setArticles(articles);
    });
  }, [ArticleCategory.slug]);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="articles">
      <Title
        title={ArticleCategory.name}
        link={ArticleCategory.slug}
        tag="h3"
        className="text-2xl font-medium flex-grow"
      />
      {articles.map((article, index) => (
        <ArticleItemFullWidth key={index} article={article} />
      ))}
    </div>
  );
}
