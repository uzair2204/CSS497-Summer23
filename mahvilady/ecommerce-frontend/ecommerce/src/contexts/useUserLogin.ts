// useUserLogin.ts
import { useEffect } from "react";
import cartApi from "@utils/real_api/cart-api";
import wishListApi from "@utils/real_api/wish-list-api";
import { useAppContext } from "./AppContext";
import User from "@models/user.model";


const useUserLogin = (user: User | null) => {
  const { dispatch } = useAppContext();
  useEffect(() => {
    const fetchData = async () => {
        console.log('hook called');
      if (user) {
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
    };

    fetchData();
  }, [dispatch, user]);
};

export default useUserLogin;
