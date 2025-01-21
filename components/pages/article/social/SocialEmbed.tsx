"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import type { SocialEmbedProps } from "@/types/social-media";
import { extractEmbedId, SCRIPT_URLS } from "@/utils/social-embed";

const LoadingCard = dynamic(() => import("./LoadingCard"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />,
});

// Script loading cache
const loadedScripts = new Set<string>();

const SocialEmbed: React.FC<SocialEmbedProps> = ({ type, url, oEmbedData }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const loadScript = useCallback(async (src: string): Promise<void> => {
    if (loadedScripts.has(src)) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = () => {
        loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }, []);

  const initializeEmbed = useCallback(async () => {
    if (!inView || isLoaded) return;

    const scriptUrl = SCRIPT_URLS[type as keyof typeof SCRIPT_URLS];
    if (!scriptUrl) return;

    try {
      await loadScript(scriptUrl);

      switch (type) {
        case "embed-twitter":
          if (window.twttr?.widgets) {
            await window.twttr.widgets.load(embedRef.current || undefined);
          }
          break;
        case "embed-instagram":
          if (window.instgrm?.Embeds) {
            window.instgrm.Embeds.process();
          }
          break;
      }

      setIsLoaded(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load embed");
      console.error(`Error loading ${type} embed:`, error);
    }
  }, [inView, isLoaded, type, loadScript, embedRef]);

  useEffect(() => {
    if (inView && !showEmbed) {
      setShowEmbed(true);
    }
  }, [inView, showEmbed]);

  useEffect(() => {
    if (showEmbed) {
      initializeEmbed();
    }
  }, [showEmbed, initializeEmbed]);

  const renderEmbed = () => {
    if (error) {
      return (
        <div className="text-center p-4 text-red-600">
          Failed to load content. Please try again later.
        </div>
      );
    }

    if (!showEmbed) {
      return <LoadingCard type={type} />;
    }

    const embedId = extractEmbedId(url, type);

    switch (type) {
      case "embed-twitter":
        return (
          <div
            ref={embedRef}
            className="twitter-embed w-[90%]"
            aria-label="Twitter Post"
          >
            <blockquote
              className="twitter-tweet"
              data-conversation="none"
              data-theme="light"
            >
              <a href={`https://twitter.com/x/status/${embedId}`}>
                Loading Tweet...
              </a>
            </blockquote>
          </div>
        );

      case "embed-instagram":
        return (
          <div
            ref={embedRef}
            className="instagram-embed"
            aria-label="Instagram Post"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink={`https://www.instagram.com/p/${embedId}/`}
              data-instgrm-version="14"
            >
              <a href={`https://www.instagram.com/p/${embedId}/`}>
                Loading Instagram Post...
              </a>
            </blockquote>
          </div>
        );

      case "embed-tiktok":
        return (
          <div
            ref={embedRef}
            className="tiktok-embed"
            aria-label="TikTok Video"
          >
            <blockquote
              className="tiktok-embed"
              cite={url}
              data-video-id={embedId}
              style={{ maxWidth: "605px", minWidth: "325px" }}
            >
              <section>
                <a
                  target="_blank"
                  href={`https://www.tiktok.com/video/${embedId}`}
                >
                  Loading TikTok...
                </a>
              </section>
            </blockquote>
          </div>
        );

      case "spotify":
        if (oEmbedData?.html) {
          return (
            <div
              className="spotify-embed"
              aria-label="Spotify Player"
              dangerouslySetInnerHTML={{ __html: oEmbedData.html }}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className="social-embed flex justify-center my-4"
      data-type={type}
    >
      {renderEmbed()}
    </div>
  );
};

export default SocialEmbed;
