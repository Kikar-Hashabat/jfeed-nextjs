import { NextResponse } from "next/server";

interface Props {
  params: { slug: string };
}

export async function GET(request: Request, { params }: Props) {
  const { slug } = await Promise.resolve(params);

  if (!slug) {
    return NextResponse.json(
      { error: "Article slug is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://a.jfeed.com/v2/articles/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error ${res.status}: Failed to fetch article` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
