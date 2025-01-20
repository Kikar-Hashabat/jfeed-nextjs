import { TwitterWidgets } from "./social-media";

declare global {
  interface Window {
    twttr?: {
      widgets: TwitterWidgets;
      _e?: Array<() => void>;
    };
    instgrm?: {
      Embeds: InstagramEmbed;
    };
  }
}
