"use client";

import React from "react";
import Image from "next/image";

interface ShareButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
  ariaLabel: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  icon,
  alt,
  onClick,
  ariaLabel,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
    aria-label={ariaLabel}
  >
    <Image
      src={icon}
      alt={alt}
      width={38}
      height={38}
      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[38px]"
    />
  </button>
);

interface ShareButtonsProps {
  title: string;
  commentsCount: number | string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  commentsCount,
}) => {
  const handleShare = (platform: "facebook" | "twitter" | "generic") => {
    const url = window.location.href;
    const text = title;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "generic":
        if (navigator.share) {
          navigator
            .share({
              title: text,
              url: url,
            })
            .catch(console.error);
        }
        break;
    }
  };

  return (
    <div className="flex gap-3.5 items-center self-stretch my-auto min-w-[240px]">
      <ShareButton
        icon="/icons/facebook-rounded.svg"
        alt="Facebook"
        onClick={() => handleShare("facebook")}
        ariaLabel="Share on Facebook"
      />

      <ShareButton
        icon="/icons/x-rounded.svg"
        alt="Twitter"
        onClick={() => handleShare("twitter")}
        ariaLabel="Share on Twitter"
      />

      <ShareButton
        icon="/icons/share-rounded.svg"
        alt="Share"
        onClick={() => handleShare("generic")}
        ariaLabel="Share article"
      />

      <button className="overflow-hidden self-stretch p-2.5 my-auto bg-neutral-200 min-h-[38px] rounded-[30px] text-sm font-bold leading-none text-center text-black hover:bg-neutral-300 transition-colors">
        view {commentsCount} comments
      </button>
    </div>
  );
};

export default ShareButtons;
