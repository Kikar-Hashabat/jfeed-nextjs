// app/api/weather/[state]/[city]/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { locations } from "@/data/locations";
import { WeatherResponse } from "@/types/weather";

export async function GET(
  request: NextRequest,
  { params }: { params: { state: string; city: string } }
) {
  const { state, city } = await Promise.resolve(params);

  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  try {
    const [current, forecast] = await Promise.all([
      axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: cityData.coordinates.lat,
          lon: cityData.coordinates.lon,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
        },
      }),
      axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: {
          lat: cityData.coordinates.lat,
          lon: cityData.coordinates.lon,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
        },
      }),
    ]);

    return NextResponse.json({
      current: current.data,
      forecast: forecast.data,
    } as WeatherResponse);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
