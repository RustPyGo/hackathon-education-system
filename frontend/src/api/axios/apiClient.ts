import axios from 'axios';
import type {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { axiosConfig } from './config';

interface FailedQueueItem {
    resolve: (value: AxiosResponse) => void;
    reject: (reason?: unknown) => void;
}

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshResponse {
    success: boolean;
    message?: string;
}

const apiClient: AxiosInstance = axios.create({
    ...axiosConfig,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown): void => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve({} as AxiosResponse);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    async (error: AxiosError): Promise<AxiosResponse> => {
        const originalRequest = error.config as RetryConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<AxiosResponse>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return apiClient(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await fetch(
                    `${axiosConfig.baseURL}/auth/refresh`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!refreshResponse.ok) {
                    throw new Error(
                        `Refresh failed: ${refreshResponse.status}`
                    );
                }

                const refreshData: RefreshResponse =
                    await refreshResponse.json();

                if (!refreshData.success) {
                    throw new Error(
                        refreshData.message || 'Refresh token invalid'
                    );
                }

                processQueue(null);

                return apiClient(originalRequest);
            } catch (refreshError: unknown) {
                processQueue(refreshError);

                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
