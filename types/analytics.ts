export type PageData = {
  type:
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
  section: string;
  additionalData?: Record<string, any>;
};
