import { CartItem, WishProduct } from "@context/AppContext";
import Category from "@models/category.model";
import { CategoryItem } from "@models/categoryNavList.model";
import { Option, PageMeta } from "interfaces";
import cartApi from "./real_api/cart-api";
import Product from "@models/product.model";
import Address from "@models/address.model";
import wishListApi from "./real_api/wish-list-api";
import showAlert from "./show-alert";
import User from "@models/user.model";

export function getPageMeta(data: any): PageMeta {

  const meta: PageMeta = {

    last: data.last,

    totalPages: data.totalPages,

    totalElements: data.totalElements,

    size: data.size,

    pageNumber: data.number,

    first: data.first,

    numberOfElements: data.numberOfElements,

    empty: data.empty

  }
  return meta;

}

export function getListOfSelectedValues(options: Option[]): number[] | string[] {
  const valuesList = options.map((option) => option.value);
  // Use type assertion to cast array elements to either number or string
  // Use type assertion to indicate that the array is either number[] or string[]
  const filteredList = valuesList.filter((value): value is number | string => {
    return typeof value === 'number' || typeof value === 'string';
  }) as number[] | string[];
  return filteredList;
}

export function getSelectedValues(options: Option[]): number | string {
  const valuesList = options.map((option) => option.value);
  console.log(valuesList);
  return valuesList.length > 0 ? valuesList[0] : 0;
}

export const convertCategoryToCategoryItem = (category: Category): CategoryItem => {
  return {
    id: category.id,
    icon: category.icon,
    title: category.name,
    href: `product/view/category/${category.slug}`, // Constructing the href using the slug
    children: category.children.map((child) => convertCategoryToCategoryItem(child)), // Recursively converting children
    featured: category.featured,
    mainNav: category.mainCategory,
    displayOrder: 0
  };
};


export function handleCartChange(amount: number, product: Product, cartList: CartItem[], dispatch: any, userId: number) {
  let exist = cartList.find((item) => item.product.id === product.id);
  if (exist && amount > 0) {
    cartApi.put(product.id, userId, amount);
    showAlert(` ${product.title} quantity updated for cart to ${amount} `,"warn"); 
  } else if (exist) {
    cartApi.del(product.id, userId);
    showAlert(` ${product.title} remved from cart `,"error");
  } else {
    showAlert(` ${product.title} added to cart `,"success");
    cartApi.post(userId, { product: product.id, qty: amount });
  }

  dispatch({
    type: "CHANGE_CART_AMOUNT",
    payload: { product: product, qty: amount },
  });
}



export function handleWishChange(productId: number|string, wishes: WishProduct[], dispatch: any, userId: number) {
  let exist = wishes.find((item) => item.productId === productId);
  console.log(exist?.id);
  console.log(productId);
   if(exist) {
    wishListApi.del(userId, productId);
    showAlert("prodcut removed from the wish list","warn"); 
  } else {
    wishListApi.post(userId, productId);
    showAlert("prodcut added to the wish list","success"); 
  }

  dispatch({
    type: "ADD_WISH",
    payload: { productId: productId, userId: userId },
  });
}

export async function loginUser(dispatch: any, user: User) {

  console.log(user);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    try {
      const cartData = await cartApi.get(user.id); // Replace user.id with the actual user ID
      dispatch({ type: "INITIALIZE_CART", payload: cartData });
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
    try {
      const wishData = await wishListApi.get(user.id); // Replace user.id with the actual user ID
      dispatch({ type: "INITIALIZE_WISH", payload: wishData });
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  } else {
    // If user is null, initialize cart and wish lists with empty arrays
    dispatch({ type: "INITIALIZE_CART", payload: [] });
    dispatch({ type: "INITIALIZE_WISH", payload: [] });
  }
  dispatch({ type: "USER_SESSION", payload: user });
}


export function formatAddress(address: Address): string {
  const parts = [];


  if (address.name) {
    parts.push(`Name: ${address.name}\n`);
  }
  if (address.phone) {
    parts.push(`Phone: ${address.phone}\n`);
  }
  if (address.address) {
    parts.push(`Address: ${address.address}`);
  }

  if (address.street) {
    parts.push(`Street: ${address.street}`);
  }

  if (address.city) {
    parts.push(`City: ${address.city}`);
  }

  if (address.country) {
    parts.push(address.country);
  }

  if (address.zipCode) {
    parts.push(`zip code: ${address.zipCode}`);
  }


  



  return parts.join(' ');
}