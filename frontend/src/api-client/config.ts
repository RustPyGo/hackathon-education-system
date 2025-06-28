import {
    BASE_URL_DEFAULT as BASE_API_URL,
    BASE_TIME_OUT_DEFAULT,
    BASE_HEADERS_DEFAULT,
} from './constants';

export const axiosConfig = {
    baseURL: process.env.API_URL || BASE_API_URL,
    timeout: BASE_TIME_OUT_DEFAULT,
    headers: BASE_HEADERS_DEFAULT,
};
