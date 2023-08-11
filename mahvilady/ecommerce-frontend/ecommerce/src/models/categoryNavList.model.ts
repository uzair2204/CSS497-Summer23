export type CategoryItem = {
  id:number,
  icon: string;
  title: string;
  href?: string;
  children?:CategoryItem[];
  featured:boolean;
  mainNav:boolean,
  displayOrder:number
};

interface CategoryNavList {
  category: string;
  categoryItem: CategoryItem[];
}

export default CategoryNavList;
