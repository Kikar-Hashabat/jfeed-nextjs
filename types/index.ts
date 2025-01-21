export interface GetArticlesV2Params {
  category?: string;
  categorySlug?: string;
  categoryId?: string; // Should be numeric, but it's passed as a string in queries
  authorSlug?: string;
  authorId?: string; // Should be numeric, but it's passed as a string in queries
  tag?: string;
  tagId?: string; // Should be numeric, but it's passed as a string in queries
  related?: string; // Slug of a related article
  query?: string; // Search string
  mostRead?: boolean;
  hotGeneral?: boolean;
  hotVod?: boolean;
  hotKids?: boolean;
  marker?: boolean;
  gallery?: boolean;
  mostCommented?: boolean;
  marketing?: boolean;
  leshabat?: string; // Specific string for filtering
  page?: number; // Pagination, default 0
  limit?: number; // Limit the number of results, default defined by constants
  startDate?: string; // Date in ISO format
  endDate?: string; // Date in ISO format
}

export interface Author {
  id: number;
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  twitter: string;
  facebook: string;
  wikipedia: string;
  email: string;
  imageURI: string;
}

export interface Article {
  id: number;
  slug: string;
  author: string;
  categorySlug: string;
  categoryId: number;
  time: number;
  lastUpdate: number | null;
  image?: {
    v: number;
    src: string;
    height: number;
    width: number;
    alt?: string;
    credit?: string;
    URI: string;
  };
  title: string;
  titleShort?: string;
  subTitleShort?: string;
  subTitle?: string;
  roofTitle?: string;
  props?: string[];
  redirectUrl?: string | null;
  comments: number;
  keyName: string;
  isPromoted: boolean;
  categoryColor: string;
}

export interface HomeMainContent {
  viewId?: number;
  view?: string;
  viewFieldsValues?: {
    rowsArticlesSquare?: number;
    rowsArticlesRow?: number;
    rowsArticlesText?: number;
  };
  handlerType: "category";
  category: {
    slug: string;
    title: string;
    name: string;
    color: string;
  };
}

export interface NavCategory {
  slug: string;
  title: string;
  name: string;
  color: string;
}

export interface NavItem {
  handlerType: string;
  category: NavCategory;
}
