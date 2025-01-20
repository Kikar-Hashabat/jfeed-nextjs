"use client";

import { useEffect } from "react";

export default function TwitterEmbed({ url }: { url: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.charset = "utf-8";
    document.head.appendChild(script);
  }, []);

  // Extract tweet ID from URL
  const tweetId = url.split("/").pop()?.split("?")[0];

  return (
    <div className="flex justify-center w-full">
      <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
        <a href={`https://twitter.com/x/status/${tweetId}`}></a>
      </blockquote>
    </div>
  );
}
