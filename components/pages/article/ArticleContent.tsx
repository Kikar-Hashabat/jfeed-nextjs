import React from "react";
import { ArticleContentItem } from "@/types/article";
import ImageBlock from "./blocks/ImageBlock";
import VideoBlock from "./blocks/VideoBlock";
import AudioBlock from "./blocks/AudioBlock";
import RecipeBlock from "./blocks/RecipeBlock";
import TimelineBlock from "./blocks/TimelineBlock";
import SocialEmbed from "./social/SocialEmbed";
import TextBlock from "./blocks/TextBlock";

interface ArticleContentProps {
  content: ArticleContentItem[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  const renderBlock = (block: ArticleContentItem, index: number) => {
    switch (block.type) {
      case "img":
        return <ImageBlock key={`img-${index}`} {...block} />;
      case "html":
        return <TextBlock key={`html-${index}`} content={block.content} />;
      case "video":
        return <VideoBlock key={`video-${index}`} {...block} />;
      case "audio":
        return <AudioBlock key={`audio-${index}`} {...block} />;
      case "recipe":
        return <RecipeBlock key={`recipe-${index}`} {...block} />;
      case "timeline":
        return <TimelineBlock key={`timeline-${index}`} {...block} />;
      case "embed-instagram":
      case "embed-tiktok":
      case "embed-twitter":
      case "spotify":
        return <SocialEmbed key={`social-${index}`} {...block} />;
      default:
        return null;
    }
  };

  return (
    <div className="prose max-w-none" aria-label="Article content">
      {content.map((block, index) => (
        <section key={index} aria-label={`Content section ${index + 1}`}>
          {renderBlock(block, index)}
        </section>
      ))}
    </div>
  );
};

export default ArticleContent;
