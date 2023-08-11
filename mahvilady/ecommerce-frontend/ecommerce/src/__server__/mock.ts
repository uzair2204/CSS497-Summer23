import axios from "axios";
import MockAdapter from "axios-mock-adapter";

export const realAxios = axios.create(
    {
        baseURL: 'http://localhost:8080'
    }
);

// Mock Axios instance
export const mockInstance = axios.create();

const Mock = new MockAdapter(mockInstance);
export default Mock;
