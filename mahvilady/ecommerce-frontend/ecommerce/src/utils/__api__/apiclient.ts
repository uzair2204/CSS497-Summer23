import {mockInstance as axios} from "../../__server__/mock";

export const springDataRestapiClients = axios.create(
    {
        baseURL: 'http://localhost:8080/data-rest-api'
    }
)

export const apiClients = axios.create(
    {
        baseURL: 'http://localhost:8080'
    }
)