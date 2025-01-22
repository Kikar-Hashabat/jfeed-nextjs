import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthor, getCategoryBySlug, getTag, getArticle } from "./utils/api";

// Cache implementation
interface CacheEntry {
  data: any;
  timestamp: number;
}

class APICache {
  private cache: Map<string, CacheEntry>;
  private readonly ttl: number;
  private readonly maxSize: number;

  constructor(ttl: number, maxSize = 1000) {
    this.cache = new Map();
    this.ttl = ttl;
    this.maxSize = maxSize;
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

    if (this.cache.size >= this.maxSize) {
      const oldest = [...this.cache.entries()]
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, Math.floor(this.maxSize * 0.2));
      oldest.forEach(([key]) => this.cache.delete(key));
    }

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

const apiCache = new APICache(5 * 60 * 1000);

// Static configurations
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
  "xml",
]);

export async function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const pathname = url.pathname;

    // Handle sitemap routes first
    if (pathname === '/sitemap.xml' || pathname.startsWith('/sitemap/')) {
      if (pathname === '/sitemap.xml') {
        return NextResponse.rewrite(new URL('/api/sitemap', request.url));
      }
      
      // For sub-sitemaps (e.g., /sitemap/categories)
      const pathSegments = pathname.split('/').slice(2); // Remove empty and 'sitemap'
      const rewritePath = `/api/sitemap/${pathSegments.join('/')}`;
      console.log('Rewriting to:', rewritePath); // Debug log
      return NextResponse.rewrite(new URL(rewritePath, request.url));
    }

    // Handle AMP redirects
    if (pathname.includes("/_amp/")) {
      const newPath = pathname.replace("/_amp/", "/");
      return NextResponse.redirect(new URL(newPath, request.url), {
        status: 301,
      });
    }

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

    // Route handling
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

            if (
              article.categories?.length > 0 &&
              article.categories[0].slug &&
              article.categories[0].slug !== categorySlug
            ) {
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

    // Add security headers
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static/|_next/image/|favicon\\.ico$|robots\\.txt$|manifest\\.json$).*)",
  ],
};