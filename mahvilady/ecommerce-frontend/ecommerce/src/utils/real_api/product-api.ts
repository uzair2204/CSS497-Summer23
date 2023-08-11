import Product from "models/product.model";
import { realAxios as axios } from "../../__server__/mock";
import { getPageMeta } from "@utils/common-utils";
import { ApiResponse } from "../../interfaces/index"
import Shop from "@models/shop.model";


const slugExist = async (slug: any): Promise<boolean> => {
  const response = await axios.get(`/products/exist/slug/${slug}`);
  return response.data;
}


const get = async (): Promise<Product[]> => {
  const response = await axios.get("/products");
  return response.data;
};

const getBySlug = async (slug: any): Promise<Product> => {
  const response = await axios.get(`/products/slug/${slug}`);
  return response.data;
};
const getSlugs = async (): Promise<{ params: { slug: string } }[]> => {
  const response = await axios.get(`/products/slugs`);
  return response.data.map((item) => ({ params: { slug: item } }));
}

const getSuggestions = async (name: any, category: any = ""): Promise<string[]> => {
  const response = await axios.get(`/products/suggestion`, {

    params: {
      name: name,
      category: category,
    }

  },);
  return response.data;
}

const getTopNewProduct = async (): Promise<Product[]> => {
  const list = await getByPaging(0, "creationTimeStamp");
  return list.data;
}

const getShopsByCategoryIds = async (ids: any, pageSize: number = 8): Promise<Shop[]> => {
  const response = await axios.get(`/products/shops-by-categories`, {

    params: {
      categoryIds: ids,
      size: pageSize,
    }

  },);
  return response.data.content;
}

const getProductsByCategoryIds = async (ids: any, sort: string = '', pageSize: number = 5,): Promise<Product[]> => {
  const response = await axios.get(`/products/by-categories`, {
    params: {
      categoryIds: ids,
      size: pageSize,
      sort: sort
    }
  },);
  return response.data.content;

}

const getProductsByNameContaining = async (name: any, pageNumber: number, sort: string = '', pageSize: any = 0): Promise<ApiResponse<Product>> => {
  const response = await axios.get(`/products/search`, {
    params: {
      name: name,
      size: pageSize,
      page: pageNumber,
      sort: sort
    }
  },);
  const serviceResponse: ApiResponse<Product> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}

const getProductsByBrandSlug = async (slug: any, pageNumber: number, sort: string = '', pageSize: any = 0): Promise<ApiResponse<Product>> => {
  const response = await axios.get(`/products/brand/${slug}`, {
    params: {
      size: pageSize,
      page: pageNumber,
      sort: sort
    }
  },);
  const serviceResponse: ApiResponse<Product> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}

const getProductsByCategorySlug = async (slug: any, pageNumber: number, sort: string = '', pageSize: any = 0): Promise<ApiResponse<Product>> => {
  const response = await axios.get(`/products/category/${slug}`, {
    params: {
      size: pageSize,
      page: pageNumber,
      sort: sort
    }
  },);
  const serviceResponse: ApiResponse<Product> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}


const getProductsByFilter = async (criteria: any, pageNumber: number, sort: string = '', pageSize: any = 0): Promise<ApiResponse<Product>> => {

  const response = await axios.post(`/products/by-criteria`, {
    pageNumber:pageNumber,
    pageSize:pageSize,
    sort:sort,
    criteria:criteria
},);
  const serviceResponse: ApiResponse<Product> = {

    data: response.data.content,
    meta: getPageMeta(response.data),

  }
  return serviceResponse;

}


const getByPaging = async (pageNumber: number, sort: string = '', pageSize: any = 0): Promise<ApiResponse<Product>> => {
  const response = await axios.get(`/products/v2`, {

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
const post = async (shopId: any, formData: FormData): Promise<any> => {
  const response = await axios.post(`/products/${shopId}/v2`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const put = async (shopId: any, id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/products/${id}/${shopId}`, formData);
  return response;
}


const putWithImageAndThumbNail = async (shopId: any, id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/products/${id}/${shopId}/both`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const putWithImage = async (shopId: any, id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/products/${id}/${shopId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const putWithThumbNail = async (shopId: any, id: any, formData: FormData): Promise<any> => {
  const response = await axios.put(`/products/${id}/${shopId}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

const getById = async (id: any): Promise<Product> => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

const toggleActive = async (id: number): Promise<any> => {
  const response = await axios.put(`/products/${id}/toggle-status`);

  return response;
}



export default {
  slugExist, get, getByPaging, post, put, getById, putWithImageAndThumbNail, putWithThumbNail, putWithImage,
  toggleActive, getTopNewProduct, getBySlug, getSlugs, getShopsByCategoryIds, getProductsByCategoryIds, getProductsByNameContaining,
  getSuggestions,getProductsByFilter,getProductsByBrandSlug,getProductsByCategorySlug
};