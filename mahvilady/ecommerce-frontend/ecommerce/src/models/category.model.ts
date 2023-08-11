import Product from "./product.model";

interface Category {
  id: 1,
  name: string,
  slug: string,
  icon: string,
  featured: boolean,
  mainCategory: boolean,
  description: string,
  parent?: Category,
  children: Category[],
  products: Product[]
}

export default Category;
