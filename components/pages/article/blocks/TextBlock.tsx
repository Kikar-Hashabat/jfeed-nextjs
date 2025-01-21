import React from "react";
import Link from "next/link";
import { OutbrainWidget } from "@/components/ads/Outbrain";

interface TextContent {
  text: string;
}

interface LinkContent {
  type: "link";
  url: string;
  children: Array<TextContent | LinkContent>;
  popover?: string;
}

interface ParagraphContent {
  type: "paragraph";
  children: Array<TextContent | LinkContent>;
}

interface TextBlockProps {
  content: ParagraphContent[];
  showOutbrain: boolean;
}

type ContentNode = TextContent | LinkContent;

const TextBlock: React.FC<TextBlockProps> = ({ content, showOutbrain }) => {
  const getInnerMostLink = (
    child: LinkContent
  ): { url: string; text: string; popover?: string } => {
    // Handle nested link structure
    const childrenTexts: string[] = [];

    for (const c of child.children) {
      if ("text" in c) {
        childrenTexts.push(c.text);
      } else if (c.type === "link") {
        const innerLink = getInnerMostLink(c);
        childrenTexts.push(innerLink.text);
      }
    }

    return {
      url: child.url,
      text: childrenTexts.join(""),
      popover: child.popover,
    };
  };

  const renderChild = (child: ContentNode): React.ReactNode => {
    if ("text" in child) {
      return child.text;
    }

    if (child.type === "link") {
      const { url, text, popover } = getInnerMostLink(child);

      return (
        <Link
          href={url}
          className="text-primary hover:underline font-medium underline"
          {...(popover ? { "data-popover": popover } : {})}
        >
          {text}
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {content.map((paragraph, index) => (
        <React.Fragment key={index}>
          <p className="leading-relaxed">
            {paragraph.children.map((child, childIndex) => (
              <React.Fragment key={childIndex}>
                {renderChild(child)}
              </React.Fragment>
            ))}
          </p>
          {showOutbrain && index === 0 && (
            <div className="my-4">
              <OutbrainWidget dataWidgetId="GS_1" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TextBlock;
