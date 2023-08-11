import { CategoryItem } from "@models/categoryNavList.model";
import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "interfaces";



const getNavigations = async (): Promise<CategoryItem[]> => {
  const response = await axios.get("/category-navs");
  return response.data;
};


const getNavigationByPaging = async (pageNumber: number, pageSize: number = 0): Promise<ApiResponse<CategoryItem>> => {
  const response = await axios.get(`/category-navs/v2`, {

    params: {

      page: pageNumber,

      size: pageSize

    }

  },);
  const serviceResponse: ApiResponse<CategoryItem> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}
const postNavigation = async (formData: FormData): Promise<any> => {
  const response = await axios.post("/category-navs/v2", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}
const putNavigations = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/category-navs/${id}`, formData);
  return response;
}

const putNavigationsWithImage = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/category-navs/${id}/v2`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const getNavigationById = async (id: any): Promise<CategoryItem> => {
  const response = await axios.get(`/category-navs/${id}`);
  return response.data;
};

const toggleActive = async (id: number): Promise<any> => {
  const response = await axios.put(`/category-navs/${id}/toggle-status`);

  return response;
}



export default { getNavigations, getNavigationByPaging, postNavigation, putNavigations, getNavigationById, putNavigationsWithImage, toggleActive };