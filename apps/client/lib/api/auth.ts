import { GenericResponse, ILoginResponse } from '../../types/api';
import { LoginData, SignupData } from '../../types';
import authApi from './auth-api';

export const logoutUserFn = async () => {
  const response = await authApi.post<GenericResponse>('/auth/logout');
  return response.data;
};

export const loginUserFn = async (data: LoginData) => {
  const response = await authApi.post<ILoginResponse>('/auth/login', data);
  return response.data;
};

export const signupUserFn = async (data: SignupData) => {
  const response = await authApi.post<ILoginResponse>('/auth/signup', data);
  return response.data;
};

export const resendVerificationEmailFn = async () => {
  const response = await authApi.put<GenericResponse>('/auth/verify-email');
  return response.data;
};

export const verifyEmailFn = async (token: string) => {
  const response = await authApi.post<GenericResponse>(
    `/auth/verify-email?token=${token}`
  );
  return response.data;
};
