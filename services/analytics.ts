import ReactGA from "react-ga4";

type PageType =
  | "homepage"
  | "article"
  | "category"
  | "archive"
  | "author"
  | "search"
  | "tag"
  | "weather"
  | "shabbat-times"
  | "halachic-times";

class NewsAnalytics {
  private initialized = false;
  private measurementId: string;

  constructor(measurementId: string) {
    this.measurementId = measurementId;
  }

  init = () => {
    if (!this.initialized && typeof window !== "undefined") {
      ReactGA.initialize(this.measurementId, {
        gtagOptions: {
          send_page_view: false,
        },
      });
      this.initialized = true;
    }
  };

  // Core Analytics Methods
  pageView = (
    path: string,
    context: {
      pageType: PageType;
      section?: string;
      location?: {
        state?: string;
        city?: string;
      };
    }
  ) => {
    if (!this.initialized) return;

    ReactGA.send({
      hitType: "pageview",
      page: path,
      ...context,
    });
  };

  // Article Related
  trackArticleView = ({
    articleId,
    title,
    category,
    author,
    tags,
    publishDate,
  }: {
    articleId: string;
    title: string;
    category: string;
    author?: string;
    tags?: string[];
    publishDate?: string;
  }) => {
    if (!this.initialized) return;

    ReactGA.event("article_view", {
      article_id: articleId,
      title,
      category,
      author,
      tags: tags?.join(","),
      publish_date: publishDate,
    });
  };

  // Weather Related
  trackWeatherView = ({
    state,
    city,
    type,
  }: {
    state: string;
    city: string;
    type: "current" | "forecast";
  }) => {
    if (!this.initialized) return;

    ReactGA.event("weather_view", {
      state,
      city,
      view_type: type,
    });
  };

  // Times Related
  trackTimesView = ({
    type,
    state,
    city,
    date,
  }: {
    type: "shabbat" | "halachic";
    state: string;
    city: string;
    date: string;
  }) => {
    if (!this.initialized) return;

    ReactGA.event("times_view", {
      times_type: type,
      state,
      city,
      date,
    });
  };

  // Search Related
  trackSearch = ({
    query,
    resultsCount,
    filters,
  }: {
    query: string;
    resultsCount: number;
    filters?: Record<string, string>;
  }) => {
    if (!this.initialized) return;

    ReactGA.event("site_search", {
      search_term: query,
      results_count: resultsCount,
      ...filters,
    });
  };

  // Archive Related
  trackArchiveView = ({
    year,
    month,
    day,
    resultsCount,
  }: {
    year: string;
    month?: string;
    day?: string;
    resultsCount: number;
  }) => {
    if (!this.initialized) return;

    ReactGA.event("archive_view", {
      year,
      month,
      day,
      results_count: resultsCount,
    });
  };

  // User Interactions
  trackInteraction = (
    action: "share" | "comment" | "like" | "bookmark",
    details: Record<string, any>
  ) => {
    if (!this.initialized) return;

    ReactGA.event("user_interaction", {
      interaction_type: action,
      ...details,
    });
  };

  // Error Tracking
  trackError = (error: {
    type: string;
    message: string;
    path: string;
    context?: Record<string, any>;
  }) => {
    if (!this.initialized) return;

    ReactGA.event("error_occurred", {
      error_type: error.type,
      error_message: error.message,
      path: error.path,
      ...error.context,
    });
  };
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const newsAnalytics = new NewsAnalytics(GA_MEASUREMENT_ID);

export const useNewsAnalytics = () => {
  return newsAnalytics;
};
