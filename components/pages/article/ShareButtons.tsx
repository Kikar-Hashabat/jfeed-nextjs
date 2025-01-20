"use client";

// components/pages/article/ShareButtons.tsx
import React from "react";
import { Facebook, Twitter, Link as LinkIcon } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600">Share:</span>

      <div className="flex gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook size={20} />
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter size={20} />
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Share on LinkedIn"
        >
          <LinkIcon size={20} />
        </a>

        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon size={20} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
