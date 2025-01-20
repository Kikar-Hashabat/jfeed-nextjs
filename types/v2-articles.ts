export interface IArticleItemV2 {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: {
    src: string;
    alt?: string;
  };
  categorySlug?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  redirectUrl?: string;
}

export interface IArticleItemsV2 {
  items: IArticleItemV2[];
  total: number;
  page: number;
  limit: number;
}

export interface IArticlePublic {
  id: string;
  slug: string;
  title: string;
  content: string;
  image?: {
    src: string;
    alt?: string;
  };
  categorySlug?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ArticleOptionsQuery {
  adminPreview?: boolean;
  [key: string]: any;
}

export interface GetArticlesQuery {
  category?: string;
  categorySlug?: string;
  categoryId?: string;
  authorSlug?: string;
  authorId?: string;
  tag?: string;
  query?: string;
  mostRead?: boolean;
  hotGeneral?: boolean;
  hotVod?: boolean;
  hotKids?: boolean;
  marker?: boolean;
  gallery?: boolean;
  mostCommented?: boolean;
  marketing?: boolean;
  related?: string;
  leshabat?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  tagId?: string;
}
