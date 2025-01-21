// components/seo/weather.ts
import { Metadata } from "next";
import { Location, State, WeatherResponse } from "@/types/locations";

export function generateWeatherMetadata(
  city: Location,
  state: State,
  weatherData: WeatherResponse
): Metadata {
  const title = `Weather Forecast for ${city.name}, ${state.name}`;
  const description = `Current weather conditions and forecast for ${
    city.name
  }, ${state.name}. Temperature: ${Math.round(
    weatherData.current.main.temp
  )}°C, ${
    weatherData.current.weather[0].description
  }. Get hourly and daily weather updates.`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/weather/${state.slug}/${city.slug}`;

  return {
    title,
    description,
    keywords: `weather forecast, ${city.name}, ${state.name}, temperature, humidity, weather conditions, hourly forecast`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "JFeed",
      type: "website",
      images: [
        {
          url: "/logo/jfeed-logo_512x512.png",
          width: 512,
          height: 512,
          alt: "JFeed Logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/logo/jfeed-logo_512x512.png"],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateWeatherStructuredData(
  city: Location,
  state: State,
  weatherData: WeatherResponse
) {
  const pageUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/weather/${state.slug}/${city.slug}`;

  // Current conditions for schema
  const current = weatherData.current;
  const currentTemp = Math.round(current.main.temp);
  const currentCondition = current.weather[0].description;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Weather Forecast for ${city.name}, ${state.name}`,
        description: `Current weather conditions: ${currentTemp}°C, ${currentCondition}`,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/#website`,
          name: "JFeed",
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/`,
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/`,
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/weather`,
              name: "Weather",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/weather/${state.slug}`,
              name: state.name,
            },
          },
          {
            "@type": "ListItem",
            position: 4,
            item: {
              "@id": pageUrl,
              name: city.name,
            },
          },
        ],
      },
    ],
  };
}
