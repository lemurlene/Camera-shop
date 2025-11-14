import axios, { AxiosInstance, AxiosError } from 'axios';
import { DetailMessageType } from './type';
import { BASE_URL, SERVER_TIMEOUT } from './const';

function createAPI(): AxiosInstance {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: SERVER_TIMEOUT,
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      throw error;
    }
  );
  return api;
}

export default createAPI;
