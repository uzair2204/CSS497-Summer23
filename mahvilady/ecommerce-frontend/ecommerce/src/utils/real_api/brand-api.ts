import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "../../interfaces/index"
import Brand from "@models/Brand.model"

const get = async (): Promise<Brand[]> => {
  const response = await axios.get("/brands");
  return response.data;
};


const getNames = async (): Promise<string[]> => {
  const response = await axios.get("/brands/names");
  return response.data;
};


const getByPaging = async (pageNumber: number, pageSize: number = 0): Promise<ApiResponse<Brand>> => {
  const response = await axios.get(`/brands/v2`, {

    params: {

      page: pageNumber,

      size: pageSize

    }

  },);
  const brandResponse: ApiResponse<Brand> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return brandResponse;

}
const post = async (formData: FormData): Promise<any> => {
  const response = await axios.post("/brands/v2", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}
const put = async (id: any, brand: any): Promise<any> => {
  const response = await axios.put(`/brands/${id}`, brand);
  return response;
}

const putWithImage = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/brands/${id}/v2`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const getById = async (id: any): Promise<Brand> => {
  const response = await axios.get(`/brands/${id}`);
  return response.data;
};

const toggleActive = async (id: number): Promise<any> => {
  const response = await axios.put(`/brands/${id}/toggle-status`);

  return response;
}



export default { get, getByPaging, post, put, getById, putWithImage,toggleActive,getNames };