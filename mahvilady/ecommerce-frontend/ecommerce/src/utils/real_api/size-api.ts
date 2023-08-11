
import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "../../interfaces/index"
import {Size} from "@models/size.model"

const get = async (): Promise<Size[]> => {
  const response = await axios.get("/sizes");
  return response.data;
};


const getByPaging = async (pageNumber: number, pageSize: number = 0): Promise<ApiResponse<Size>> => {
  const response = await axios.get(`/sizes/v2`, {

    params: {

      page: pageNumber,

      size: pageSize

    }

  },);
  const sizeResponse: ApiResponse<Size> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return sizeResponse;

}
const post = async (size: Size): Promise<any> => {
  const response = await axios.post("/sizes", size);
  return response;
}
const put = async (id: any, size: any): Promise<any> => {
  const response = await axios.put(`/sizes/${id}`, size);
  return response;
}

const getById = async (id: any): Promise<Size> => {
  const response = await axios.get(`/sizes/${id}`);
  return response.data;
};

const existByName = async (name: any): Promise<boolean> => {
    const response = await axios.get(`/sizes/exist/${name}`);
    console.log(`${response.data} ${name}`)
    return response.data;
  };




export default {  get, getByPaging, post, put, getById,existByName};