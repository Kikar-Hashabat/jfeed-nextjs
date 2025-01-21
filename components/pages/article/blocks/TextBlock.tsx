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
  ): { url: string; text: string } => {
    // If there are nested links, recursively get the innermost one
    if ("type" in child.children[0] && child.children[0].type === "link") {
      return getInnerMostLink(child.children[0] as LinkContent);
    }

    // Get the text from the link's children
    const text = child.children
      .map((c) => ("text" in c ? c.text : ""))
      .filter(Boolean)
      .join("");

    return { url: child.url, text };
  };

  const renderChild = (child: ContentNode): React.ReactNode => {
    if ("text" in child) {
      return child.text;
    }

    if (child.type === "link") {
      const { url, text } = getInnerMostLink(child);
      if (url && text) {
        const finalUrl = url.replace(
          process.env.NEXT_PUBLIC_WEBSITE_URL || "",
          ""
        );
        return (
          <Link
            href={finalUrl}
            className="text-primary hover:underline font-medium underline"
          >
            {text}
          </Link>
        );
      }
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
