import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v2/sitemap`
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching root sitemap:", error);
    return new NextResponse(null, { status: 500 });
  }
}
