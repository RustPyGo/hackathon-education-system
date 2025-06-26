import {
    BASE_URL_DEFAULT,
    BASE_TIME_OUT_DEFAULT,
    BASE_WITH_CREDENTIALS_DEFAULT,
    BASE_HEADERS_DEFAULT,
} from './constants';

export const axiosConfig = {
    baseURL: import.meta.env.VITE_API_URL || BASE_URL_DEFAULT,
    timeout: BASE_TIME_OUT_DEFAULT,
    withCredentials: BASE_WITH_CREDENTIALS_DEFAULT,
    headers: BASE_HEADERS_DEFAULT,
};
