import  Category  from "@models/category.model";
import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "interfaces";



const get = async (): Promise<Category[]> => {
  const response = await axios.get("/categories");
  return response.data;
};


const getNames = async (): Promise<string[]> => {
  const response = await axios.get("/categories/names");
  return response.data;
};


const getByPaging = async (pageNumber: number, pageSize: number = 0): Promise<ApiResponse<Category>> => {
  const response = await axios.get(`/categories/v2`, {

    params: {

      page: pageNumber,

      size: pageSize

    }

  },);
  const serviceResponse: ApiResponse<Category> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}
const post = async (formData: FormData): Promise<any> => {
  const response = await axios.post("/categories/v2", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}
const put = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/categories/${id}`, formData);
  return response;
}

const putWithImage = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/categories/${id}/v2`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const getNavigationById = async (id: any): Promise<Category> => {
  const response = await axios.get(`/categories/${id}`);
  return response.data;
};

const toggleActive = async (id: number): Promise<any> => {
  const response = await axios.put(`/categories/${id}/toggle-status`);

  return response;
}



export default { get: get, getByPaging, post, put, putWithImage,getNavigationById, toggleActive,getNames };