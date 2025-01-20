import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { locations } from "@/data/locations";

export async function GET(
  request: NextRequest,
  { params }: { params: { state: string; city: string; date: string } }
) {
  try {
    const { state, city, date } = await Promise.resolve(params);

    const cityData = locations.cities.find(
      (c) => c.state.slug === state && c.slug === city
    );

    if (!cityData) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const [year, month, day] = date.split("-").map(Number);

    const response = await axios.get("https://www.hebcal.com/shabbat", {
      params: {
        cfg: "json",
        geonameid: cityData.geonameid,
        gy: year,
        gm: month,
        gd: day,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Shabbat API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shabbat times data" },
      { status: 500 }
    );
  }
}
