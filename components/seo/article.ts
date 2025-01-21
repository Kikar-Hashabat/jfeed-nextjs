import {
  ArticleData,
  RecipeContent,
  RecipeInstructionStep,
  RecipeSchema,
} from "@/types/article";
import { Metadata } from "next";

interface VideoObject {
  "@context": "https://schema.org";
  "@type": "VideoObject";
  name: string;
  description: string;
  thumbnailUrl: string[];
  uploadDate: string;
  contentUrl: string;
}

export function generateArticleMetadata(
  article: ArticleData,
  isRedirectPage: boolean = false
): Metadata {
  const canonicalUrl = `https://www.jfeed.com/${article.categories[0]?.slug}/${article.slug}`;
  const ogImageUrl = `https://a.jfeed.com/v2/articles/${article.id}/og-image.jpeg`;

  return {
    title: {
      absolute: `${article.titleShort || article.title} - JFeed`,
    },
    description: `${article.subTitle} - JFeed Israel News`,
    applicationName: "JFeed",
    authors: [{ name: article.author.name, url: article.author.url }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.subTitle,
      url: canonicalUrl,
      siteName: "JFeed",
      images: [
        {
          url: ogImageUrl,
          width: 512,
          height: 512,
          alt: article.title,
        },
      ],
      locale: "he-IL",
      publishedTime: new Date(article.time).toISOString(),
      modifiedTime: article.lastUpdate
        ? new Date(article.lastUpdate).toISOString()
        : undefined,
      authors: [article.author.name],
      section: article.categories[0]?.name,
      tags: article.tags?.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      site: "@JFeedEnglish",
      creator: article.author?.twitter
        ? `@${article.author.twitter.replace("https://x.com/", "")}`
        : undefined,
      title: article.title,
      description: article.subTitle,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      types: {
        "application/rss+xml": article.categories?.[0]
          ? `https://a.jfeed.com/v1/rss/articles/${article.categories[0].id}/rss2`
          : null,
      },
    },
    robots: {
      index: !isRedirectPage,
      follow: true,
      googleBot: {
        index: !isRedirectPage,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function generateArticleStructuredData(article: ArticleData) {
  const canonicalUrl = `https://www.jfeed.com/${article.categories[0]?.slug}/${article.slug}`;

  // Get article body text
  const articleBody = article.content.content
    .filter((block) => block.type === "html")
    .map((block) => block.content)
    .flat()
    .map((para) =>
      para.children
        .map((child) => ("text" in child ? child.text : ""))
        .join(" ")
    )
    .join(" ");

  // Get video data if exists
  const articleVideo = article.content.content.find(
    (block) => block.type === "video"
  );
  const videos: VideoObject[] = [];

  if (articleVideo && "urls" in articleVideo && article.subTitle) {
    videos.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: article.title,
      description: article.subTitle,
      thumbnailUrl: [articleVideo.poster],
      uploadDate: new Date(article.time).toISOString(),
      contentUrl: articleVideo.urls[0].url,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: article.titleShort
      ? article.titleShort.slice(0, 109)
      : article.title.slice(0, 109),
    image: article.image?.src
      ? article.image.src
      : `https://a.jfeed.com/v2/articles/${article.id}/og-image.jpeg`,
    video: videos.length > 0 ? videos : undefined,
    description: article.subTitle,
    inLanguage: "he-IL",
    dateCreated: new Date(article.time).toISOString(),
    datePublished: new Date(article.time).toISOString(),
    dateModified: article.lastUpdate
      ? new Date(article.lastUpdate).toISOString()
      : new Date(article.time).toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name || "JFeed",
      url: article.author.url,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "JFeed",
      foundingDate: "2023-01-01",
      logo: {
        "@type": "ImageObject",
        url: "https://www.jfeed.com/logo/jfeed-logo_512.png",
      },
      url: "https://www.jfeed.com/",
    },
    articleSection: article.categories?.[0]?.name,
    keywords: article.tags?.map((tag) => tag.name).join(","),
    articleBody: articleBody,
  };
}

// Returns breadcrumb structured data for the article
export function generateBreadcrumbStructuredData(article: ArticleData) {
  const items = [];
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  // Add home
  items.push({
    "@type": "ListItem",
    position: 1,
    name: "Home",
    item: baseUrl,
  });

  // Add parent categories
  if (article.categories[0]?.parents) {
    article.categories[0].parents.forEach((parent, index) => {
      items.push({
        "@type": "ListItem",
        position: index + 2,
        name: parent.name,
        item: `${baseUrl}/${parent.slug}`,
      });
    });
  }

  // Add current category
  if (article.categories[0]) {
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: article.categories[0].name,
      item: `${baseUrl}/${article.categories[0].slug}`,
    });
  }

  // Add current article
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: article.title,
    item: `${baseUrl}/${article.categories[0]?.slug}/${article.slug}`,
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function generateRecipeSchema(article: ArticleData) {
  const recipeEntries = article.content.content.filter(
    (block): block is RecipeContent => block.type === "recipe"
  );

  if (recipeEntries.length === 0) return null;

  const images = [
    article.image?.src,
    ...article.content.content
      .filter((block) => block.type === "img")
      .map((block) => block.src),
  ].filter(Boolean) as string[];

  const canonicalUrl = `https://www.jfeed.com/${article.categories[0]?.slug}/${article.slug}`;

  return recipeEntries.map((recipe): RecipeSchema => {
    const recipeSchema: RecipeSchema = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: article.title,
      image: images,
      author: {
        "@type": "Person",
        name: article.author.name || "JFeed",
        ...(article.author.url && { url: article.author.url }),
      },
      datePublished: new Date(article.time).toISOString(),
      description: article.subTitle,
      prepTime: `PT${recipe.prepTime || 0}M`,
      cookTime: `PT${recipe.cookTime || 0}M`,
      totalTime: `PT${(recipe.prepTime || 0) + (recipe.cookTime || 0)}M`,
      keywords: article.tags?.map((tag) => tag.name).join(",") || "",
      recipeIngredient: recipe.ingredientsGroups
        .flatMap((group) => group.ingredients)
        .map((ingredient) => {
          const parts = [];
          if (ingredient.count) parts.push(ingredient.count);
          if (ingredient.countType) parts.push(ingredient.countType);
          parts.push(ingredient.name);
          return parts.join(" ");
        }),
    };

    // Add optional recipe properties
    if (recipe.recipeYield?.count) {
      recipeSchema.recipeYield = recipe.recipeYield.count.toString();
    }

    if (recipe.recipeCategory) {
      recipeSchema.recipeCategory = recipe.recipeCategory;
    }

    // Add recipe instructions if available
    if (recipe.recipeInstructions?.length > 0) {
      recipeSchema.recipeInstructions = recipe.recipeInstructions.map(
        (instruction: RecipeInstructionStep, index) => ({
          "@type": "HowToStep",
          url: `${canonicalUrl}#recipe0step${index + 1}`,
          text: instruction.text, // Using the text property from RecipeInstructionStep
        })
      );
    }

    return recipeSchema;
  });
}

/*export function generateFAQSchema(article: ArticleData) {
  const faqEntries = article.content.content.filter(block => block.type === 'faq');
  
  if (faqEntries.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}*/
