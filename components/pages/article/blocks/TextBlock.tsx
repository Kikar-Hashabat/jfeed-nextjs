// components/pages/article/blocks/TextBlock.tsx
import React from "react";
import Link from "next/link";

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

type ContentNode = TextContent | LinkContent;

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
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
    <>
      {content.map((paragraph, index) => {
        if (paragraph.type !== "paragraph") return null;

        return (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph.children.map((child, childIndex) => (
              <React.Fragment key={childIndex}>
                {renderChild(child)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

export default TextBlock;
