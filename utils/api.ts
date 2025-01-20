import { locations } from "@/data/locations";
import {
  GetArticlesV2Params,
  Article,
  HomeMainContent,
  NavItem,
  Tag,
  Author,
  Category,
} from "@/types";
import {
  ArticleData,
  Comment,
  CommentPayload,
  ReportPayload,
} from "@/types/article";
import {
  HalachicTimesResponse,
  ShabbatTimesResponse,
  WeatherCurrentResponse,
  WeatherForecastResponse,
  WeatherResponse,
} from "@/types/locations";
import { XMLParser } from "fast-xml-parser";

async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
}

export async function getNavigation(): Promise<NavItem[]> {
  return fetchData<NavItem[]>("https://a.jfeed.com/v1/lists/nav");
}

export async function getHomeFrontal(): Promise<Article[]> {
  return fetchData<Article[]>(
    "https://a.jfeed.com/v1/articles-list/home-frontal"
  );
}

export async function getHomeMainContent(): Promise<HomeMainContent[]> {
  return fetchData<HomeMainContent[]>(
    "https://a.jfeed.com/v1/lists/home-main-content"
  );
}

export async function getArticlesV2(
  params: GetArticlesV2Params
): Promise<Article[]> {
  const queryParams = new URLSearchParams(params as Record<string, string>);
  return fetchData<Article[]>(
    `https://a.jfeed.com/V2/articles?${queryParams.toString()}`
  );
}

export async function getArticle(slug: string): Promise<ArticleData> {
  return fetchData<ArticleData>(`https://a.jfeed.com/v2/articles/${slug}`);
}

export async function getArticleComments(articleId: string): Promise<Comment> {
  return fetchData<Comment>(
    `https://a.jfeed.com/v2/articles/${articleId}/comments`
  );
}

export async function getTag(slug: string): Promise<Tag> {
  return fetchData<Tag>(`https://a.jfeed.com/v1/tags/${slug}`);
}

export async function getPopularTags(): Promise<Tag[]> {
  return fetchData<Tag[]>(`https://a.jfeed.com/v1/tags/popular`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return fetchData<Category>(`https://a.jfeed.com/v2/categories/${slug}`);
}

export async function getAuthor(slug: string): Promise<Author> {
  return fetchData<Author>(`https://a.jfeed.com/v1/authors/${slug}`);
}

export async function getCategories() {
  const res = await fetch("https://a.jfeed.com/v1/sitemap/categories", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const text = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsedXml = parser.parse(text);
  const urls = parsedXml.urlset.url;

  return urls.map((url: { loc: string; lastmod: string }) => ({
    href: url.loc.replace("https://www.jfeed.com/", ""),
    lastmod: url.lastmod,
  }));
}

export async function submitComment(
  articleId: string,
  payload: CommentPayload
): Promise<void> {
  console.log("Submitting comment:", payload);

  try {
    const res = await fetch(
      `https://a.jfeed.com/v2/articles/${articleId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // Log the response status and status text
    console.log("Response status:", res.status, res.statusText);

    if (!res.ok) {
      // Try to get error details from response
      const errorText = await res.text();
      console.error("Error response:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || "Failed to submit comment");
      } catch (parseError) {
        throw new Error(errorText || "Failed to submit comment");
      }
    }
  } catch (error) {
    console.error("Submit comment error:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        "An unexpected error occurred while submitting the comment"
      );
    }
  }
}

export async function reportComment(
  articleId: string,
  commentId: number,
  payload: ReportPayload
): Promise<void> {
  const res = await fetch(
    `https://a.jfeed.com/v2/articles/${articleId}/comments/${commentId}/report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to report comment");
  }
}

export async function getWeatherData(
  state: string,
  city: string
): Promise<WeatherResponse> {
  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    throw new Error("City not found");
  }

  const [currentWeather, forecast] = await Promise.all([
    fetchData<WeatherCurrentResponse>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.coordinates.lat}&lon=${cityData.coordinates.lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    ),
    fetchData<WeatherForecastResponse>(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${cityData.coordinates.lat}&lon=${cityData.coordinates.lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    ),
  ]);

  return {
    current: currentWeather,
    forecast: forecast,
  };
}

export async function getShabbatTimes(
  state: string,
  city: string,
  date: string
): Promise<ShabbatTimesResponse> {
  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    throw new Error("City not found");
  }

  const [year, month, day] = date.split("-").map(Number);
  return fetchData<ShabbatTimesResponse>(
    `https://www.hebcal.com/shabbat?cfg=json&geonameid=${cityData.geonameid}&gy=${year}&gm=${month}&gd=${day}`
  );
}

export async function getHalachicTimes(
  state: string,
  city: string,
  date: string
): Promise<HalachicTimesResponse> {
  const cityData = locations.cities.find(
    (c) => c.state.slug === state && c.slug === city
  );

  if (!cityData) {
    throw new Error("City not found");
  }

  return fetchData<HalachicTimesResponse>(
    `https://www.hebcal.com/zmanim?cfg=json&geonameid=${cityData.geonameid}&date=${date}`
  );
}
