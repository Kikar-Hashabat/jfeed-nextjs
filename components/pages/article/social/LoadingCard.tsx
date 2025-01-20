import React from "react";
import { Loader2 } from "lucide-react";
import { Twitter, Music, Instagram } from "lucide-react";
import type { EmbedType } from "@/types/social-media";

interface LoadingCardProps {
  type: EmbedType;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ type }) => {
  const getLoadingConfig = () => {
    const config = {
      "embed-twitter": {
        text: "Loading Tweet",
        icon: <Twitter className="w-8 h-8 text-blue-400" />,
        gradient: "from-blue-50 to-blue-100",
      },
      "embed-instagram": {
        text: "Loading Instagram Post",
        icon: <Instagram className="w-8 h-8 text-pink-500" />,
        gradient: "from-pink-50 to-purple-100",
      },
      "embed-tiktok": {
        text: "Loading TikTok",
        icon: (
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.166v13.672c0 2.088-1.356 3.317-3.01 3.317-1.654 0-2.852-1.23-2.852-3.317 0-2.088 1.198-3.686 2.852-3.686.5 0 .957.115 1.366.332V8.557a6.897 6.897 0 0 0-1.366-.140C6.251 8.417 3 11.818 3 15.672 3 19.526 6.251 23 9.643 23c3.392 0 6.643-3.474 6.643-7.328V10.5c1.297.92 2.887 1.469 4.303 1.469V8.686c-.116.016-.232.025-.35.025a4.793 4.793 0 0 1-3.77-4.245V2h-3.166"
              fill="currentColor"
            />
          </svg>
        ),
        gradient: "from-gray-50 to-gray-100",
      },
      spotify: {
        text: "Loading Spotify",
        icon: <Music className="w-8 h-8 text-green-500" />,
        gradient: "from-green-50 to-green-100",
      },
    };

    return config[type];
  };

  const config = getLoadingConfig();

  return (
    <div
      role="status"
      aria-label={config.text}
      className="w-full max-w-lg mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      <div
        className={`bg-gradient-to-br ${config.gradient} h-64 flex items-center justify-center p-6`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm">
            {config.icon}
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {config.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
