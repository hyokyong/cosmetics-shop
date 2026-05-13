import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export function setInterceptors(axiosService: AxiosInstance) {
  // 요청 인터셉터 - 모든 요청에 토큰 자동 첨부
  axiosService.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // zustand는 모듈 레벨에서 import하면 순환참조 발생하므로 동적으로 가져옴
      const { useAuthStore } = require('@store/authStore');
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 응답 인터셉터 - 401 시 토큰 갱신 후 재요청
  axiosService.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { useAuthStore } = require('@store/authStore');
          const refreshToken = useAuthStore.getState().refreshToken;

          const { data } = await axiosService.post('/auth/refresh', { refreshToken });

          useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

          return axiosService(originalRequest);
        } catch {
          const { useAuthStore } = require('@store/authStore');
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosService;
}
