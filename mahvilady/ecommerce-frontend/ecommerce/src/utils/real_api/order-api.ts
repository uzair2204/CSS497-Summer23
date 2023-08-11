import Order from "@models/order.model";
import { realAxios as axios } from "../../__server__/mock";
import { CartItem } from "@context/AppContext";
import { ApiResponse } from "interfaces";
import { getPageMeta } from "@utils/common-utils";


const get = async (userId: number): Promise<Order[]> => {
  const response = await axios.get(`/order/user/${userId}`);
  return response.data;
};

const getById = async (id: any): Promise<Order> => {
  const response = await axios.get(`/orders/${id}`);
  console.log(response.data)
  return response.data;
};


const getIds = async (): Promise<any[]> => {
  const response = await axios.get(`/orders/order-ids`);
  return response.data.map((item) => ({ params: { id: item.toString() } }));;
};

const getByUserId = async (userId: number, pageNumber: number, sort: string = 'createdAt,desc', pageSize: number = 10): Promise< ApiResponse<Order>> => {
  const response = await axios.get(`/orders/user/${userId}`, {
    params: {
      size: pageSize,
      sort: sort,
      page:pageNumber
    }
  },);
  const serviceResponse: ApiResponse<Order> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}



const getByPaging = async ( pageNumber: number, sort: string = 'createdAt,desc', pageSize: number = 10): Promise< ApiResponse<Order>> => {
  const response = await axios.get(`/orders`, {
    params: {
      size: pageSize,
      sort: sort,
      page:pageNumber
    }
  },);
  const serviceResponse: ApiResponse<Order> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}

const getByPagingByStatus = async (status:any, pageNumber: number, sort: string = 'createdAt,desc', pageSize: number = 10): Promise< ApiResponse<Order>> => {
  const response = await axios.get(`/orders/by-status/${status}`, {
    params: {
      size: pageSize,
      sort: sort,
      page:pageNumber
    }
  },);
  const serviceResponse: ApiResponse<Order> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}

const post = async (userId: number, data: any): Promise<Order> => {
  const response = await axios.post(`/orders/${userId}`, data);
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

const updateStatus = async (orderId: any, orderStatus: any): Promise<any> => {
  const response = await axios.put(`/orders/update-status/${orderId}/${orderStatus}`);
  return response;
}





export default { get, post, put, del,getByUserId,getById,getIds, getByPaging,updateStatus,getByPagingByStatus};