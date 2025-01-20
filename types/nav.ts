interface Category {
  slug: string;
  title: string;
  name: string;
  color: string;
}

interface NavItem {
  handlerType: "category";
  category: Category;
}
