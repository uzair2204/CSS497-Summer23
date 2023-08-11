import User from "@models/user.model";
import { realAxios as axios } from "../../__server__/mock";


const get = async (userId: number): Promise<User> => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
};

const authenticate = async (data: any): Promise<User | null> => {
    try {
        const response = await axios.post(`/users/authenticate`, data);
        return response.data;
    } catch (error) {
        console.error('');
        return null;
    }

}

const emailExist = async (email: any): Promise<Boolean> => {
    try {
        const response = await axios.get(`/users/email/exist/${email}`);
        return response.data;
    } catch (error) {
        console.error('');
        return true;
    }

}


const register = async (data: any): Promise<User> => {
    try {
        const response = await axios.post(`/users/register`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }

}

const put = async (userId: number, data: any): Promise<User> => {
    try {
        const response = await axios.put(`/users/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }

}

const putWithImage = async (userId: any, formData: FormData): Promise<any> => {
    try {
        const response = await axios.put(`/users/${userId}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


const updatepassword = async (userId: any, data: any): Promise<any> => {
    try {
        const response = await axios.post(`/users/update-password/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}






export default { get, authenticate, emailExist, register, put, putWithImage,updatepassword };