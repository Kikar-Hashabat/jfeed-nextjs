// app/api/navigation/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://a.jfeed.com/v1/lists/nav", {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!res.ok) {
      console.error("Navigation API error:", {
        status: res.status,
        statusText: res.statusText,
      });
      return NextResponse.json(
        { error: `External API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch navigation:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}
