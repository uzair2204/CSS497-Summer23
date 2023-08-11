import { HealthCarouselItem } from "models/carousel.model";
import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "../../interfaces/index"

const getCarousels = async (): Promise<HealthCarouselItem[]> => {
  const response = await axios.get("/carousel-data");
  return response.data;
};


const getCarouselByPaging = async (pageNumber: number, pageSize: number = 0): Promise<ApiResponse<HealthCarouselItem>> => {
  const response = await axios.get(`/carousel-data/v2`, {

    params: {

      page: pageNumber,

      size: pageSize

    }

  },);
  const serviceResponse: ApiResponse<HealthCarouselItem> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}
const postCarousel = async (formData: FormData): Promise<any> => {
  const response = await axios.post("/carousel-data/v2", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}
const putCarousels = async (id: any, service: any): Promise<any> => {
  const response = await axios.put(`/carousel-data/${id}`, service);
  return response;
}

const putCarouselsWithImage = async (id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/carousel-data/${id}/v2`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const getCarouselById = async (id: any): Promise<HealthCarouselItem> => {
  const response = await axios.get(`/carousel-data/${id}`);
  return response.data;
};

const toggleActive = async (id: number): Promise<any> => {
  const response = await axios.put(`/carousel-data/${id}/toggle-status`);

  return response;
}



export default { getCarousels, getCarouselByPaging, postCarousel, putCarousels, getCarouselById, putCarouselsWithImage,toggleActive };