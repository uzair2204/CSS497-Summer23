import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "../../interfaces/index"
import Service from "@models/service.model"

const get = async (): Promise<Service[]> => {
  const response = await axios.get("/services");
  return response.data;
};


const getByPaging = async (pageNumber: number, pageSize: number = 10): Promise<ApiResponse<Service>> => {
  const response = await axios.get(`/services/v2`, {

    params: {

      page: pageNumber,

      size: pageSize

    }

  },);
  const serviceResponse: ApiResponse<Service> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}
const post = async (formData: FormData): Promise<any> => {
  const response = await axios.post("/services/v2", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}
const put = async (id: any, service: any): Promise<any> => {
  const response = await axios.put(`/services/${id}`, service);
  return response;
}

const putWithImage = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/services/${id}/v2`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const getById = async (id: any): Promise<Service> => {
  const response = await axios.get(`/services/${id}`);
  return response.data;
};

const toggleActive = async (id: number): Promise<any> => {
  const response = await axios.put(`/services/${id}/toggle-status`);

  return response;
}



export default {  get, getByPaging, post, put, getById, putWithImage,toggleActive };