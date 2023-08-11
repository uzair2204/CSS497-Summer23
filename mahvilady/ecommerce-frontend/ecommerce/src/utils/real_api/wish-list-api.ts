import Product from "models/product.model";
import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "../../interfaces/index"
import { WishProduct } from "@context/AppContext";


const getByPaging = async (userId:number, pageNumber: number, sort: string = '', pageSize: any = 0): Promise<ApiResponse<Product>> => {
  const response = await axios.get(`/wish-list/product/${userId}`, {
    params: {
      page: pageNumber,
      size: pageSize,
      sort: sort
    }

  },);
  const serviceResponse: ApiResponse<Product> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}

const get = async (userId: number): Promise<WishProduct[]> => {
    const response = await axios.get(`wish-list/wishes/${userId}`);
    return response.data;
};

const post = async ( userId: number,productId: any): Promise<any> => {
  const response = await axios.post(`/wish-list/${userId}/${productId}`);
  return response;
}

const del = async ( userId: number,productId: any): Promise<any> => {
  const response = await axios.delete(`/wish-list/${userId}/${productId}`);
  return response;
}






export default {
   getByPaging,post,get,del
};