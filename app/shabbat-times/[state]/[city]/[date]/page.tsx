import { Suspense } from "react";
import { locations } from "@/data/locations";
import { getShabbatTimes } from "@/utils/api";
import ShabbatTimesContent from "@/components/pages/times/ShabbatTimesContent";
import { ShabbatTimesResponse } from "@/types/locations";
import {
  generateShabbatTimesMetadata,
  generateShabbatTimesStructuredData,
} from "@/components/seo/times";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; date: string }>;
}) {
  const { state, city, date } = await params;

  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    return {
      title: "Location Not Found | JFeed",
      description: "The requested location could not be found.",
    };
  }

  const data = await getShabbatTimes(state, city, date);
  return generateShabbatTimesMetadata(cityData, date, data);
}

export default async function ShabbatTimesPage({
  params,
}: {
  params: Promise<{ state: string; city: string; date: string }>;
}) {
  const { state, city, date } = await params;

  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold">Location not found</h1>
        <p className="mt-4 text-gray-500">Please select a valid location.</p>
      </div>
    );
  }

  const data = await getShabbatTimes(state, city, date);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateShabbatTimesStructuredData(cityData, date, data)
          ),
        }}
      />
      <main className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Shabbat Times</h1>
        <Suspense fallback={<div className="h-16" />}>
          <ShabbatTimesContent
            city={cityData}
            data={data as ShabbatTimesResponse}
            date={date}
          />
        </Suspense>
      </main>
    </>
  );
}
