import { NextResponse } from "next/server";
import type { Article } from "@/types/article";

const BASE_API_URL = "https://a.jfeed.com/v2/articles";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const tagId = searchParams.get("tagId");
    const categorySlug = searchParams.get("categorySlug");
    const limit = searchParams.get("limit") || "20";
    const page = searchParams.get("page") || "1";

    // Construct the API URL
    let apiUrl = `${BASE_API_URL}?limit=${limit}&page=${Number(page) - 1}`;

    if (tagId) {
      apiUrl += `&tagId=${tagId}`;
    }

    if (categorySlug) {
      apiUrl += `&categorySlug=${categorySlug}`;
    }

    // Fetch articles from the external API
    const res = await fetch(apiUrl, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      console.error("External API error:", {
        status: res.status,
        statusText: res.statusText,
      });
      return NextResponse.json(
        { error: `External API returned ${res.status}` },
        { status: res.status }
      );
    }

    const articles: Article[] = await res.json();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
