export interface Tag {
  id: number;
  slug: string;
  name: string;
  isLean: boolean;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  metaKeywords: string;
  autoLink: boolean;
  status: "published" | "draft" | "deleted" | "need_to_improve" | string;
  metadata: Record<string, any>;
  image: string | null;
  content:
    | {
        type: "paragraph";
        children: {
          text: string;
        }[];
      }[]
    | null;
  type: string;
  created: string;
  updated: string;
  deletedAt: string | null;
  keywords: {
    id: number;
    keyword: string;
  }[];
  imageSrc: string | null;
  articlesCount: number;
}
