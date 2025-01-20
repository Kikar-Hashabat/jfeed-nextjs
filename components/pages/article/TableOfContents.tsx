// components/pages/article/TableOfContents.tsx
import React from "react";
import { List } from "lucide-react";
import { ArticleContentItem } from "@/types/article";

interface TableOfContentsProps {
  content: ArticleContentItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  // Extract text from a paragraph's children (handling both text and link nodes)
  interface ChildNode {
    type?: string;
    text?: string;
    children?: ChildNode[];
  }

  const extractText = (children: ChildNode[]): string => {
    return children
      .map((child) => {
        if ("text" in child) return child.text || "";
        if (child.type === "link" && child.children) {
          return child.children
            .map((linkChild: ChildNode) => {
              if ("text" in linkChild) return linkChild.text || "";
              if (linkChild.type === "link" && linkChild.children) {
                return extractText(linkChild.children);
              }
              return "";
            })
            .join("");
        }
        return "";
      })
      .join("");
  };

  // Find all paragraphs that look like headings (e.g., starting with '#' or having specific classes)
  const extractHeadings = (content: ArticleContentItem[]) => {
    const headings: Array<{ text: string; level: number; id: string }> = [];

    content.forEach((block) => {
      if (block.type === "html") {
        block.content.forEach((paragraph) => {
          // Extract text from the paragraph
          const text = extractText(paragraph.children).trim();

          // Check if this paragraph looks like a heading
          const headingMatch = text.match(/^(#{1,6})\s+(.+)$/);
          if (headingMatch) {
            const level = headingMatch[1].length;
            const headingText = headingMatch[2];
            headings.push({
              text: headingText,
              level,
              id: headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            });
          }
          // You can add more conditions here to identify headings based on your content structure
        });
      }
    });

    return headings;
  };

  const headings = extractHeadings(content);

  if (headings.length < 2) return null; // Don't show ToC if there aren't enough headings

  return (
    <nav className="bg-gray-50 p-4 rounded-lg mb-8">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5" />
        <h2 className="font-medium">Table of Contents</h2>
      </div>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li
            key={index}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-gray-600 hover:text-primary hover:underline text-sm block"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
