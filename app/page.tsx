// app/page.tsx
import type { Metadata } from "next";
import { ArticleCard } from "@/components/ui/ArticleCard";
import type { Article } from "@/types/article";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "JFeed - Latest Jewish News & Updates",
  description:
    "Stay informed with the latest Jewish news, Israel updates, and worldwide coverage of events affecting the Jewish community.",
  openGraph: {
    title: "JFeed - Latest Jewish News & Updates",
    description:
      "Stay informed with the latest Jewish news, Israel updates, and worldwide coverage of events affecting the Jewish community.",
    images: [
      {
        url: "https://your-domain.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "JFeed News Homepage",
      },
    ],
  },
};

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/articles`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("API error:", error);
      throw new Error(error.error || "Failed to fetch articles");
    }

    return res.json();
  } catch (error) {
    console.error("Error in getArticles:", error);
    throw error;
  }
}

export default async function Home() {
  let articles: Article[] = [];

  try {
    articles = await getArticles();
  } catch (error) {
    console.error("Error in Home component:", error);
    // You might want to add error UI here
  }

  if (articles.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>No articles available at the moment. Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ArticleCard article={articles[0]} featured />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.slice(1).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
