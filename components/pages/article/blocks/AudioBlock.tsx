import React from "react";
import { AudioContent } from "@/types/article";

const AudioBlock: React.FC<AudioContent> = ({ sources, credit }) => {
  return (
    <figure className="mb-8">
      <audio controls className="w-full">
        {sources.map((source, index) => (
          <source key={index} src={source.src} />
        ))}
      </audio>
      {credit && (
        <figcaption className="text-sm text-gray-500 mt-2 italic">
          {credit}
        </figcaption>
      )}
    </figure>
  );
};

export default AudioBlock;
