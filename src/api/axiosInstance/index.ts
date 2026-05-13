import axios from "axios";
import { setInterceptors } from "./interceptors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AXIOS_TIMEOUT = 18000;
const AXIOS_HEADERS = {
  "Cache-Control": "no-cache",
  "Content-Type": "application/json; charset=utf-8",
};

// 인증 불필요 인스턴스
const createAxios = () => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: AXIOS_TIMEOUT,
    headers: AXIOS_HEADERS,
  });
};

// 인증 필요 인스턴스
const createAxiosWithAuth = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: AXIOS_TIMEOUT,
    headers: AXIOS_HEADERS,
  });
  return setInterceptors(instance);
};

// 비인증
export const axiosService = createAxios();

// 인증
export const axiosWithAuth = createAxiosWithAuth();
