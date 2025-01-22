import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    console.log("Fetching sitemap for path:", path); // Debug log

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v2/sitemap/${path}`,
      {
        headers: {
          Accept: "application/xml",
        },
      }
    );

    // Debug log
    console.log("API Response status:", response.status);

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching sub-sitemap:", error);

    if (axios.isAxiosError(error)) {
      console.log(
        "Axios error response:",
        error.response?.status,
        error.response?.data
      );

      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: "Sitemap not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch sub-sitemap" },
      { status: 500 }
    );
  }
}
