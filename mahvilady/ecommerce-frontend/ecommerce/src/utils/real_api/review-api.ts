import { realAxios as axios } from "../../__server__/mock";



const eligiable = async (userId: number, productId: number | String): Promise<boolean> => {
    try {
        const response = await axios.get(`/order-items/reviewed/${productId}/${userId}`);
        return response.data;
    } catch (error) {
        return false;
    }

};

const post = async (userId: number, productId: any,review:any): Promise<any> => {
    const response = await axios.post(`/reviews/${productId}/${userId}`,review);
    return response;
}

export default {
    eligiable, post
};