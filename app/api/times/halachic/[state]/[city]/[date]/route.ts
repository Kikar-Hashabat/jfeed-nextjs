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

    const response = await axios.get("https://www.hebcal.com/zmanim", {
      params: {
        cfg: "json",
        geonameid: cityData.geonameid,
        date,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch zmanim data" },
      { status: 500 }
    );
  }
}
