import { axiosService } from "@/api/axiosInstance";
import { LoginRequest, SignupRequest, LoginResponse } from "@/types/index";

// 로그인
export const postLogin = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await axiosService.post("/auth/login", body);
  return data;
};

// 회원가입
export const postSignup = async (body: SignupRequest): Promise<void> => {
  const { data } = await axiosService.post("/auth/signup", body);
  return data;
};

// 이메일 중복 체크
export const getEmailCheck = async (
  email: string,
): Promise<{ isDuplicate: boolean }> => {
  const { data } = await axiosService.get(`/auth/check-email?email=${email}`);
  return data;
};

// 토큰 갱신
export const postRefreshToken = async (refreshToken: string) => {
  const { data } = await axiosService.post("/auth/refresh", { refreshToken });
  return data;
};
