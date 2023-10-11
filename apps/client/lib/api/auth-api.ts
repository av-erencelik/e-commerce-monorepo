import { GenericResponse, IApiError } from '../../types/api';
import { env } from '../../env.mjs';
import axios from 'axios';

const MAX_RETRY = 3;
let currentRetry = 0;

const authApi = axios.create({
  baseURL: env.NEXT_PUBLIC_NX_API_URL,
  withCredentials: true,
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const refreshAccessTokenFn = async () => {
  return await authApi.post<GenericResponse | IApiError>('/auth/refresh-token');
};

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response?.data.message as string;
    if (
      errMessage.includes('Not authorized') &&
      currentRetry < MAX_RETRY &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      try {
        const { data } = await refreshAccessTokenFn();
        if (data.message === 'Tokens refreshed successfully') {
          currentRetry = 0;
          return authApi(originalRequest);
        } else {
          currentRetry++;
        }
      } catch (error) {
        currentRetry++;
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;
