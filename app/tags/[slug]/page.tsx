import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Tag {
  id: number;
  slug: string;
  name: string;
  isLean: boolean;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  metaKeywords: string;
  autoLink: boolean;
  status: string;
  metadata: Record<string, unknown>;
  image: string | null;
  content: string | null;
  type: string;
  created: string;
  updated: string;
  deletedAt: string | null;
  keywords: string[];
  imageSrc: string | null;
  articlesCount: number;
}

interface Article {
  id: number;
  slug: string;
  author: string;
  categoryId: number;
  categorySlug: string;
  image: {
    v: number;
    src: string;
    height: number;
    width: number;
    alt: string;
    credit: string;
    preview: string | null;
  };
  title: string;
  titleShort: string | null;
  subTitle: string;
  roofTitle: string;
  redirectUrl: string | null;
  time: number;
  lastUpdate: number | null;
  props: string[];
}

async function getTagData(slug: string): Promise<Tag> {
  try {
    const res = await fetch(`https://a.jfeed.com/v1/tags/${slug}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tag: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching tag data:", error);
    throw error;
  }
}
async function getTagArticles(
  tagId: number,
  page: number = 1
): Promise<Article[]> {
  if (!tagId) {
    throw new Error("TagId is required");
  }

  const apiUrl = `https://a.jfeed.com/v2/articles?tagId=${tagId}&limit=20&page=${
    page - 1
  }`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      const errorMessage = `Failed to fetch articles: ${res.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getTagArticles:", error);
    throw error;
  }
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params; // Resolve the params
  const tag = await getTagData(resolvedParams.slug);

  return {
    title: tag.metaTitle || `${tag.name} News and Updates | JFeed`,
    description:
      tag.metaDescription ||
      `Latest news and updates about ${tag.name}. Find all related articles and coverage on JFeed.`,
    openGraph: {
      title: tag.metaTitle || `${tag.name} News and Updates`,
      description:
        tag.metaDescription || `Latest news and updates about ${tag.name}`,
      images: tag.image ? [{ url: tag.image }] : [],
    },
  };
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const pageParam = resolvedSearchParams.page;
  const pageNumber = typeof pageParam === "string" ? parseInt(pageParam) : 1;

  const tag = await getTagData(resolvedParams.slug);
  const articles = await getTagArticles(tag.id, pageNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tag Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{tag.name}</h1>
        {tag.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{tag.subtitle}</p>
        )}
        <div className="text-sm text-gray-500">
          {tag.articlesCount.toLocaleString()} articles
        </div>
        {tag.description && tag.description.length > 0 && (
          <div className="mt-4 prose max-w-none">{tag.description}</div>
        )}
      </header>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <article key={`${article.id}-${index}`} className="flex flex-col">
            <div className="group">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-4">
                <Link href={`/${article.categorySlug}/${article.slug}`}>
                  {article.image && article.image.src ? (
                    <Image
                      src={article.image.src}
                      alt={article.image.alt || article.title}
                      width={article.image.width || 640}
                      height={article.image.height || 360}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  {article.props.includes("video") && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {article.image?.credit && (
                    <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                      {article.image.credit}
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-red-600 font-semibold text-sm">
                  {article.roofTitle}
                </span>
                <Link
                  href={`/${article.categorySlug}`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {article.categorySlug.replace("-", " ").toUpperCase()}
                </Link>
              </div>

              <Link href={`/${article.categorySlug}/${article.slug}`}>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {article.subTitle}
                </p>
              </Link>

              <div className="mt-auto flex items-center text-sm text-gray-500">
                <span>{article.author}</span>
                <span className="mx-2">•</span>
                <time dateTime={new Date(article.time).toISOString()}>
                  {formatDate(article.time)}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center gap-2">
        {pageNumber > 1 && (
          <Link
            href={`/tags/${resolvedParams.slug}?page=${pageNumber - 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Link>
        )}
        {articles.length === 20 && (
          <Link
            href={`/tags/${resolvedParams.slug}?page=${pageNumber + 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
