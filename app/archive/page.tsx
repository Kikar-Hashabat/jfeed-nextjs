import React from "react";
import { getArticlesV2, getPopularTags } from "@/utils/api";
import Link from "next/link";
import { Article } from "@/types";
import { Tag, Grid2X2 } from "lucide-react";
import { generateArchiveMetadata } from "@/components/seo/archive";
import { XMLParser } from "fast-xml-parser";
import ClientArchiveCalendar from "@/components/pages/archive/ClientArchiveCalendar";

const INITIAL_ARTICLES_BATCH_LIMIT = 50;
const ARTICLES_BATCH_LIMIT = 5;

async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/sitemap/categories`,
    {
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  const text = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsedXml = parser.parse(text);
  const urls = parsedXml.urlset.url;

  return urls.map((url: { loc: string; lastmod: string }) => ({
    href: url.loc.replace("https://www.jfeed.com/", ""),
    lastmod: url.lastmod,
  }));
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return generateArchiveMetadata(Promise.resolve(searchParams));
}

interface PageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
    day?: string;
  }>;
}

async function fetchArticlesForDate(startDate: number, endDate: number) {
  const allArticles: Map<string, Article> = new Map(); // Use a Map to track unique articles
  let page = 0;

  // Fetch the first batch with limit 50
  const firstBatch = await getArticlesV2({
    startDate: startDate.toString(),
    endDate: endDate.toString(),
    limit: INITIAL_ARTICLES_BATCH_LIMIT,
    page: 0,
  });

  firstBatch.forEach((article) =>
    allArticles.set(article.id.toString(), article)
  );

  // If the first batch contains fewer than 50 articles, stop here
  if (firstBatch.length < INITIAL_ARTICLES_BATCH_LIMIT) {
    return Array.from(allArticles.values()); // Return unique articles
  }

  // Continue fetching with a limit of 5
  page = 1;
  while (true) {
    const articles = await getArticlesV2({
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      limit: ARTICLES_BATCH_LIMIT,
      page,
    });

    if (articles.length === 0) break; // Stop if no articles are returned

    articles.forEach((article) =>
      allArticles.set(article.id.toString(), article)
    );
    if (articles.length < ARTICLES_BATCH_LIMIT) break; // Stop if batch is less than limit

    page++;
  }

  return Array.from(allArticles.values()); // Return unique articles
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const today = new Date();
  const params = await searchParams;

  const selectedYear = params.year || today.getFullYear().toString();
  const selectedMonth = params.month || (today.getMonth() + 1).toString();
  const selectedDay = params.day || today.getDate().toString();

  const [popularTags, categories] = await Promise.all([
    getPopularTags(),
    getCategories(),
  ]);

  const startDate = new Date(
    parseInt(selectedYear),
    parseInt(selectedMonth) - 1,
    parseInt(selectedDay)
  ).getTime();

  const endDate = new Date(
    parseInt(selectedYear),
    parseInt(selectedMonth) - 1,
    parseInt(selectedDay),
    23,
    59,
    59,
    999
  ).getTime();

  const articles = await fetchArticlesForDate(startDate, endDate);

  return (
    <main className="min-h-screen bg-white" aria-label="News Archive">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl  text-gray-900 mb-3">News Archive</h1>
          <p className="text-gray-600">
            Browse our comprehensive collection of articles
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar with Calendar */}
          <nav className="lg:col-span-3 space-y-8" aria-label="Filters">
            <ClientArchiveCalendar
              currentYear={parseInt(selectedYear)}
              currentMonth={parseInt(selectedMonth) - 1}
              currentDay={parseInt(selectedDay)}
            />

            {/* Categories */}
            <section className="border border-gray-200 rounded">
              <header className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="flex items-center gap-2  text-gray-900">
                  <Grid2X2 className="w-4 h-4 text-gray-600" /> Categories
                </h2>
              </header>
              <div className="p-4">
                <ul className="flex flex-col gap-2">
                  {categories.map(({ href }: { href: string }) => (
                    <li key={href}>
                      <Link
                        href={`/${href}`}
                        className="text-gray-600 hover:text-blue-700 transition-colors"
                      >
                        {href.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Popular Tags */}
            <section className="border border-gray-200 rounded">
              <header className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="flex items-center gap-2  text-gray-900">
                  <Tag className="w-4 h-4 text-gray-600" /> Popular Tags
                </h2>
              </header>
              <div className="p-4">
                <ul className="flex flex-wrap gap-2">
                  {popularTags?.map((tag) => (
                    <li key={tag.id}>
                      <Link
                        href={`/tags/${tag.slug}`}
                        className="text-sm text-gray-600 hover:text-blue-700 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </nav>

          {/* Main Content */}
          <section className="lg:col-span-9">
            <div className="border border-gray-200 rounded">
              <header className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className=" text-xl text-gray-900">
                  {new Date(startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
              </header>

              {articles.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {articles.map((article) => (
                    <li key={article.id} className="p-6 hover:bg-gray-50">
                      <article>
                        <Link
                          href={`/${article.categorySlug}/${article.slug}`}
                          className="group block"
                        >
                          <h3 className=" text-lg text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <time
                              dateTime={new Date(article.time).toISOString()}
                            >
                              {new Date(article.time).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </time>
                            {article.author && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span>{article.author}</span>
                              </>
                            )}
                          </div>
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-600">
                    No articles found for this date.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
