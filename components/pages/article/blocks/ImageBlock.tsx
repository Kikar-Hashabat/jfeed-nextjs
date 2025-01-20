import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ArticleImageContent } from "@/types/article";

const ImageBlock: React.FC<ArticleImageContent> = ({ src, alt, credit }) => {
  return (
    <figure className="relative mb-8">
      <div className="relative aspect-[16/9]">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
        />
      </div>
      {credit && (
        <figcaption className="text-sm text-gray-500 mt-2 italic">
          {credit}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
