import React from "react";
import { VideoContent } from "@/types/article";

const VideoBlock: React.FC<VideoContent> = ({ urls, poster, alt, credit }) => {
  return (
    <figure className="mb-8">
      <div className="relative aspect-video">
        <video
          controls
          poster={poster}
          className="w-full h-full"
          preload="metadata"
        >
          {urls.map((url, index) => (
            <source key={index} src={url.url} />
          ))}
          {alt && <track kind="captions" label={alt} />}
        </video>
      </div>
      {credit && (
        <figcaption className="text-sm text-gray-500 mt-2 italic">
          {credit}
        </figcaption>
      )}
    </figure>
  );
};

export default VideoBlock;
