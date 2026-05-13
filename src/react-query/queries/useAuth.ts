import { useMutation } from '@tanstack/react-query';
import { postLogin, postSignup, getEmailCheck } from '@api/auth';
import { useAuthStore } from '@store/authStore';
import { LoginRequest, SignupRequest } from '@/types/index';

export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();
  return useMutation({
    mutationFn: (body: LoginRequest) => postLogin(body),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (body: SignupRequest) => postSignup(body),
  });
};

export const useEmailCheck = () => {
  return useMutation({
    mutationFn: (email: string) => getEmailCheck(email),
  });
};
