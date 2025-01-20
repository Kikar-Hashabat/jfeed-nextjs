import { NextResponse } from "next/server";

interface Props {
  params: { slug: string };
}

export async function GET(request: Request, { params }: Props) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Category slug is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://a.jfeed.com/v2/categories/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Error ${res.status}: Failed to fetch category` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
