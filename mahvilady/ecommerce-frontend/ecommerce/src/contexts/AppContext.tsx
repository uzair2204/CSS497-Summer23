import Product from "@models/product.model";
import { createContext, FC, ReactNode, useContext, useMemo, useReducer } from "react";
import User from "@models/user.model";

// =================================================================================
type InitialState = { cart: CartItem[]; isHeaderFixed: boolean, wish: WishProduct[], user: User };

export type CartItem = {
  qty: number;
  product: Product;
  id?: string | number;
};

export type WishProduct = {
  id?: number;
  productId: number;
  userId?: number;
};


type CartActionType = { type: "CHANGE_CART_AMOUNT"; payload: CartItem };
type intializeCartActionType = { type: "INITIALIZE_CART"; payload: CartItem[] };
type wishActionType = { type: "ADD_WISH"; payload: WishProduct };
type intializeWishActionType = { type: "INITIALIZE_WISH"; payload: WishProduct[] };
type LayoutActionType = { type: "TOGGLE_HEADER"; payload: boolean };
type UserActionType = { type: "USER_SESSION"; payload: User | null };
type ActionType = CartActionType | LayoutActionType | intializeCartActionType | wishActionType | intializeWishActionType | UserActionType;

// =================================================================================


const INITIAL_STATE = { cart: [], isHeaderFixed: false, wish: [], user: null };

interface ContextProps {
  state: InitialState;
  dispatch: (args: ActionType) => void;
}


const AppContext = createContext<ContextProps>({
  state: INITIAL_STATE,
  dispatch: () => { },
});

const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case "TOGGLE_HEADER":
      return { ...state, isHeaderFixed: action.payload };

    case "CHANGE_CART_AMOUNT":
      let cartList = state.cart;
      let cartItem = action.payload;
      let exist = cartList.find((item) => item.product.id === cartItem.product.id);

      if (cartItem.qty < 1) {
        const filteredCart = cartList.filter((item) => item.product.id !== cartItem.product.id);
        return { ...state, cart: filteredCart };
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (exist) {
        const newCart = cartList.map((item) =>
          item.product.id === cartItem.product.id ? { ...item, qty: cartItem.qty } : item
        );
        //api call update cart
        return { ...state, cart: newCart };
      }
      return { ...state, cart: [...cartList, cartItem] };

    case "INITIALIZE_CART":
      return { ...state, cart: action.payload };

    case "ADD_WISH":
      let wishList = state.wish;
      let wishItem = action.payload;
      let wishExist = wishList.find((item) => item.productId === wishItem.productId);
      // IF PRODUCT ALREADY EXITS IN CART
      if (wishExist) {
        const filteredWish = wishList.filter((item) => item.productId !== wishItem.productId);
        return { ...state, wish: filteredWish };
      }
      return { ...state, wish: [...wishList, wishItem] };


    case "INITIALIZE_WISH":
      return { ...state, wish: action.payload };

    case "USER_SESSION":
      return { ...state, user: action.payload };  

    default: {
      return state;
    }
  }
};

// =======================================================
type AppProviderProps = { children: ReactNode };
// =======================================================

export const AppProvider: FC<AppProviderProps> = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
