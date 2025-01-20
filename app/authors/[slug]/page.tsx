import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Author {
  id: number;
  slug: string;
  name: string;
  bio: string;
  image: string | null;
  twitter: string | null;
  facebook: string | null;
  wikipedia: string | null;
}

interface Article {
  id: number;
  slug: string;
  author: string;
  image: {
    src: string;
    height: number;
    width: number;
    alt: string | null;
    credit: string | null;
  };
  title: string;
  subTitle: string;
  time: number;
}

async function fetchAuthorData(slug: string): Promise<Author> {
  const res = await fetch(`https://a.jfeed.com/v1/authors/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch author data");
  return res.json();
}

async function fetchAuthorArticles(
  authorSlug: string,
  page: number = 1,
  limit: number = 20
): Promise<Article[]> {
  const res = await fetch(
    `https://a.jfeed.com/v2/articles?authorSlug=${authorSlug}&limit=${limit}&page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Failed to fetch author articles");
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params; // Await the params
  const author = await fetchAuthorData(resolvedParams.slug);

  return {
    title: `${author.name} | JFeed Author`,
    description:
      author.bio || `Explore articles and insights by ${author.name} at JFeed.`,
    openGraph: {
      title: `${author.name} | JFeed Author`,
      description: author.bio,
      images: author.image ? [{ url: author.image }] : [],
    },
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: { [key: string]: string | string[] };
}) {
  const resolvedParams = await params; // Await params
  const resolvedSearchParams = searchParams ? await searchParams : {}; // Await searchParams if provided
  const slug = resolvedParams.slug;

  // Safely access `page` from resolvedSearchParams
  const page = parseInt((resolvedSearchParams.page as string) || "1", 10);

  const [author, articles] = await Promise.all([
    fetchAuthorData(slug),
    fetchAuthorArticles(slug, page),
  ]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Author Header */}
      <header className="mb-12 text-center">
        {author.image && (
          <Image
            src={author.image}
            alt={author.name}
            width={150}
            height={150}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold">{author.name}</h1>
        <p className="text-lg text-gray-600">{author.bio}</p>
        <div className="mt-4 flex justify-center space-x-4">
          {author.twitter && (
            <a
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitter
            </a>
          )}
          {author.facebook && (
            <a
              href={author.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Facebook
            </a>
          )}
          {author.wikipedia && (
            <a
              href={author.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Wikipedia
            </a>
          )}
        </div>
      </header>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="flex flex-col">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <Link href={`/article/${article.slug}`}>
                <Image
                  src={article.image.src}
                  alt={article.image.alt || article.title}
                  width={article.image.width}
                  height={article.image.height}
                  className="object-cover w-full h-full"
                />
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
          <Link href={`/authors/${slug}?page=${page - 1}`} className="btn">
            Previous
          </Link>
        )}
        {articles.length === 20 && (
          <Link href={`/authors/${slug}?page=${page + 1}`} className="btn">
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
