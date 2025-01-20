import { Suspense } from "react";
import { Metadata } from "next";
import { locations } from "@/data/locations";
import ShabbatTimesContent from "@/components/ShabbatTimesContent";

interface Props {
  params: {
    state: string;
    city: string;
    date: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, date } = await Promise.resolve(params);

  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    return {
      title: "City Not Found - JFeed Israel News",
      description: "The requested city could not be found.",
    };
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = `Shabbat Times - ${cityData.name}, ${cityData.state.name} - JFeed Israel News`;
  const description = `Shabbat times for ${cityData.name}, ${cityData.state.name} on ${formattedDate}. Get accurate candle lighting and havdalah times.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "JFeed Israel News",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/shabbat-times/${state}/${city}/${date}`,
    },
  };
}

export default async function ShabbatTimesPage({ params }: Props) {
  const { state, city, date } = await Promise.resolve(params);
  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    throw new Error("City not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/times/shabbat/${state}/${city}/${date}`
  );
  const data = await response.json();

  return (
    <main className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shabbat Times</h1>
      <Suspense fallback={<div className="h-16" />}>
        <ShabbatTimesContent city={cityData} data={data} date={date} />
      </Suspense>
    </main>
  );
}
