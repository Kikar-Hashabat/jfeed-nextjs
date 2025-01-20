import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Category {
  id: number;
  slug: string;
  parents: Array<{ id: number; slug: string; name: string }>;
  name: string;
  title: string;
  subTitle: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  image: string | null;
}

interface Article {
  id: number;
  slug: string;
  author: string;
  categorySlug: string;
  image: {
    src: string;
    height: number;
    width: number;
    alt: string | null;
    credit: string | null;
  };
  title: string;
  subTitle: string;
  roofTitle: string;
  time: number;
}

type Props = {
  params: {
    categorySlug: string;
  };
  searchParams?: { [key: string]: string | string[] };
};

async function fetchCategoryData(slug: string): Promise<Category> {
  try {
    const res = await fetch(`https://a.jfeed.com/v2/categories/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch category data: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
}

async function fetchCategoryArticles(
  categorySlug: string,
  page: number = 1,
  limit: number = 20
): Promise<Article[]> {
  if (!categorySlug) {
    throw new Error("Category slug is required");
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/articles?categorySlug=${categorySlug}&limit=${limit}&page=${page}`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 300 } });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch category articles");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in fetchCategoryArticles:", error);
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const category = await fetchCategoryData(resolvedParams.categorySlug);

  return {
    title: category.metaTitle || `${category.name} News and Updates | JFeed`,
    description:
      category.metaDescription ||
      `Stay updated with the latest news on ${category.name} at JFeed.`,
    openGraph: {
      title: category.metaTitle || `${category.name} News`,
      description:
        category.metaDescription ||
        `Latest updates and articles on ${category.name}`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const page = parseInt(resolvedSearchParams?.page as string) || 1;
  const categorySlug = resolvedParams.categorySlug;

  try {
    const [category, articles] = await Promise.all([
      fetchCategoryData(categorySlug),
      fetchCategoryArticles(categorySlug, page),
    ]);

    if (!category) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold">{category.title}</h1>
          {category.subTitle && (
            <p className="text-lg text-gray-600">{category.subTitle}</p>
          )}
          <p className="text-sm text-gray-500">{category.metaDescription}</p>
        </header>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="flex flex-col">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Link href={`/${article.categorySlug}/${article.slug}`}>
                  {article.image && article.image.src ? (
                    <Image
                      src={article.image.src}
                      alt={article.image.alt || article.title}
                      width={article.image.width}
                      height={article.image.height}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </Link>
                {article.image.credit && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 rounded">
                    {article.image.credit}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600">{article.subTitle}</p>
              <div className="mt-auto text-sm text-gray-500">
                <span>{article.author}</span> •{" "}
                <time dateTime={new Date(article.time).toISOString()}>
                  {new Date(article.time).toLocaleDateString()}
                </time>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-4">
          {page > 1 && (
            <Link href={`/${categorySlug}?page=${page - 1}`} className="btn">
              Previous
            </Link>
          )}
          {articles.length === 20 && (
            <Link href={`/${categorySlug}?page=${page + 1}`} className="btn">
              Next
            </Link>
          )}
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}
