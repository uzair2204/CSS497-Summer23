import User from "./user.model";
import Product from "./product.model";

interface Review {
  id: string|number;
  rating: number;
  customer: User;
  comment: string;
  product: Product;
  published?: boolean;
  createdAt:Date
}

export default Review;
