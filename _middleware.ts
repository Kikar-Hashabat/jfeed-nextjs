import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthor, getCategoryBySlug, getTag, getArticle } from "./utils/api";

// Cache implementation with type safety and automatic cleanup
interface CacheEntry {
  data: any;
  timestamp: number;
}

class APICache {
  private cache: Map<string, CacheEntry>;
  private readonly ttl: number;

  constructor(ttl: number) {
    this.cache = new Map();
    this.ttl = ttl;
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60_000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  async get<T>(
    key: string,
    fetchFn: () => Promise<T | null>
  ): Promise<T | null> {
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && now - cached.timestamp < this.ttl) {
      return cached.data as T;
    }

    try {
      const data = await fetchFn();
      if (data) {
        this.cache.set(key, { data, timestamp: now });
      }
      return data;
    } catch (error) {
      console.error(`Cache fetch error for key ${key}:`, error);
      return null;
    }
  }
}

// Initialize cache with 5 minutes TTL
const apiCache = new APICache(5 * 60 * 1000);

// Static routes configuration
const STATIC_ROUTES = new Set([
  "weather",
  "shabbat-times",
  "halachic-times",
  "search",
  "archive",
  "_next",
  "api",
  "public",
  "favicon.ico",
  "robots.txt",
  "manifest.json",
]);

// Static file extensions to ignore
const STATIC_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "ico",
  "webp",
  "json",
  "js",
  "css",
]);

export async function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const pathname = url.pathname;

    // Early return for static routes and files
    const firstSegment = pathname.split("/")[1] || "";
    if (STATIC_ROUTES.has(firstSegment)) {
      return NextResponse.next();
    }

    // Check file extensions
    const extension = pathname.split(".").pop()?.toLowerCase();
    if (extension && STATIC_EXTENSIONS.has(extension)) {
      return NextResponse.next();
    }

    // Split path into segments and filter empty ones
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return NextResponse.next();
    }

    // Handle special redirects
    if (pathname === "/tags/") {
      return NextResponse.redirect(new URL("/", request.url), { status: 308 });
    }

    // Handle different path patterns
    switch (segments[0]) {
      case "authors": {
        const authorSlug = segments[1];
        if (authorSlug) {
          const author = await apiCache.get(`author:${authorSlug}`, () =>
            getAuthor(authorSlug)
          );
          if (!author) {
            return NextResponse.redirect(new URL("/", request.url), {
              status: 308,
            });
          }
        }
        break;
      }

      case "tags": {
        const tagSlug = segments[1];
        if (tagSlug) {
          const tag = await apiCache.get(`tag:${tagSlug}`, () =>
            getTag(tagSlug)
          );
          if (!tag) {
            return NextResponse.redirect(new URL("/", request.url), {
              status: 308,
            });
          }
        }
        break;
      }

      default: {
        // Handle category/article paths
        const categorySlug = segments[0];
        const articleSlug = segments[1];

        if (categorySlug) {
          const category = await apiCache.get(`category:${categorySlug}`, () =>
            getCategoryBySlug(categorySlug)
          );

          if (!category) {
            return NextResponse.redirect(new URL("/", request.url), {
              status: 308,
            });
          }

          if (articleSlug) {
            const article = await apiCache.get(`article:${articleSlug}`, () =>
              getArticle(articleSlug)
            );

            if (!article) {
              return NextResponse.redirect(
                new URL(`/${categorySlug}`, request.url),
                { status: 308 }
              );
            }

            // Check if article is in the correct category
            if (article.categories?.[0]?.slug !== categorySlug) {
              return NextResponse.redirect(
                new URL(
                  `/${article.categories[0].slug}/${articleSlug}`,
                  request.url
                ),
                { status: 301 }
              );
            }
          }
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Only redirect to homepage on server errors, not on client errors
    return NextResponse.next();
  }
}

// More specific matcher configuration
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!_next/|api/|public/|favicon\\.ico|robots\\.txt|manifest\\.json|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|json)$).*)",
  ],
};
