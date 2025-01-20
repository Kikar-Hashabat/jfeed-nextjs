export type EmbedType =
  | "embed-instagram"
  | "embed-tiktok"
  | "embed-twitter"
  | "spotify";

export interface OEmbedData {
  html: string;
  width?: number;
  height?: number;
}

export interface SocialEmbedProps {
  type: EmbedType;
  url: string;
  id: number;
  oEmbedData?: OEmbedData;
}

export interface TwitterWidgets {
  load: (element?: HTMLElement) => void;
  createTweet: (
    tweetId: string,
    element: HTMLElement,
    options?: Record<string, any>
  ) => Promise<void>;
}

export interface InstagramEmbed {
  process: () => void;
}

interface EmbedPatterns {
  [key: string]: RegExp;
}
