import { axiosConfig } from './config';
import axios from 'axios';
import type {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';

const apiClient: AxiosInstance = axios.create({
    ...axiosConfig,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true, // Enable CORS credentials
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);

        // Add CORS headers if not present
        if (!config.headers['Origin']) {
            config.headers['Origin'] = window.location.origin;
        }

        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        console.log('Response:', response);
        return response;
    },
    async (error: AxiosError): Promise<AxiosResponse> => {
        // Handle CORS errors specifically
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error - Check CORS configuration:', error);
        }

        if (error.response?.status === 0) {
            console.error(
                'CORS Error - Request blocked by CORS policy:',
                error
            );
        }

        return Promise.reject(error);
    }
);

export default apiClient;
