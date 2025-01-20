import { NextResponse } from "next/server";

interface Props {
  params: { slug: string };
}

export async function GET(request: Request, { params }: Props) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Author slug is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://a.jfeed.com/v1/authors/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error ${res.status}: Failed to fetch author` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 }
    );
  }
}
