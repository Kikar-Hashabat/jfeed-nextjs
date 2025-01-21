// types/article.ts

export interface ArticleAuthor {
  name: string;
  url: string;
  image?: string;
  twitter?: string;
}

export interface ArticleCategory {
  id: number;
  slug: string;
  parents: ArticleCategory[];
  title: string;
  image: string | null;
  color: string;
  dfpScope: string;
  name: string;
}

export interface ArticleTags {
  id: number;
  slug: string;
  name: string;
}

// Base content types
interface BaseContent {
  v: number;
  type: string;
}

// Text and Link content
export interface TextBlock {
  type: "text";
  text: string;
}

export interface LinkBlock {
  type: "link";
  url: string;
  children: TextBlock[];
}

export interface ParagraphBlock {
  type: "paragraph";
  children: Array<TextBlock | LinkBlock>;
}

// HTML content
export interface ArticleHTMLContent extends BaseContent {
  type: "html";
  content: ParagraphBlock[];
  id: number;
}

// Image content
export interface ArticleImageContent extends BaseContent {
  type: "img";
  src: string;
  credit: string;
  alt: string;
  width: number;
  height: number;
}

// Video content
export interface VideoContent extends BaseContent {
  type: "video";
  urls: Array<{ url: string }>;
  dar: number;
  duration: number;
  uploadDate: number;
  credit: string;
  alt: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
}

// Audio content
export interface AudioContent extends BaseContent {
  type: "audio";
  sources: Array<{ src: string }>;
  credit: string;
  alt: string;
}

// Recipe content
export interface RecipeIngredient {
  name: string;
  count: number;
  countType: string;
}

export interface RecipeInstructionStep {
  name: string;
  text: string;
}

export interface RecipeContent extends BaseContent {
  type: "recipe";
  id: number;
  level: string;
  kosher: string;
  prepTime: number;
  cookTime: number;
  recipeYield: {
    count: number;
    type: string;
  };
  recipeCategory: string;
  ingredientsGroups: Array<{
    title: string;
    ingredients: RecipeIngredient[];
  }>;
  recipeInstructions: RecipeInstructionStep[];
}

export interface RecipeSchema {
  "@context": "https://schema.org";
  "@type": "Recipe";
  name: string;
  image: string[];
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  datePublished: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  keywords: string;
  recipeIngredient: string[];
  recipeYield?: string;
  recipeCategory?: string;
  recipeInstructions?: Array<{
    "@type": "HowToStep";
    url: string;
    text: string;
  }>;
}

// Timeline content
export interface TimelineContent extends BaseContent {
  type: "timeline";
  id: number;
  bg: string;
  desktopBanner: string;
  mobileBanner: string;
  items: Array<{
    title: string;
    content: string;
    time: string;
  }>;
}

// Social media embeds
export interface SocialEmbed extends BaseContent {
  type: "embed-instagram" | "embed-tiktok" | "embed-twitter" | "spotify";
  url: string;
  id: number;
  oEmbedData?: {
    html: string;
    iframe_url?: string;
    width?: number;
    height?: number;
    version?: string;
    provider_name?: string;
    provider_url?: string;
    type?: string;
    title?: string;
    thumbnail_url?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
  };
}

// Article image type
export interface ArticleImage {
  v: number;
  src: string;
  height: number;
  width: number;
  alt: string;
  credit: string;
  URI: string;
}

// Combined content type
export type ArticleContentItem =
  | ArticleHTMLContent
  | ArticleImageContent
  | VideoContent
  | AudioContent
  | RecipeContent
  | TimelineContent
  | SocialEmbed;

// Main article content interface
export interface ArticleContent {
  v: number;
  content: ArticleContentItem[];
}

// Main article data interface
export interface ArticleData {
  id: number;
  author: ArticleAuthor;
  title: string;
  slug: string;
  titleShort: string | null;
  subTitle: string;
  subTitleShort: string | null;
  roofTitle: string;
  subRoofTitle: string;
  categories: ArticleCategory[];
  tags: ArticleTags[];
  redirectUrl: string | null;
  content: ArticleContent;
  a27: boolean;
  image: ArticleImage;
  props: string[];
  time: number;
  lastUpdate: number | null;
  comments: number;
  likes: number;
  dislikes: number;
}

export interface Comment {
  id: number;
  name: string;
  content: string;
  time: number;
  subComments: Comment[];
}

export interface CommentPayload {
  name: string;
  content: string;
  uuid: string;
  parent?: number;
}

export interface ReportPayload {
  reason: "problematic-content" | "dirty-words" | "disrespectful";
}
