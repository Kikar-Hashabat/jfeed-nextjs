interface EmbedPatterns {
  [key: string]: RegExp;
}

export const EMBED_PATTERNS: EmbedPatterns = {
  "embed-twitter": /\/status\/(\d+)/,
  "embed-instagram": /\/p\/([^/]+)/,
  "embed-tiktok": /video\/(\d+)/,
  spotify: /track\/([a-zA-Z0-9]+)/,
};

export const SCRIPT_URLS = {
  "embed-twitter": "https://platform.twitter.com/widgets.js",
  "embed-instagram": "//www.instagram.com/embed.js",
  "embed-tiktok": "https://www.tiktok.com/embed.js",
} as const;

export const extractEmbedId = (url: string, type: string): string => {
  const pattern = EMBED_PATTERNS[type];
  if (!pattern) return "";

  const match = url.match(pattern);
  return match ? match[1] : "";
};
