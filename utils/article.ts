import { ArticleContentItem, TextBlock, LinkBlock } from "@/types/article";

export function isTextBlock(block: any): block is TextBlock {
  return block?.type === "text" && typeof block?.text === "string";
}

export function isLinkBlock(block: any): block is LinkBlock {
  return block?.type === "link" && Array.isArray(block?.children);
}

function countWordsInText(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function getWordCount(content: ArticleContentItem[]): number {
  if (!Array.isArray(content)) {
    return 0;
  }

  return content
    .filter((block) => block.type === "html")
    .reduce((totalCount, block) => {
      if (!Array.isArray(block.content)) {
        return totalCount;
      }

      const blockWordCount = block.content.reduce(
        (paragraphCount, paragraph) => {
          if (!Array.isArray(paragraph.children)) {
            return paragraphCount;
          }

          const paragraphWords = paragraph.children.reduce(
            (childCount, child) => {
              if ("text" in child) {
                return childCount + countWordsInText(child.text);
              }

              if ("children" in child && Array.isArray(child.children)) {
                return (
                  childCount +
                  child.children.reduce((linkCount, linkChild) => {
                    if ("text" in linkChild) {
                      return linkCount + countWordsInText(linkChild.text);
                    }
                    return linkCount;
                  }, 0)
                );
              }

              return childCount;
            },
            0
          );

          return paragraphCount + paragraphWords;
        },
        0
      );

      return totalCount + blockWordCount;
    }, 0);
}

// More robust text extraction
export function extractText(content: ArticleContentItem[]): string {
  try {
    return content
      .filter((block) => block.type === "html")
      .flatMap((block) => block.content)
      .map((paragraph) => {
        if (!Array.isArray(paragraph?.children)) return "";

        return paragraph.children
          .map((child) => {
            if (isTextBlock(child)) return child.text;
            if (isLinkBlock(child)) {
              return child.children
                .map((textBlock) => textBlock?.text || "")
                .join(" ");
            }
            return "";
          })
          .join(" ");
      })
      .join(" ")
      .trim();
  } catch (error) {
    console.error("Error extracting text:", error);
    return "";
  }
}
