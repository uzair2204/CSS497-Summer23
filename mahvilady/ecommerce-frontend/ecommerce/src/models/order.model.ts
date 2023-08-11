import Address from "./address.model";
import Product from "./product.model";
import User from "./user.model";

export enum OrderStatus {
  PLACED = "PLACED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface OrderItem {
  id: number;
  product: Product;
  productName: string;
  productPrice: number;
  discount: number;
  discountedPrice: number;
  productQuantity: number;
  size: string;
  order: Order;
  reviewed:boolean;
}

interface Order {
  id: number;
  items: OrderItem[];
  createdAt: Date;
  discount: number;
  shippingCharges: number;
  totalPrice: number;
  grossTotal: number;
  deliveredAt: Date | null;
  estimateDeliveryAt:Date|null;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  user: User;
}


export default Order;
