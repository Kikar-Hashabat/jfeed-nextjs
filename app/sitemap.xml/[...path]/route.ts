import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await the params
    const { path } = await context.params;
    const pathString = path.join("/");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v2/sitemap/${pathString}`
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching sitemap:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return new NextResponse(null, { status: 404 });
      }
    }

    return new NextResponse(null, { status: 500 });
  }
}
