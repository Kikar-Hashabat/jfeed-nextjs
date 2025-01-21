import { Article } from ".";

export interface Category {
  id: number;
  slug: string;
  parents: SubCategory[];
  subCategories: SubCategory[];
  name: string;
  title: string;
  subTitle: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  image: string | null;
  color: string;
  pageStyle: string | null;
  pageStyleProps: Record<string, any>;
  scope: string[];
  dfpScope: string;
}

export interface SubCategory {
  id: number;
  slug: string;
  parents?: Category[];
  subCategories?: Category[];
  title: string;
  image: string | null;
  color: string;
  dfpScope: string;
  name: string;
}

export interface CategoryPageProps {
  params: { category: string };
  searchParams: { page?: string };
}

export interface CategoryWithArticles {
  mainArticles: Article[];
  subCategoriesWithArticles: (SubCategory & { articles: Article[] })[];
  hasMore: boolean;
}
