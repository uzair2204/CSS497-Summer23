import Shop from "./shop.model";
import Review from "./Review.model";
import Category from "./category.model";
import Brand from "./Brand.model";
import { Size } from "./size.model";

interface Product {

  id: number|string;
  title: string;
  description?: string;
  slug: string;
  price: number;
  retailPrice?: number;
  salePrice?: number;
  discount?: number;
  thumbnail?: string;
  status?: string;
  published?: boolean;
  onDiscount?: boolean;
  rating?: number;
  stock?: number;
  unit?: any;
  colors?: string[];
  shop?: Shop;
  brand?: Brand;
  size?: Size[];
  images?: string[];
  categories?: Category[];
  reviews?: Review[];
}

export default Product;
