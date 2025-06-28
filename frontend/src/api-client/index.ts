import axios from 'axios';
import type {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { axiosConfig } from './config';

const apiClient: AxiosInstance = axios.create({
    ...axiosConfig,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    async (error: AxiosError): Promise<AxiosResponse> => {
        return Promise.reject(error);
    },
);

export default apiClient;
