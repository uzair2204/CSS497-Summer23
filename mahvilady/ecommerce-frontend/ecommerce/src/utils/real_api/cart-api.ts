import { realAxios as axios } from "../../__server__/mock";
import { CartItem } from "@context/AppContext";


const get = async (userId: number): Promise<CartItem[]> => {
  const response = await axios.get(`/cart/user/${userId}`);
  return response.data;
};

const post = async (userId: number, data: any): Promise<CartItem> => {
  const response = await axios.post(`/cart/${userId}`, data);
  return response.data;
}

const put = async (productId: any, userId: number, quantity: number): Promise<CartItem> => {
  const response = await axios.put(`/cart/${userId}/${productId}/${quantity}`);
  return response.data;
}

const del = async (productId: any, userId: number): Promise<any> => {
  const response = await axios.delete(`/cart/${userId}/${productId}`);
  return response;
}





export default { get, post, put, del };