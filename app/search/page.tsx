// @ts-nocheck
import React, { Suspense } from "react";
import SearchResults from "@/components/pages/search/SearchResults";
import SearchBox from "@/components/pages/search/SearchBox";
import Title from "@/components/Title";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  generateSearchMetadata,
  generateSearchStructuredData,
} from "@/components/seo/search";

export async function generateMetadata({ searchParams }: any) {
  return generateSearchMetadata(searchParams);
}

export default async function SearchPage({ searchParams }: any) {
  const query = searchParams?.q;

  const breadcrumbs = [
    { name: "Search", url: "/search", isLink: !query },
    ...(query
      ? [
          {
            name: `Results for "${query}"`,
            url: `/search?q=${encodeURIComponent(query)}`,
            isLink: false,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSearchStructuredData(query)),
        }}
      />

      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={breadcrumbs} />
          <hr className="my-3" />
          <Title
            title={query ? `Search Results for "${query}"` : "Search JFeed"}
            className="text-2xl font-bold mb-6"
            tag="h1"
          />
          <SearchBox initialQuery={query} className="mb-8" />
          <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
