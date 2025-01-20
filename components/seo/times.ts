// components/seo/times.ts
import { Metadata } from "next";
import {
  Location,
  HalachicTimesResponse,
  ShabbatTimesResponse,
} from "@/types/locations";

export function generateHalachicTimesMetadata(
  city: Location,
  date: string,
  data: HalachicTimesResponse
): Metadata {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extract key times for the description
  const keyTimes = {
    sunrise: data.times.sunrise,
    sunset: data.times.sunset,
    shema: data.times["sof-zman-shema"],
    tfilla: data.times["sof-zman-tfilla"],
  };

  const title = `Halachic Times for ${city.name}, ${city.state.name} - ${formattedDate}`;
  const description = `Today's Halachic times for ${city.name}, ${city.state.name}: Sunrise: ${keyTimes.sunrise}, Sunset: ${keyTimes.sunset}, Latest Shema: ${keyTimes.shema}, Latest Shacharit: ${keyTimes.tfilla}. Timezone: ${data.location.tzid}.`;
  const canonicalUrl = `https://www.jfeed.com/halacha/${city.state.slug}/${city.slug}/${date}`;

  return {
    title,
    description,
    keywords: `Halachic times, Zmanim, ${city.name}, ${city.state.name}, Jewish prayer times, Alot Hashachar, Misheyakir, Sunrise ${keyTimes.sunrise}, Sunset ${keyTimes.sunset}, Mincha, Maariv`,
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

export function generateShabbatTimesMetadata(
  city: Location,
  date: string,
  data: ShabbatTimesResponse
): Metadata {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Find candle lighting and parsha information
  const candleLighting = data.items.find((item) => item.category === "candles");
  const parsha = data.items.find((item) => item.category === "parashat");
  const havdalah = data.items.find((item) => item.category === "havdalah");

  const title = `Shabbat Times for ${city.name}, ${city.state.name} - ${formattedDate}`;
  const description = `Shabbat schedule for ${city.name}, ${city.state.name}. ${
    parsha ? `Parashat ${parsha.title}, ` : ""
  }${candleLighting ? `Candle lighting: ${candleLighting.date}, ` : ""}${
    havdalah ? `Havdalah: ${havdalah.date}` : ""
  }. Timezone: ${data.location.tzid}.`;

  const canonicalUrl = `https://www.jfeed.com/shabbat/${city.state.slug}/${city.slug}/${date}`;

  return {
    title,
    description,
    keywords: `Shabbat times, ${city.name}, ${
      city.state.name
    }, Candle lighting, Havdalah, ${
      parsha ? parsha.title : "Torah reading"
    }, Parsha, Jewish calendar`,
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

export function generateHalachicTimesStructuredData(
  city: Location,
  date: string,
  data: HalachicTimesResponse
) {
  const pageUrl = `https://www.jfeed.com/halacha/${city.state.slug}/${city.slug}/${date}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Halachic Times for ${city.name}, ${city.state.name}`,
        description: `Halachic times including Sunrise: ${data.times.sunrise}, Sunset: ${data.times.sunset}`,
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://www.jfeed.com/#website",
          name: "JFeed",
          url: "https://www.jfeed.com",
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        timeZone: data.location.tzid,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": "https://www.jfeed.com/",
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": "https://www.jfeed.com/halacha",
              name: "Halachic Times",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `https://www.jfeed.com/halacha/${city.state.slug}`,
              name: city.state.name,
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

export function generateShabbatTimesStructuredData(
  city: Location,
  date: string,
  data: ShabbatTimesResponse
) {
  const pageUrl = `https://www.jfeed.com/shabbat/${city.state.slug}/${city.slug}/${date}`;

  // Find relevant Shabbat information
  const candleLighting = data.items.find((item) => item.category === "candles");
  const parsha = data.items.find((item) => item.category === "parashat");
  const havdalah = data.items.find((item) => item.category === "havdalah");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Shabbat Times for ${city.name}, ${city.state.name}`,
        description: `${parsha ? `Parashat ${parsha.title}, ` : ""}${
          candleLighting ? `Candle lighting: ${candleLighting.date}, ` : ""
        }${havdalah ? `Havdalah: ${havdalah.date}` : ""}`,
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://www.jfeed.com/#website",
          name: "JFeed",
          url: "https://www.jfeed.com",
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        timeZone: data.location.tzid,
      },
      {
        "@type": "Event",
        "@id": `${pageUrl}#event`,
        name: parsha ? `Shabbat - ${parsha.title}` : "Shabbat",
        startDate: candleLighting?.date,
        endDate: havdalah?.date,
        location: {
          "@type": "Place",
          name: `${city.name}, ${city.state.name}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: city.name,
            addressRegion: city.state.name,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": "https://www.jfeed.com/",
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": "https://www.jfeed.com/shabbat",
              name: "Shabbat Times",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": `https://www.jfeed.com/shabbat/${city.state.slug}`,
              name: city.state.name,
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
