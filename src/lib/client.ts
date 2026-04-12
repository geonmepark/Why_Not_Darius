import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiError } from '@/types/common';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        status: 0,
        code: 'TIMEOUT_ERROR',
        message: '요청이 제한 시간을 초과했습니다.',
      } satisfies ApiError);
    }
    if (!error.response) {
      return Promise.reject({
        status: 0,
        code: 'NETWORK_ERROR',
        message: '네트워크 오류가 발생했습니다.',
      } satisfies ApiError);
    }
    const status = error.response.status;
    const data = (error.response.data as Record<string, unknown>) ?? {};
    return Promise.reject({
      status,
      code: (data.code as string) || `HTTP_${status}`,
      message: (data.message as string) || '서버 오류가 발생했습니다.',
    } satisfies ApiError);
  },
);
