// @ts-nocheck
import React, { Suspense } from "react";
import SearchResults from "@/components/pages/search/SearchResults";
import { Metadata } from "next";
import SearchBox from "@/components/pages/search/SearchBox";

export const metadata: Metadata = {
  title: "Search Results",
};

export default async function SearchPage({ searchParams }: any) {
  const query = searchParams?.q;

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <SearchBox />
        <h1 className="text-2xl font-bold mb-6">Search Results</h1>
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </main>
  );
}
