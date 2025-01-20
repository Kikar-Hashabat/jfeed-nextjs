// app/weather/[state]/[city]/page.tsx
import WeatherClient from "@/components/WeatherDisplay";
import { locations } from "@/data/locations";

export default async function WeatherPage({
  params,
}: {
  params: { state: string; city: string };
}) {
  const { state, city } = await Promise.resolve(params);

  const selectedState = locations.states.find((s) => s.slug === state);
  const selectedCity = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!selectedState || !selectedCity) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold">Location not found</h1>
        <p className="mt-4 text-gray-500">Please select a valid location.</p>
      </div>
    );
  }

  const weatherResponse = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/weather/${state}/${city}`,
    { cache: "no-store" }
  );

  const weatherData = await weatherResponse.json();

  return (
    <div className="container mx-auto py-8 px-4">
      <WeatherClient
        initialWeatherData={weatherData}
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
    </div>
  );
}
