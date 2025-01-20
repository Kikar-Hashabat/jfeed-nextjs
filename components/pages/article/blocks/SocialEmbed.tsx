"use client";

import React, { useEffect } from "react";
import Script from "next/script";

interface SocialEmbedProps {
  type: "embed-instagram" | "embed-tiktok" | "embed-twitter" | "spotify";
  url: string;
  id: number;
  oEmbedData?: {
    html: string;
  };
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const SocialEmbed: React.FC<SocialEmbedProps> = ({ type, url, oEmbedData }) => {
  // Extract the correct IDs from URLs
  const getTwitterId = (url: string) => {
    return url.split("/").pop() || "";
  };

  const getTikTokId = (url: string) => {
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : "";
  };

  const getInstagramId = (url: string) => {
    const match = url.match(/\/p\/([^/]+)/);
    return match ? match[1] : "";
  };

  useEffect(() => {
    // Process embeds when they're ready
    if (type === "embed-instagram" && window.instgrm) {
      window.instgrm.Embeds.process();
    }
    if (type === "embed-twitter" && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [type]);

  const renderEmbed = () => {
    switch (type) {
      case "embed-twitter":
        const tweetId = getTwitterId(url);
        return (
          <>
            <Script
              src="https://platform.twitter.com/widgets.js"
              strategy="lazyOnload"
            />
            <div className="twitter-embed mb-8">
              <blockquote className="twitter-tweet">
                <a href={`https://twitter.com/x/status/${tweetId}`}>
                  Loading Tweet...
                </a>
              </blockquote>
            </div>
          </>
        );

      case "embed-instagram":
        const instaId = getInstagramId(url);
        return (
          <>
            <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
            <div className="instagram-embed mb-8">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`https://www.instagram.com/p/${instaId}/`}
                data-instgrm-version="14"
              >
                <a href={`https://www.instagram.com/p/${instaId}/`}>
                  Loading Instagram Post...
                </a>
              </blockquote>
            </div>
          </>
        );

      case "embed-tiktok":
        const tiktokId = getTikTokId(url);
        return (
          <>
            <Script
              src="https://www.tiktok.com/embed.js"
              strategy="lazyOnload"
            />
            <div className="tiktok-embed mb-8">
              <blockquote
                className="tiktok-embed"
                cite={url}
                data-video-id={tiktokId}
              >
                <section>
                  <a href={`https://www.tiktok.com/video/${tiktokId}`}>
                    Loading TikTok...
                  </a>
                </section>
              </blockquote>
            </div>
          </>
        );

      case "spotify":
        if (oEmbedData?.html) {
          return (
            <div
              className="spotify-embed mb-8"
              dangerouslySetInnerHTML={{ __html: oEmbedData.html }}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  return <div className="social-embed my-8">{renderEmbed()}</div>;
};

export default SocialEmbed;
