import { NextResponse } from "next/server";
import type { Article } from "@/types/article";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiUrl = new URL("https://a.jfeed.com/v2/articles");

    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    const res = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
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
