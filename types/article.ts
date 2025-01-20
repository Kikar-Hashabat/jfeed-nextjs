export interface ArticleImage {
  v: number;
  src: string;
  height: number;
  width: number;
  alt: string;
  credit: string;
  preview: string | null;
}

export interface Article {
  id: number;
  slug: string;
  author: string;
  categoryId: number;
  categorySlug: string;
  image: ArticleImage;
  title: string;
  titleShort: string | null;
  subTitle: string;
  roofTitle: string;
  time: number;
  props: string[];
}
