import Shop from "./shop.model";

// User.ts
 interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string; // You might want to use a specific date format here
  password: string; // You might want to avoid sending passwords to the frontend
  verified: boolean;
  role: UserRole;
  shop:Shop
}

// UserRole.ts
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  VENDOR = "VENDOR",
}


export default User;