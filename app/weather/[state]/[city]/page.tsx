import { locations } from "@/data/locations";
import { getWeatherData } from "@/utils/api";
import WeatherDisplay from "@/components/pages/weather/WeatherDisplay";
import {
  generateWeatherMetadata,
  generateWeatherStructuredData,
} from "@/components/seo/weather";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;

  const selectedState = locations.states.find((s) => s.slug === state);
  const selectedCity = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!selectedState || !selectedCity) {
    return {
      title: "Location Not Found | JFeed",
      description: "The requested location could not be found.",
    };
  }

  const weatherData = await getWeatherData(state, city);
  return generateWeatherMetadata(selectedCity, selectedState, weatherData);
}

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;

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

  const weatherData = await getWeatherData(state, city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateWeatherStructuredData(
              selectedCity,
              selectedState,
              weatherData
            )
          ),
        }}
      />
      <div className="container mx-auto py-8 px-4">
        <WeatherDisplay
          initialWeatherData={weatherData}
          selectedState={selectedState}
          selectedCity={selectedCity}
        />
      </div>
    </>
  );
}
