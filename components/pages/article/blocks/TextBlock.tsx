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
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  const renderChild = (child: TextContent | LinkContent): React.ReactNode => {
    if ("text" in child) return child.text;

    if (child.type === "link") {
      const text = child.children
        .filter((c): c is TextContent => "text" in c)
        .map((c) => c.text)
        .join("");

      const finalUrl = child.url.replace(
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

    return null;
  };

  return (
    <>
      {content.map((paragraph, index) => (
        <React.Fragment key={index}>
          <p className="mb-4 leading-relaxed">
            {paragraph.children.map((child, childIndex) => (
              <React.Fragment key={childIndex}>
                {renderChild(child)}
              </React.Fragment>
            ))}
          </p>
          {index === 0 && <OutbrainWidget dataWidgetId="GS_1" />}
        </React.Fragment>
      ))}
    </>
  );
};

export default TextBlock;
